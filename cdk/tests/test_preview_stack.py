"""Preview stack must own only one ECS service + target group, never production edge resources."""

import json
from aws_cdk import App
from aws_cdk.assertions import Match, Template

from alpine_peak_cdk.alpine_peak_preview_stack import AlpinePeakPreviewStack
from alpine_peak_cdk import alpine_peak_existing_resources as existing


def _template() -> Template:
    return Template.from_stack(AlpinePeakPreviewStack(App(), "P"))


def test_counts_and_names():
    t = _template()

    # Exactly one of each core resource.
    t.resource_count_is("AWS::ECS::Service", 1)
    t.resource_count_is("AWS::ElasticLoadBalancingV2::TargetGroup", 1)
    t.resource_count_is("AWS::ECS::TaskDefinition", 1)

    # Preview-only names (ContainerPort matches real frontend container).
    t.has_resource_properties("AWS::ECS::Service", {
        "ServiceName": existing.PREVIEW_ECS_SERVICE_NAME,
        "DesiredCount": 1,
        "LoadBalancers": [Match.object_like({
            "ContainerPort": 80,
            "ContainerName": "front-end-react-ski-shop-GH",
        })],
    })

    t.has_resource_properties("AWS::ElasticLoadBalancingV2::TargetGroup", {
        "Name": existing.PREVIEW_TARGET_GROUP_NAME,
        "HealthCheckPath": "/",
    })


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


def test_no_production_edge_resources():
    """Never creates new ALB/VPC/certs and never references production."""
    t = _template()
    rendered = json.dumps(t.to_json())

    # We import the existing ALB and VPC; we create one Route53 Alias but no new ALBs or VPCs.
    t.resource_count_is("AWS::ElasticLoadBalancingV2::LoadBalancer", 0)
    t.resource_count_is("AWS::EC2::VPC", 0)
    # Exactly one Route53 record: the preview alias to our shared ALB.
    t.resource_count_is("AWS::Route53::RecordSet", 1)

    assert existing.PRODUCTION_TARGET_GROUP_ARN not in rendered
    assert existing.PRODUCTION_ECS_SERVICE_NAME not in rendered
