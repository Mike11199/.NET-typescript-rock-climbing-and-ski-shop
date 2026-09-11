"""Route the existing domain through the shared ALB to the EC2 service."""

from aws_cdk import Fn, RemovalPolicy
from aws_cdk import aws_elasticloadbalancingv2 as elbv2, aws_route53 as route53
from constructs import Construct
from .. import alpine_peak_existing_resources as existing


class WebRouting(Construct):
    def __init__(self, scope, construct_id, *, vpc_id):
        super().__init__(scope, construct_id)
        alias = route53.CfnRecordSet(
            self, "Alias", hosted_zone_id=Fn.import_value("SharedAlpinePeakHostedZoneId"),
            name=f"{existing.DOMAIN_NAME}.", type="A",
            alias_target=route53.CfnRecordSet.AliasTargetProperty(
                dns_name=Fn.join("", ["dualstack.", Fn.import_value("SharedLoadBalancerDnsName"), "."]),
                hosted_zone_id=Fn.import_value("SharedLoadBalancerCanonicalHostedZoneId"),
                evaluate_target_health=False,
            ),
        )
        alias.override_logical_id("AlpinePeakAliasRecord")
        alias.apply_removal_policy(RemovalPolicy.RETAIN)
        self.target_group = elbv2.CfnTargetGroup(
            self, "TargetGroup", target_type="instance", vpc_id=vpc_id,
            protocol="HTTP", port=80, health_check_path="/",
            health_check_interval_seconds=15, healthy_threshold_count=2,
            target_group_attributes=[{"key": "deregistration_delay.timeout_seconds", "value": "30"}],
        )
        self.target_group.override_logical_id("NanoTargetGroup")
        self.listener_rule = elbv2.CfnListenerRule(
            self, "ListenerRule", listener_arn=Fn.import_value("SharedHttpsListenerArn"),
            priority=1,
            conditions=[{"field": "host-header", "hostHeaderConfig": {"values": [existing.DOMAIN_NAME]}}],
            actions=[{"type": "forward", "targetGroupArn": self.target_group.ref}],
        )
        self.listener_rule.override_logical_id("ProductionListenerRule")
        self.listener_rule.apply_removal_policy(RemovalPolicy.RETAIN)
