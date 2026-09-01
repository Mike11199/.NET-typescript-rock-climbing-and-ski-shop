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
        "ServiceName": "alpine-peak-ski-shop",
        "DesiredCount": 1,
        "LoadBalancers": [Match.object_like({
            "ContainerPort": 80,
            "ContainerName": "front-end",
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


def test_imported_domain_resources_match_live_aws():
    """The import template exactly models the existing domain resources."""
    t = _template()

    t.resource_count_is("AWS::Route53::HostedZone", 1)
    t.resource_count_is("AWS::Route53::RecordSet", 2)
    t.resource_count_is("AWS::CertificateManager::Certificate", 1)

    t.has_resource_properties("AWS::Route53::HostedZone", {
        "Name": "alpine-peak-climbing-ski-gear.com",
        "HostedZoneConfig": {
            "Comment": "HostedZone created by Route53 Registrar",
        },
    })
    t.has_resource_properties("AWS::Route53::RecordSet", {
        "Name": "alpine-peak-climbing-ski-gear.com.",
        "Type": "A",
        "AliasTarget": {
            "DNSName": "dualstack.consolidated-load-balancer-1342855394.us-west-1.elb.amazonaws.com.",
            "HostedZoneId": "Z368ELLRRE2KJ0",
            "EvaluateTargetHealth": False,
        },
    })
    t.has_resource_properties("AWS::Route53::RecordSet", {
        "Name": "_35b0b2153a5b683b950c3497f289e1dc.alpine-peak-climbing-ski-gear.com.",
        "Type": "CNAME",
        "TTL": "300",
        "ResourceRecords": [
            "_bba7c99dfe4ff30d724dea58272e54cb.mhvfxnchzy.acm-validations.aws."
        ],
    })
    t.has_resource_properties("AWS::CertificateManager::Certificate", {
        "DomainName": "alpine-peak-climbing-ski-gear.com",
        "DomainValidationOptions": [{
            "DomainName": "alpine-peak-climbing-ski-gear.com",
            "HostedZoneId": "Z040844618MP488RZ84GN",
        }],
        "KeyAlgorithm": "RSA_2048",
        "ValidationMethod": "DNS",
        "CertificateTransparencyLoggingPreference": "ENABLED",
    })


def test_imported_domain_resources_have_stable_ids_and_retain_policies():
    cloudformation = _template().to_json()
    expected = {
        "AlpinePeakHostedZone",
        "AlpinePeakAliasRecord",
        "AlpinePeakCertificateValidationRecord",
        "AlpinePeakCertificate",
    }

    assert expected <= set(cloudformation["Resources"])
    for logical_id in expected:
        resource = cloudformation["Resources"][logical_id]
        assert resource["DeletionPolicy"] == "Retain"
        assert resource["UpdateReplacePolicy"] == "Retain"


def test_three_containers_with_immutable_images():
    t = _template()

    # Three containers.
    names = Match.array_with([
        Match.object_like({"Name": "front-end"}),
        Match.object_like({"Name": "back-end-express-socket-io-api"}),
        Match.object_like({"Name": "back-end-dotnet-api"}),
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
