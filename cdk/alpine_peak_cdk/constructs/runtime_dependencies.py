"""Application-owned runtime resources."""

from aws_cdk import RemovalPolicy
from aws_cdk import aws_iam as iam, aws_ecr as ecr
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

def add_execution_role(scope: Construct) -> iam.Role:
    """CDK container bindings grant access to only the referenced secrets and logs."""
    role = iam.Role(
        scope, "ExecutionRole", assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
        description="Alpine Peak image pulls, application secrets, and API logs",
    )
    role.node.default_child.override_logical_id("AlpinePeakExecutionRole")
    ecr.Repository.from_repository_name(
        scope, "ApplicationImages", "ski-rock-climbing-shop"
    ).grant_pull(role)
    return role
