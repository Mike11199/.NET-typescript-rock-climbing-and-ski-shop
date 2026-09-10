import json
from aws_cdk.assertions import Template


def test_stack_order(stacks):
    repository, application = stacks
    assert repository in application.dependencies
    assert [s.stack_name for s in stacks] == ["AlpinePeakRepositoryStack", "AlpinePeakStack"]


def test_retained_resources(resources):
    for name in (
        "AlpinePeakAliasRecord", "ProductionListenerRule", "ProductionTargetGroup",
        "AlpinePeakRdsDatabase", "AlpinePeakRdsSecurityGroup",
        "AlpinePeakOperatorRdsAccessSecurityGroup", "AlpinePeakDotnetLogGroup",
    ):
        assert resources[name]["DeletionPolicy"] == "Retain"
        assert resources[name]["UpdateReplacePolicy"] == "Retain"


def test_repository(stacks):
    document = Template.from_stack(stacks[0]).to_json()
    repository = document["Resources"]["AlpinePeakRepository"]
    assert repository["DeletionPolicy"] == repository["UpdateReplacePolicy"] == "Retain"
    assert repository["Properties"]["RepositoryName"] == "ski-rock-climbing-shop"
    assert document["Outputs"]["RepositoryUri"]["Export"] == {"Name": "AlpinePeakRepositoryUri"}


def test_image_cleanup(stacks):
    document = Template.from_stack(stacks[0]).to_json()
    props = document["Resources"]["AlpinePeakRepository"]["Properties"]
    rules = json.loads(props["LifecyclePolicy"]["LifecyclePolicyText"])["rules"]
    assert len(rules) == 4
    for rule in rules[:3]:
        assert rule["selection"]["countNumber"] == 3
        assert rule["action"]["type"] == "expire"
    untagged = rules[3]["selection"]
    assert untagged["tagStatus"] == "untagged"
    assert untagged["countType"] == "sinceImagePushed"
    assert untagged["countUnit"] == "days"
    assert untagged["countNumber"] == 1
