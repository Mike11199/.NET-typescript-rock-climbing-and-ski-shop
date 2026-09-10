"""ECS, routing, and shared-resource boundaries."""
import pytest
from aws_cdk.assertions import Match


@pytest.mark.parametrize("kind,count", [
    ("ECS::Service", 1), ("ECS::TaskDefinition", 1),
    ("ElasticLoadBalancingV2::TargetGroup", 1),
    ("ElasticLoadBalancingV2::ListenerRule", 1), ("Route53::RecordSet", 1),
    ("Route53::HostedZone", 0), ("CertificateManager::Certificate", 0),
    ("ElasticLoadBalancingV2::LoadBalancer", 0), ("EC2::VPC", 0),
])
def test_resource_counts(template, kind, count):
    template.resource_count_is(f"AWS::{kind}", count)


def test_service_and_routing(template, resources):
    template.has_resource_properties("AWS::ECS::Service", {
        "ServiceName": "alpine-peak-ski-shop", "DesiredCount": 1,
        "LoadBalancers": [Match.object_like({
            "ContainerPort": 80, "ContainerName": "front-end",
        })],
    })
    template.has_resource_properties("AWS::ElasticLoadBalancingV2::TargetGroup", {
        "HealthCheckPath": "/",
    })
    template.has_resource_properties("AWS::ElasticLoadBalancingV2::ListenerRule", {
        "Priority": 1, "ListenerArn": {"Fn::ImportValue": "SharedHttpsListenerArn"},
        "Conditions": [Match.object_like({
            "HostHeaderConfig": {"Values": ["alpine-peak-climbing-ski-gear.com"]},
        })],
    })
    assert resources["ProductionService"]["DependsOn"] == ["ProductionListenerRule"]


def test_root_alias(template):
    template.has_resource_properties("AWS::Route53::RecordSet", {
        "Name": "alpine-peak-climbing-ski-gear.com.", "Type": "A",
        "HostedZoneId": {"Fn::ImportValue": "SharedAlpinePeakHostedZoneId"},
        "AliasTarget": {
            "DNSName": {"Fn::Join": [
                "", ["dualstack.", {"Fn::ImportValue": "SharedLoadBalancerDnsName"}, "."],
            ]},
            "HostedZoneId": {"Fn::ImportValue": "SharedLoadBalancerCanonicalHostedZoneId"},
            "EvaluateTargetHealth": False,
        },
    })


def test_container_images(template):
    template.has_parameter("ImageTag", {"Type": "String"})
    task = next(iter(template.find_resources("AWS::ECS::TaskDefinition").values()))
    containers = task["Properties"]["ContainerDefinitions"]
    assert {c["Name"] for c in containers} == {"front-end", "back-end-dotnet-api"}
    assert len(containers) == 2 and "MONGO_URL" not in str(task)
    for container in containers:
        assert {"Ref": "ImageTag"} in container["Image"]["Fn::Join"][1]
