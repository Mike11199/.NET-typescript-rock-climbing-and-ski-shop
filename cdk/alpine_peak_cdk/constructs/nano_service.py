"""Compose the host, credentials, and three containers into one ECS service."""

from aws_cdk import aws_ecs as ecs
from constructs import Construct
from .application_containers import ApplicationContainers
from .database_credentials import DatabaseCredentials
from .nano_host import NanoHost
from .postgres_container import PostgresContainer


class NanoService(Construct):
    def __init__(self, scope, construct_id, *, network, routing, execution_role,
                 repository_uri, image_tag, log_group):
        super().__init__(scope, construct_id)
        host = NanoHost(self, "Host", vpc=network.vpc, subnet=network.subnet,
                        alb_security_group=network.alb_security_group)
        credentials = DatabaseCredentials(self, "Database", public_ip=host.public_ip)
        task = ecs.Ec2TaskDefinition(
            self, "Task", network_mode=ecs.NetworkMode.HOST,
            execution_role=execution_role,
            volumes=[ecs.Volume(name="postgres", host=ecs.Host(
                source_path="/var/lib/alpine-peak-postgres"
            ))],
        )
        logging = ecs.GenericLogDriver(
            log_driver="json-file", options={"max-size": "5m", "max-file": "2"}
        )
        postgres = PostgresContainer(
            self, "DatabaseContainer", task=task, password=credentials.password,
            logging=logging, repository_uri=repository_uri, image_tag=image_tag,
        )
        ApplicationContainers(
            self, "Application", task=task, postgres=postgres.container,
            connections=credentials.connections, repository_uri=repository_uri,
            image_tag=image_tag, logging=logging, log_group=log_group,
        )
        self.service = ecs.CfnService(
            self, "Service", cluster=host.cluster.cluster_arn,
            service_name="alpine-peak-ski-shop-nano",
            task_definition=task.task_definition_arn, launch_type="EC2",
            desired_count=1, health_check_grace_period_seconds=120,
            deployment_configuration=ecs.CfnService.DeploymentConfigurationProperty(
                minimum_healthy_percent=0, maximum_percent=100,
            ),
            load_balancers=[ecs.CfnService.LoadBalancerProperty(
                target_group_arn=routing.target_group.ref,
                container_name="front-end", container_port=80,
            )],
        )
        self.service.node.add_dependency(host.instance)
        self.service.node.add_dependency(execution_role)
        self.service.add_resource_dependency(routing.listener_rule)
