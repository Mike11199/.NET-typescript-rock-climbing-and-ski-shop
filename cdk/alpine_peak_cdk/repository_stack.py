"""ECR repository owned independently from the Alpine Peak application."""

from aws_cdk import CfnOutput, Duration, RemovalPolicy, Stack
from aws_cdk import aws_ecr as ecr
from constructs import Construct


class RepositoryStack(Stack):
    """Own the retained repository needed before application images are built."""

    def __init__(self, scope: Construct, construct_id: str, **kwargs: object) -> None:
        super().__init__(scope, construct_id, **kwargs)

        repository = ecr.Repository(
            self,
            "Repository",
            repository_name="ski-rock-climbing-shop",
            image_tag_mutability=ecr.TagMutability.MUTABLE,
            image_scan_on_push=False,
            encryption=ecr.RepositoryEncryption.AES_256,
            removal_policy=RemovalPolicy.RETAIN,
        )
        for priority, description, prefix in (
            (1, "Keep the three most recent frontend images", "front-end-"),
            (
                2,
                "Keep the three most recent Express API images",
                "back-end-express-socket-io-api-",
            ),
            (3, "Keep the three most recent .NET API images", "back-end-dotnet-api-"),
        ):
            repository.add_lifecycle_rule(
                rule_priority=priority,
                description=description,
                tag_prefix_list=[prefix],
                max_image_count=3,
            )
        repository.add_lifecycle_rule(
            rule_priority=4,
            description="Expire untagged images after one day",
            tag_status=ecr.TagStatus.UNTAGGED,
            max_image_age=Duration.days(1),
        )
        repository.node.default_child.override_logical_id("AlpinePeakRepository")
        repository.node.default_child.add_property_override(
            "EncryptionConfiguration", {"EncryptionType": "AES256"}
        )

        CfnOutput(
            self,
            "RepositoryUri",
            value=repository.repository_uri,
            export_name="AlpinePeakRepositoryUri",
        )
