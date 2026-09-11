"""The EC2 host can operate only this app's ECS cluster."""

from aws_cdk import ArnFormat, Stack
from aws_cdk import aws_iam as iam


def create_host_role(scope, cluster):
    def cluster_resource(kind):
        return Stack.of(scope).format_arn(
            service="ecs", resource=kind, resource_name=f"{cluster.cluster_name}/*",
            arn_format=ArnFormat.SLASH_RESOURCE_NAME,
        )

    return iam.Role(
        scope, "InstanceRole", assumed_by=iam.ServicePrincipal("ec2.amazonaws.com"),
        inline_policies={"EcsAgent": iam.PolicyDocument(statements=[
            # Endpoint discovery does not support resource-level permissions.
            iam.PolicyStatement(actions=["ecs:DiscoverPollEndpoint"], resources=["*"]),
            iam.PolicyStatement(
                actions=["ecs:RegisterContainerInstance", "ecs:SubmitAttachmentStateChanges",
                         "ecs:SubmitContainerStateChange", "ecs:SubmitTaskStateChange"],
                resources=[cluster.cluster_arn],
            ),
            iam.PolicyStatement(
                actions=["ecs:Poll", "ecs:StartTelemetrySession",
                         "ecs:DeregisterContainerInstance", "ecs:UpdateContainerInstancesState"],
                resources=[cluster_resource("container-instance")],
            ),
            iam.PolicyStatement(
                actions=["ecs:ListTagsForResource"],
                resources=[cluster_resource("container-instance"), cluster_resource("task")],
            ),
            iam.PolicyStatement(
                actions=["ecs:TagResource"], resources=[cluster_resource("container-instance")],
                conditions={"StringEquals": {"ecs:CreateAction": "RegisterContainerInstance"}},
            ),
        ])},
    )
