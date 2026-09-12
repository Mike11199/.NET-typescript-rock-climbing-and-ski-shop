"""The ski shop runs on one On-Demand EC2 instance managed by ECS."""

from aws_cdk import CfnOutput, CfnParameter, Fn, Stack
from constructs import Construct
from .constructs.media_storage import MediaStorage
from .constructs.jwt_secret import JwtSecret
from .constructs.nano_service import NanoService
from .constructs.runtime_dependencies import add_dotnet_log_group, add_execution_role
from .constructs.shared_network import SharedNetwork
from .constructs.web_routing import WebRouting


class AlpinePeakStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs: object) -> None:
        super().__init__(scope, construct_id, **kwargs)
        MediaStorage(self, "MediaStorage")
        jwt = JwtSecret(self, "JwtSecret")
        CfnOutput(self, "JwtSecretArn", value=jwt.secret.secret_arn)
        image_tag = CfnParameter(
            self, "ImageTag", type="String",
            description="Git commit SHA used for both application image tags.",
        )
        network = SharedNetwork(self, "Network")
        routing = WebRouting(self, "Routing", vpc_id=network.vpc_id)
        NanoService(
            self, "Nano", network=network, routing=routing, jwt_secret=jwt.secret,
            execution_role=add_execution_role(self),
            log_group=add_dotnet_log_group(self),
            repository_uri=Fn.import_value("AlpinePeakRepositoryUri"),
            image_tag=image_tag.value_as_string,
        )
