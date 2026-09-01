"""Alpine Peak production stack.

This stack owns the Alpine Peak ECS service: its own ECS cluster, Fargate task,
task definition, target group, and ALB listener rule for alpine-peak-climbing-ski-gear.com.
Shared infrastructure (ALB, VPC, subnets, security groups) is imported read-only.
"""

from aws_cdk import CfnParameter, RemovalPolicy, Stack
from aws_cdk import aws_certificatemanager as acm
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from aws_cdk import aws_route53 as route53
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

        # Existing production domain resources adopted through a one-time CDK import.
        hosted_zone = route53.CfnHostedZone(
            self,
            "AlpinePeakHostedZoneResource",
            name=existing.DOMAIN_NAME,
            hosted_zone_config=route53.CfnHostedZone.HostedZoneConfigProperty(
                comment=existing.HOSTED_ZONE_COMMENT
            ),
        )
        hosted_zone.override_logical_id("AlpinePeakHostedZone")
        hosted_zone.apply_removal_policy(RemovalPolicy.RETAIN)

        alias_record = route53.CfnRecordSet(
            self,
            "AlpinePeakAliasRecordResource",
            hosted_zone_id=existing.ROUTE53_HOSTED_ZONE_ID,
            name=f"{existing.DOMAIN_NAME}.",
            type="A",
            alias_target=route53.CfnRecordSet.AliasTargetProperty(
                dns_name=f"dualstack.{existing.SHARED_ALB_DNS_NAME}.",
                hosted_zone_id=existing.SHARED_ALB_CANONICAL_HOSTED_ZONE_ID,
                evaluate_target_health=False,
            ),
        )
        alias_record.override_logical_id("AlpinePeakAliasRecord")
        alias_record.apply_removal_policy(RemovalPolicy.RETAIN)

        validation_record = route53.CfnRecordSet(
            self,
            "AlpinePeakCertificateValidationRecordResource",
            hosted_zone_id=existing.ROUTE53_HOSTED_ZONE_ID,
            name=existing.CERTIFICATE_VALIDATION_RECORD_NAME,
            type="CNAME",
            ttl="300",
            resource_records=[existing.CERTIFICATE_VALIDATION_RECORD_VALUE],
        )
        validation_record.override_logical_id(
            "AlpinePeakCertificateValidationRecord"
        )
        validation_record.apply_removal_policy(RemovalPolicy.RETAIN)

        # This stack owns the certificate, but SharedInfrastructureStack owns the
        # HTTPS listener and references this ARN as its required default certificate.
        # The attachment is managed by the shared listener resource; it is not
        # orphaned and must not also be modeled as a ListenerCertificate here.
        certificate = acm.CfnCertificate(
            self,
            "AlpinePeakCertificateResource",
            domain_name=existing.DOMAIN_NAME,
            domain_validation_options=[
                acm.CfnCertificate.DomainValidationOptionProperty(
                    domain_name=existing.DOMAIN_NAME,
                    hosted_zone_id=existing.ROUTE53_HOSTED_ZONE_ID,
                )
            ],
            key_algorithm="RSA_2048",
            validation_method="DNS",
            certificate_transparency_logging_preference="ENABLED",
        )
        certificate.override_logical_id("AlpinePeakCertificate")
        certificate.apply_removal_policy(RemovalPolicy.RETAIN)

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
            essential=True,
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
            essential=True,
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

        # Listener rule must be created before the ECS service so CloudFormation wires
        # the target group to the ALB first; otherwise ECS can fail with:
        # "target group does not have an associated load balancer".
        listener_rule = elbv2.CfnListenerRule(
            self, "ProductionListenerRule",
            listener_arn="arn:aws:elasticloadbalancing:us-west-1:456461478565:listener/app/consolidated-load-balancer/cebd4e468e9c8526/119a0202f44da309",
            priority=1,
            conditions=[{
                "field": "host-header",
                "hostHeaderConfig": {"values": ["alpine-peak-climbing-ski-gear.com"]},
            }],
            actions=[{"type": "forward", "targetGroupArn": target_group.ref}],
        )

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

        # Ensure listener rule exists before ECS service tries to use the target group.
        service.add_dependency(listener_rule)
