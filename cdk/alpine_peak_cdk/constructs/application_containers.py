"""Existing API and frontend images, with local PostgreSQL credentials."""

from aws_cdk import Size
from aws_cdk import aws_ecs as ecs, aws_ssm as ssm
from constructs import Construct
from .. import alpine_peak_existing_resources as existing


class ApplicationContainers(Construct):
    def __init__(self, scope, construct_id, *, task, postgres, connections,
                 repository_uri, image_tag, logging, log_group):
        super().__init__(scope, construct_id)

        api = task.add_container(
            "Api", container_name="back-end-dotnet-api",
            image=ecs.ContainerImage.from_registry(f"{repository_uri}:back-end-dotnet-api-{image_tag}"),
            memory_limit_mib=192, memory_reservation_mib=128,
            logging=ecs.LogDrivers.aws_logs(
                stream_prefix="ecs", log_group=log_group,
                mode=ecs.AwsLogDriverMode.NON_BLOCKING,
                max_buffer_size=Size.mebibytes(1),
            ),
            secrets={
                "POSTGRES_URL_SKI_ROCK_SHOP": ecs.Secret.from_secrets_manager(
                    connections, "applicationConnectionString"
                ),
                **{key: ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, key, parameter_name=name
                    )
                ) for key, name in {
                    "JWT_SECRET_KEY": existing.JWT_PARAMETER_NAME,
                    "GOOGLE_OAUTH_CLIENT_ID": existing.GOOGLE_OAUTH_CLIENT_ID_PARAMETER_NAME,
                }.items()},
            },
        )
        api.add_container_dependencies(ecs.ContainerDependency(
            container=postgres, condition=ecs.ContainerDependencyCondition.HEALTHY
        ))
        frontend = task.add_container(
            "Frontend", container_name="front-end",
            image=ecs.ContainerImage.from_registry(f"{repository_uri}:front-end-{image_tag}"),
            memory_limit_mib=16, logging=logging,
        )
        frontend.add_port_mappings(ecs.PortMapping(container_port=80, host_port=80))
