"""The ski shop runs on one On-Demand EC2 instance managed by ECS."""

from aws_cdk import CfnParameter, Fn, Stack
from constructs import Construct
from .media_storage import MediaStorage
from .constructs.nano_service import NanoService
from .constructs.runtime_dependencies import add_dotnet_log_group, add_execution_role
from .constructs.shared_network import SharedNetwork
from .constructs.web_routing import WebRouting


class AlpinePeakStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs: object) -> None:
        super().__init__(scope, construct_id, **kwargs)
        MediaStorage(self, "MediaStorage")
        image_tag = CfnParameter(
            self, "ImageTag", type="String",
            description="Git commit SHA used for both application image tags.",
        )
        network = SharedNetwork(self, "Network")
        routing = WebRouting(self, "Routing", vpc_id=network.vpc_id)
        NanoService(
            self, "Nano", network=network, routing=routing,
            execution_role=add_execution_role(self),
            log_group=add_dotnet_log_group(self),
            repository_uri=Fn.import_value("AlpinePeakRepositoryUri"),
            image_tag=image_tag.value_as_string,
        )
