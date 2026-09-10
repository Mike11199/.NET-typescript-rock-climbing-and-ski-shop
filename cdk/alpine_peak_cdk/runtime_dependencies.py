"""Application-owned runtime resources."""

from aws_cdk import RemovalPolicy
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from constructs import Construct

DOTNET_LOG_GROUP_NAME = "/ecs/deploy-ski-shop-back-end-v2-dotnet"


def add_dotnet_log_group(scope: Construct) -> logs.ILogGroup:
    """Manage .NET logs without changing the deployed task definition."""
    group = logs.LogGroup(
        scope,
        "DotnetLogGroup",
        log_group_name=DOTNET_LOG_GROUP_NAME,
        retention=logs.RetentionDays.ONE_MONTH,
        removal_policy=RemovalPolicy.RETAIN,
    )
    group.node.default_child.override_logical_id("AlpinePeakDotnetLogGroup")
    # Reference the owned group's physical name to keep the ECS task stable.
    return logs.LogGroup.from_log_group_name(
        scope, "DotnetLogGroupReference", DOTNET_LOG_GROUP_NAME
    )

def add_execution_role(scope: Construct) -> iam.IRole:
    """Own the ECS startup role with unrestricted parameter and secret reads."""
    role = iam.Role(
        scope,
        "ExecutionRole",
        assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        managed_policies=[iam.ManagedPolicy.from_aws_managed_policy_name(
            "service-role/AmazonECSTaskExecutionRolePolicy"
        )],
        inline_policies={"RuntimeParameters": iam.PolicyDocument(statements=[
            iam.PolicyStatement(
                actions=["ssm:GetParameters", "secretsmanager:GetSecretValue"],
                resources=["*"],
            )
        ])},
        description="Alpine Peak ECS image pulls, log delivery, and runtime parameters",
    )
    role.node.default_child.override_logical_id("AlpinePeakExecutionRole")
    # Keep container bindings from adding redundant grants.
    # Parameter and secret reads intentionally match the generic role policy.
    return role.without_policy_updates()
