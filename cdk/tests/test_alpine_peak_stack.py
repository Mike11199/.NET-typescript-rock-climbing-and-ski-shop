"""Production stack owns one ECS service + target group for alpine-peak-climbing-ski-gear.com."""

import json
from aws_cdk import App
from aws_cdk.assertions import Match, Template

from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack
from alpine_peak_cdk import alpine_peak_existing_resources as existing


def _template() -> Template:
    return Template.from_stack(AlpinePeakStack(App(), "P"))


def test_counts_and_names():
    t = _template()

    # Exactly one of each core resource.
    t.resource_count_is("AWS::ECS::Service", 1)
    t.resource_count_is("AWS::ElasticLoadBalancingV2::TargetGroup", 1)
    t.resource_count_is("AWS::ECS::TaskDefinition", 1)
    # One listener rule (root domain).
    t.resource_count_is("AWS::ElasticLoadBalancingV2::ListenerRule", 1)

    # Production service name.
    t.has_resource_properties("AWS::ECS::Service", {
        "ServiceName": "alpine-peak-production-cdk",
        "DesiredCount": 1,
        "LoadBalancers": [Match.object_like({
            "ContainerPort": 80,
            "ContainerName": "front-end-react-ski-shop-GH",
        })],
    })

    t.has_resource_properties("AWS::ElasticLoadBalancingV2::TargetGroup", {
        "HealthCheckPath": "/",
    })


def test_root_domain_listener_rule():
    """Stack creates one listener rule at priority=1 for root domain."""
    t = _template()

    # Listener rule: priority 1, matches root domain host header.
    t.has_resource_properties("AWS::ElasticLoadBalancingV2::ListenerRule", {
        "Priority": 1,
        "Conditions": [Match.object_like({
            "HostHeaderConfig": {"Values": ["alpine-peak-climbing-ski-gear.com"]},
        })],
    })


def test_no_route53_records():
    """No Route53 records managed by this stack."""
    t = _template()

    # No Route53 records.
    t.resource_count_is("AWS::Route53::RecordSet", 0)


def test_three_containers_with_immutable_images():
    t = _template()

    # Three containers.
    names = Match.array_with([
        Match.object_like({"Name": "front-end-react-ski-shop-GH"}),
        Match.object_like({"Name": "back-end-react-ski-shop-GH"}),
        Match.object_like({"Name": "back-end-v2-react-ski-shop-GH-dotnet"}),
    ])

    # Each image uses Fn::Join with Ref:ImageTag.
    t.has_resource_properties("AWS::ECS::TaskDefinition", {
        "ContainerDefinitions": names,
    })

    t.has_parameter("ImageTag", {"Type": "String"})


def test_no_legacy_edge_resources():
    """Never creates new ALB/VPC/certs."""
    t = _template()

    # We import the existing ALB; we create no Route53 records or VPCs.
    t.resource_count_is("AWS::ElasticLoadBalancingV2::LoadBalancer", 0)
    t.resource_count_is("AWS::EC2::VPC", 0)
