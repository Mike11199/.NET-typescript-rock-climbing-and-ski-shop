"""Stack ownership, shared references, and repository lifecycle."""
import inspect
import json
import pytest
from aws_cdk import Stack
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack


@pytest.mark.parametrize("name", [
    "AlpinePeakRepository", "AlpinePeakAliasRecord", "ProductionListenerRule",
    "ProductionTargetGroup", "AlpinePeakRdsDatabase", "AlpinePeakRdsSecurityGroup",
    "AlpinePeakOperatorRdsAccessSecurityGroup", "AlpinePeakDotnetLogGroup",
])
def test_retained_resources(resources, repository, name):
    resource = (repository["Resources"] if name == "AlpinePeakRepository" else resources)[name]
    assert resource["DeletionPolicy"] == resource["UpdateReplacePolicy"] == "Retain"


def test_stack_boundaries(stacks):
    repo, app = stacks
    assert repo in app.dependencies
    assert {s.stack_name for s in app.node.scope.node.children if isinstance(s, Stack)} == {
        "AlpinePeakRepositoryStack", "AlpinePeakStack",
    }


def test_shared_references(document):
    text = str(document)
    source = inspect.getsource(AlpinePeakStack)
    for name in (
        "SharedVpcId", "SharedPublicSubnet1Id", "SharedPublicSubnet2Id",
        "SharedPublicSubnet1AvailabilityZone", "SharedPublicSubnet2AvailabilityZone",
        "SharedAlbSecurityGroupId",
    ):
        assert f'Fn.import_value("{name}")' in source
    for name in ("AlpinePeakRepositoryUri", "AWS::AccountId", "AWS::Partition"):
        assert name in text
    for value in ("subnet-0069d564c7d9784e5", "subnet-0e28687dfd9d81afc",
                  "sg-0190e299544ca1711", "456461478565", "us-west-1"):
        assert value not in text
    assert all(r.get("Properties", {}).get("VpcId") != "vpc-031a34e2307900372"
               for r in document["Resources"].values())


def test_repository(repository):
    props = dict(repository["Resources"]["AlpinePeakRepository"]["Properties"])
    rules = json.loads(props.pop("LifecyclePolicy")["LifecyclePolicyText"])["rules"]
    assert props == {
        "EncryptionConfiguration": {"EncryptionType": "AES256"},
        "ImageScanningConfiguration": {"ScanOnPush": False},
        "ImageTagMutability": "MUTABLE", "RepositoryName": "ski-rock-climbing-shop",
    }
    assert repository["Outputs"]["RepositoryUri"]["Export"] == {"Name": "AlpinePeakRepositoryUri"}
    assert rules == [{
        "rulePriority": priority, "description": f"Keep the three most recent {label} images",
        "selection": {"tagStatus": "tagged", "tagPrefixList": [prefix],
                      "countType": "imageCountMoreThan", "countNumber": 3},
        "action": {"type": "expire"},
    } for priority, label, prefix in (
        (1, "frontend", "front-end-"),
        (2, "Express API", "back-end-express-socket-io-api-"),
        (3, ".NET API", "back-end-dotnet-api-"),
    )] + [{
        "rulePriority": 4, "description": "Expire untagged images after one day",
        "selection": {"tagStatus": "untagged", "countType": "sinceImagePushed",
                      "countUnit": "days", "countNumber": 1},
        "action": {"type": "expire"},
    }]


def test_application_security_groups(template, resources, document):
    template.resource_count_is("AWS::EC2::SecurityGroup", 3)
    template.has_resource_properties("AWS::EC2::SecurityGroup", {
        "GroupDescription": "Alpine Peak ECS service security group",
        "VpcId": {"Fn::ImportValue": "SharedVpcId"},
    })
    template.has_resource_properties("AWS::EC2::SecurityGroupIngress", {
        "Description": "Allow HTTP from the shared ALB", "IpProtocol": "tcp",
        "FromPort": 80, "ToPort": 80,
        "SourceSecurityGroupId": {"Fn::ImportValue": "SharedAlbSecurityGroupId"},
    })
    group = resources["AlpinePeakRdsSecurityGroup"]["Properties"]
    assert group["GroupDescription"] == "Alpine Peak RDS security group"
    assert group["VpcId"] == {"Fn::ImportValue": "SharedVpcId"}
    assert resources["RdsSecurityGroupfromApplication5432"]["Properties"] == {
        "Description": "Allow PostgreSQL from the Alpine Peak ECS service",
        "FromPort": 5432, "ToPort": 5432, "IpProtocol": "tcp",
        "GroupId": {"Fn::GetAtt": ["AlpinePeakRdsSecurityGroup", "GroupId"]},
        "SourceSecurityGroupId": {"Fn::GetAtt": ["AlpinePeakServiceSecurityGroup", "GroupId"]},
    }
    assert document["Outputs"]["RdsSecurityGroupId"]["Export"] == {"Name": "AlpinePeakRdsSecurityGroupId"}
