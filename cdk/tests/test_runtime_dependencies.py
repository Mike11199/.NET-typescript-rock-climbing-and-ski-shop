"""Verify managed log retention and stable ECS logging configuration."""
from aws_cdk import App
from aws_cdk.assertions import Template
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack


def test_owned_dotnet_log_group_has_30_day_retention_and_retain_policies():
    template = Template.from_stack(AlpinePeakStack(App(), "AlpinePeakStack"))
    template.resource_count_is("AWS::Logs::LogGroup", 1)
    resource = template.to_json()["Resources"]["AlpinePeakDotnetLogGroup"]
    assert resource["Properties"] == {
        "LogGroupName": "/ecs/deploy-ski-shop-back-end-v2-dotnet",
        "RetentionInDays": 30,
    }
    assert resource["DeletionPolicy"] == "Retain"
    assert resource["UpdateReplacePolicy"] == "Retain"
    tasks = template.find_resources("AWS::ECS::TaskDefinition")
    containers = next(iter(tasks.values()))["Properties"]["ContainerDefinitions"]
    assert {c["Name"] for c in containers} == {"front-end", "back-end-dotnet-api"}
    dotnet = next(c for c in containers if c["Name"] == "back-end-dotnet-api")
    assert dotnet["LogConfiguration"]["Options"]["awslogs-group"] == resource["Properties"]["LogGroupName"]
    assert "deploy-ski-shop-back-end-v1-express" not in str(template.to_json())
