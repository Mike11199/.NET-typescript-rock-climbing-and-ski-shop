"""Alpine Peak production stack.

This stack owns the Alpine Peak ECS service: its own ECS cluster, Fargate task,
task definition, target group, and ALB listener rule for alpine-peak-climbing-ski-gear.com.
Shared infrastructure (ALB, VPC, subnets, security groups) is imported read-only.
"""

from aws_cdk import CfnParameter, Stack
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from aws_cdk import aws_route53 as route53
from aws_cdk import aws_route53_targets as route53_targets
from aws_cdk import aws_ssm as ssm
from constructs import Construct

from . import alpine_peak_existing_resources as existing


class AlpinePeakStack(Stack):
    """Own the production ECS service for Alpine Peak."""

    def __init__(self, scope: Construct, construct_id: str, **kwargs: object) -> None:
        super().__init__(scope, construct_id, **kwargs)

        image_tag = CfnParameter(
            self,
            "ImageTag",
            type="String",
            description="Immutable Git commit SHA applied to all Alpine Peak container images.",
        )

        vpc = ec2.Vpc.from_vpc_attributes(
            self,
            "ExistingVpc",
            vpc_id=existing.VPC_ID,
            availability_zones=list(existing.AVAILABILITY_ZONES),
            public_subnet_ids=list(existing.PUBLIC_SUBNET_IDS),
        )

        # Cluster owned by this stack, configured for Fargate Spot capacity.
        cluster = ecs.Cluster(
            self, "ProductionCluster",
            cluster_name="alpine-peak-ski-shop",
            vpc=vpc,
        )

        # Enable both On-Demand and Spot Fargate providers on the cluster.
        cluster.enable_fargate_capacity_providers()

        service_security_group = ec2.SecurityGroup.from_security_group_id(
            self, "ExistingServiceSecurityGroup", existing.SERVICE_SECURITY_GROUP_ID
        )
        deployment_subnets = [
            ec2.Subnet.from_subnet_id(self, f"ExistingPublicSubnet{index}", subnet_id)
            for index, subnet_id in enumerate(existing.PUBLIC_SUBNET_IDS, start=1)
        ]
        execution_role = iam.Role.from_role_arn(
            self, "ExistingExecutionRole", existing.EXECUTION_ROLE_ARN, mutable=False
        )

        # Target group (L1 CFN so we can reference its ARN directly).
        target_group = elbv2.CfnTargetGroup(
            self, "ProductionTargetGroup",
            name="alpine-peak-cdk",
            protocol="HTTP",
            port=80,
            target_type="ip",
            vpc_id=existing.VPC_ID,
            health_check_enabled=True,
            health_check_path="/",
            healthy_threshold_count=5,
            unhealthy_threshold_count=2,
            health_check_interval_seconds=30,
            health_check_timeout_seconds=5,
            target_group_attributes=[{
                "key": "deregistration_delay.timeout_seconds",
                "value": "30",
            }],
        )

        task_definition = ecs.FargateTaskDefinition(
            self,
            "ProductionTaskDefinition",
            family="alpine-peak-ski-shop",
            cpu=512,
            memory_limit_mib=1024,
            execution_role=execution_role,
        )

        express_log_group = logs.LogGroup.from_log_group_name(
            self, "ExistingExpressLogGroup", existing.EXPRESS_LOG_GROUP_NAME
        )
        dotnet_log_group = logs.LogGroup.from_log_group_name(
            self, "ExistingDotnetLogGroup", existing.DOTNET_LOG_GROUP_NAME
        )

        # Use the external ECR repository created by GitHub Actions on push.
        registry = f"{existing.AWS_ACCOUNT_ID}.dkr.ecr.{self.region}.amazonaws.com"
        repository_uri = f"{registry}/ski-rock-climbing-shop"

        # Frontend container (no secrets needed)
        frontend = task_definition.add_container(
            "FrontendContainer",
            container_name="front-end",
            image=ecs.ContainerImage.from_registry(
                f"{repository_uri}:front-end-{image_tag.value_as_string}"
            ),
            essential=True,
        )
        frontend.add_port_mappings(
            ecs.PortMapping(container_port=80, host_port=80, name="front-end-80-tcp")
        )

        # Express API container (uses JWT and MongoDB secrets)
        express_api = task_definition.add_container(
            "ExpressApiContainer",
            container_name="back-end-express-socket-io-api",
            image=ecs.ContainerImage.from_registry(
                f"{repository_uri}:back-end-express-socket-io-api-{image_tag.value_as_string}"
            ),
            essential=False,
            logging=ecs.LogDrivers.aws_logs(
                stream_prefix="ecs", log_group=express_log_group
            ),
            secrets={
                "JWT_SECRET_KEY": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "ExpressJwtSecureParam",
                        parameter_name=existing.JWT_PARAMETER_ARN.split("/")[-1]
                    )
                ),
                "MONGO_URL": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "ExpressMongoSecureParam",
                        parameter_name=existing.MONGO_PARAMETER_ARN.split("/")[-1]
                    )
                ),
            },
        )
        express_api.add_port_mappings(
            ecs.PortMapping(container_port=5000, host_port=5000, name="backend")
        )

        # .NET API container (uses JWT, PostgreSQL, and OAuth secrets)
        dotnet_api = task_definition.add_container(
            "DotnetApiContainer",
            container_name="back-end-dotnet-api",
            image=ecs.ContainerImage.from_registry(
                f"{repository_uri}:back-end-dotnet-api-{image_tag.value_as_string}"
            ),
            essential=False,
            logging=ecs.LogDrivers.aws_logs(
                stream_prefix="ecs", log_group=dotnet_log_group
            ),
            secrets={
                "JWT_SECRET_KEY": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "DotnetJwtSecureParam",
                        parameter_name=existing.JWT_PARAMETER_ARN.split("/")[-1]
                    )
                ),
                "POSTGRES_URL_SKI_ROCK_SHOP": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "DotnetPostgresSecureParam",
                        parameter_name=existing.POSTGRES_PARAMETER_ARN.split("/")[-1]
                    )
                ),
                "GOOGLE_OAUTH_CLIENT_ID": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "DotnetGoogleOauthSecureParam",
                        parameter_name=existing.GOOGLE_OAUTH_CLIENT_ID_PARAMETER_ARN.split("/")[-1]
                    )
                ),
            },
        )
        dotnet_api.add_port_mappings(
            ecs.PortMapping(container_port=5001, host_port=5001, name="backendv2")
        )

        # Import shared ALB (read-only; never created or modified).
        shared_alb = elbv2.ApplicationLoadBalancer.from_application_load_balancer_attributes(
            self, "SharedAlb",
            load_balancer_arn=existing.SHARED_ALB_ARN,
            security_group_id="sg-0190e299544ca1711",  # matches one of the ALB's existing SGs (required by CDK for import)
        )

        # Use CfnService so we can wire our target group directly (no L2 import needed).
        service = ecs.CfnService(
            self, "ProductionService",
            service_name="alpine-peak-ski-shop",
            cluster=cluster.cluster_name,
            task_definition=task_definition.task_definition_arn,
            desired_count=1,
            capacity_provider_strategy=[{
                "capacityProvider": "FARGATE_SPOT",
                "weight": 1,
                "base": 0,
            }],
            network_configuration={
                "awsvpcConfiguration": {
                    "subnets": [s.subnet_id for s in deployment_subnets],
                    "securityGroups": [service_security_group.security_group_id],
                    "assignPublicIp": "ENABLED",
                }
            },
            health_check_grace_period_seconds=120,
            deployment_configuration={
                "minimumHealthyPercent": 100,
                "maximumPercent": 200,
            },
            load_balancers=[{
                "targetGroupArn": target_group.ref,
                "containerName": "front-end",
                "containerPort": 80,
            }],
        )

        # Host-header rule on the shared ALB HTTPS listener for root domain.
        production_host = "alpine-peak-climbing-ski-gear.com"

        elbv2.CfnListenerRule(
            self, "ProductionListenerRule",
            listener_arn="arn:aws:elasticloadbalancing:us-west-1:456461478565:listener/app/consolidated-load-balancer/cebd4e468e9c8526/119a0202f44da309",
            conditions=[{
                "field": "host-header",
                "hostHeaderConfig": {"values": [production_host]},
            }],
            priority=1,
            actions=[{
                "type": "forward",
                "targetGroupArn": target_group.ref,
            }],
        )


