"""Regression tests for final shared-resource ownership and deployment order."""

import json
from pathlib import Path

from aws_cdk import App
from aws_cdk.assertions import Match, Template

import app as cdk_app
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack
from alpine_peak_cdk.repository_stack import RepositoryStack


REPO_ROOT = Path(__file__).resolve().parents[2]
NETWORK_EXPORTS = {
    "SharedVpcId",
    "SharedPublicSubnet1Id",
    "SharedPublicSubnet2Id",
    "SharedPublicSubnet1AvailabilityZone",
    "SharedPublicSubnet2AvailabilityZone",
    "SharedAlbSecurityGroupId",
}


def _application_template() -> Template:
    return Template.from_stack(AlpinePeakStack(App(), "ApplicationStack"))


def test_repository_stack_retains_live_repository_and_exports_uri():
    template = Template.from_stack(RepositoryStack(App(), "RepositoryStack"))
    document = template.to_json()

    repository = document["Resources"]["AlpinePeakRepository"]
    assert repository["DeletionPolicy"] == "Retain"
    assert repository["UpdateReplacePolicy"] == "Retain"
    lifecycle_policy = json.loads(
        repository["Properties"].pop("LifecyclePolicy")["LifecyclePolicyText"]
    )
    assert repository["Properties"] == {
        "EncryptionConfiguration": {"EncryptionType": "AES256"},
        "ImageScanningConfiguration": {"ScanOnPush": False},
        "ImageTagMutability": "MUTABLE",
        "RepositoryName": "ski-rock-climbing-shop",
    }
    assert document["Outputs"]["RepositoryUri"]["Export"] == {
        "Name": "AlpinePeakRepositoryUri"
    }
    assert lifecycle_policy["rules"] == [
        {
            "rulePriority": priority,
            "description": description,
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": [prefix],
                "countType": "imageCountMoreThan",
                "countNumber": 3,
            },
            "action": {"type": "expire"},
        }
        for priority, description, prefix in (
            (1, "Keep the three most recent frontend images", "front-end-"),
            (2, "Keep the three most recent Express API images", "back-end-express-socket-io-api-"),
            (3, "Keep the three most recent .NET API images", "back-end-dotnet-api-"),
        )
    ] + [
        {
            "rulePriority": 4,
            "description": "Expire untagged images after one day",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": 1,
            },
            "action": {"type": "expire"},
        }
    ]


def test_application_imports_shared_network_and_repository_values():
    document = _application_template().to_json()
    serialized = str(document)
    source = (
        REPO_ROOT / "cdk" / "alpine_peak_cdk" / "alpine_peak_stack.py"
    ).read_text(encoding="utf-8")

    for export_name in NETWORK_EXPORTS:
        assert f'Fn.import_value("{export_name}")' in source

    assert "AlpinePeakRepositoryUri" in serialized
    assert "vpc-031a34e2307900372" not in serialized
    assert "subnet-0069d564c7d9784e5" not in serialized
    assert "subnet-0e28687dfd9d81afc" not in serialized
    assert "sg-0190e299544ca1711" not in serialized
    assert "456461478565" not in serialized
    assert "us-west-1" not in serialized


def test_application_owns_service_security_group_with_alb_only_ingress():
    template = _application_template()

    template.resource_count_is("AWS::EC2::SecurityGroup", 2)
    template.has_resource_properties(
        "AWS::EC2::SecurityGroup",
        {
            "GroupDescription": "Alpine Peak ECS service security group",
            "VpcId": {"Fn::ImportValue": "SharedVpcId"},
        },
    )
    template.has_resource_properties(
        "AWS::EC2::SecurityGroupIngress",
        {
            "Description": "Allow HTTP from the shared ALB",
            "FromPort": 80,
            "IpProtocol": "tcp",
            "SourceSecurityGroupId": {
                "Fn::ImportValue": "SharedAlbSecurityGroupId"
            },
            "ToPort": 80,
        },
    )


def test_application_owns_retained_rds_security_group_for_manual_attachment():
    document = _application_template().to_json()
    rds_security_group = document["Resources"]["AlpinePeakRdsSecurityGroup"]

    assert rds_security_group["DeletionPolicy"] == "Retain"
    assert rds_security_group["UpdateReplacePolicy"] == "Retain"
    assert rds_security_group["Properties"]["GroupDescription"] == (
        "Alpine Peak RDS security group"
    )
    assert rds_security_group["Properties"]["VpcId"] == {
        "Fn::ImportValue": "SharedVpcId"
    }

    ingress = document["Resources"]["RdsSecurityGroupfromApplication5432"]
    assert ingress["Properties"] == {
        "Description": "Allow PostgreSQL from the Alpine Peak ECS service",
        "FromPort": 5432,
        "GroupId": {"Fn::GetAtt": ["AlpinePeakRdsSecurityGroup", "GroupId"]},
        "IpProtocol": "tcp",
        "SourceSecurityGroupId": {
            "Fn::GetAtt": ["AlpinePeakServiceSecurityGroup", "GroupId"]
        },
        "ToPort": 5432,
    }
    assert document["Outputs"]["RdsSecurityGroupId"]["Export"] == {
        "Name": "AlpinePeakRdsSecurityGroupId"
    }


def test_runtime_role_arn_uses_stack_pseudo_parameters():
    serialized = str(_application_template().to_json())

    assert "AWS::AccountId" in serialized
    assert "AWS::Partition" in serialized
    assert "arn:aws:iam::456461478565" not in serialized


def test_app_wires_repository_before_application():
    app = App()
    repository_stack, application_stack = cdk_app.create_stacks(app)

    assert repository_stack in application_stack.dependencies
    assert repository_stack.stack_name == "AlpinePeakRepositoryStack"
    assert application_stack.stack_name == "AlpinePeakStack"


def test_deploy_workflow_is_active_and_uses_repository_first_pipeline():
    active = REPO_ROOT / ".github" / "workflows" / "deploy-cdk-aws.yml"
    disabled = active.with_name("deploy-cdk-aws.yml.disabled")

    assert active.exists()
    assert not disabled.exists()
    workflow = active.read_text(encoding="utf-8")
    assert "cdk deploy AlpinePeakRepositoryStack" in workflow
    assert workflow.index("cdk deploy AlpinePeakRepositoryStack") < workflow.index(
        "uses: aws-actions/amazon-ecr-login@v2"
    )
    assert "cdk deploy AlpinePeakStack" in workflow
    assert workflow.index("docker push") < workflow.index(
        "cdk deploy AlpinePeakStack"
    )
    assert "create-repository" not in workflow
    assert "describe-repositories" not in workflow
