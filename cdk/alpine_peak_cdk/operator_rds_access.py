"""Add pgAdmin RDS access to the main Alpine Peak application stack.

This file keeps the operator-access security-group definition separate for
readability, while the resource itself belongs to ``AlpinePeakStack``. It
permits PostgreSQL access from a changing home public IPv4 address and remains
independent from the ECS-to-RDS security-group rule.
"""

from aws_cdk import CfnOutput, Fn, RemovalPolicy, Stack
from aws_cdk import aws_ec2 as ec2


def add_operator_rds_access(stack: Stack) -> ec2.CfnSecurityGroup:
    """Create and export the retained pgAdmin security group in ``stack``."""
    security_group = ec2.CfnSecurityGroup(
        stack,
        "OperatorRdsAccessSecurityGroupResource",
        group_description="Public pgAdmin access to Alpine Peak PostgreSQL",
        vpc_id=Fn.import_value("SharedVpcId"),
        security_group_ingress=[
            ec2.CfnSecurityGroup.IngressProperty(
                ip_protocol="tcp",
                from_port=5432,
                to_port=5432,
                cidr_ip="0.0.0.0/0",
                description="Public PostgreSQL for pgAdmin with a changing home IP",
            )
        ],
        security_group_egress=[
            ec2.CfnSecurityGroup.EgressProperty(
                ip_protocol="-1",
                cidr_ip="0.0.0.0/0",
                description="Allow all outbound traffic by default",
            )
        ],
    )
    security_group.override_logical_id("AlpinePeakOperatorRdsAccessSecurityGroup")
    security_group.apply_removal_policy(RemovalPolicy.RETAIN)

    CfnOutput(
        stack,
        "OperatorRdsAccessSecurityGroupId",
        value=security_group.attr_group_id,
        export_name="AlpinePeakOperatorRdsAccessSecurityGroupId",
    )
    return security_group
