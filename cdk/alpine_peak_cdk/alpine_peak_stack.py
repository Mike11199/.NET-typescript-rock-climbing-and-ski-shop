"""Alpine Peak application infrastructure.

AlpinePeakStack owns the root Route 53 A-alias record for
alpine-peak-climbing-ski-gear.com because the record routes this application's
domain to the shared ALB and should change or be removed with this website. The
hosted zone and ACM certificate are instead owned by SharedHostedZonesStack and
SharedCertificatesStack in C:/Git/shared-infra-aws-cdk, so domain and certificate
creation precedes the shared HTTPS listener in a fresh environment. This stack
also owns the ECS cluster, Fargate task, task definition, target group, and ALB
listener rule. The A-alias is retained against accidental DNS loss; the listener
rule follows normal application-stack deletion so it cannot leave stale routing.
The shared ALB, VPC, subnets, and ALB security group are referenced read-only.
The ECS service and RDS security groups are application-owned.
"""

from aws_cdk import CfnOutput, CfnParameter, Fn, RemovalPolicy, Stack
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from aws_cdk import aws_route53 as route53
from aws_cdk import aws_ssm as ssm
from constructs import Construct

from . import alpine_peak_existing_resources as existing
from .operator_rds_access import add_operator_rds_access
from .rds_database import add_rds_database


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

        # The application owns its root route while SharedHostedZonesStack owns
        # the long-lived zone and SharedInfrastructureStack owns the shared ALB.
        alias_record = route53.CfnRecordSet(
            self,
            "AlpinePeakAliasRecordResource",
            hosted_zone_id=Fn.import_value("SharedAlpinePeakHostedZoneId"),
            name=f"{existing.DOMAIN_NAME}.",
            type="A",
            alias_target=route53.CfnRecordSet.AliasTargetProperty(
                dns_name=Fn.join(
                    "",
                    [
                        "dualstack.",
                        Fn.import_value("SharedLoadBalancerDnsName"),
                        ".",
                    ],
                ),
                hosted_zone_id=Fn.import_value(
                    "SharedLoadBalancerCanonicalHostedZoneId"
                ),
                evaluate_target_health=False,
            ),
        )
        alias_record.override_logical_id("AlpinePeakAliasRecord")
        alias_record.apply_removal_policy(RemovalPolicy.RETAIN)

        vpc_id = Fn.import_value("SharedVpcId")
        operator_rds_access_security_group = add_operator_rds_access(self)
        availability_zones = [
            Fn.import_value("SharedPublicSubnet1AvailabilityZone"),
            Fn.import_value("SharedPublicSubnet2AvailabilityZone"),
        ]
        public_subnet_ids = [
            Fn.import_value("SharedPublicSubnet1Id"),
            Fn.import_value("SharedPublicSubnet2Id"),
        ]

        vpc = ec2.Vpc.from_vpc_attributes(
            self,
            "SharedVpc",
            vpc_id=vpc_id,
            availability_zones=availability_zones,
            public_subnet_ids=public_subnet_ids,
        )

        # Cluster owned by this stack, configured for Fargate Spot capacity.
        cluster = ecs.Cluster(
            self, "ProductionCluster",
            cluster_name="alpine-peak-ski-shop",
            vpc=vpc,
        )

        # Enable both On-Demand and Spot Fargate providers on the cluster.
        cluster.enable_fargate_capacity_providers()

        shared_alb_security_group = ec2.SecurityGroup.from_security_group_id(
            self,
            "SharedAlbSecurityGroup",
            Fn.import_value("SharedAlbSecurityGroupId"),
            mutable=False,
        )
        service_security_group = ec2.SecurityGroup(
            self,
            "ServiceSecurityGroup",
            vpc=vpc,
            description="Alpine Peak ECS service security group",
        )
        service_security_group.node.default_child.override_logical_id(
            "AlpinePeakServiceSecurityGroup"
        )
        service_security_group.add_ingress_rule(
            shared_alb_security_group,
            ec2.Port.tcp(80),
            "Allow HTTP from the shared ALB",
        )

        # The application owns the retained database and its two access groups.
        rds_security_group = ec2.SecurityGroup(
            self,
            "RdsSecurityGroup",
            vpc=vpc,
            description="Alpine Peak RDS security group",
        )
        rds_security_group.node.default_child.override_logical_id(
            "AlpinePeakRdsSecurityGroup"
        )
        rds_security_group.apply_removal_policy(RemovalPolicy.RETAIN)
        ec2.CfnSecurityGroupIngress(
            self,
            "RdsSecurityGroupfromApplication5432",
            group_id=rds_security_group.security_group_id,
            source_security_group_id=service_security_group.security_group_id,
            ip_protocol="tcp",
            from_port=5432,
            to_port=5432,
            description="Allow PostgreSQL from the Alpine Peak ECS service",
        )
        CfnOutput(
            self,
            "RdsSecurityGroupId",
            value=rds_security_group.security_group_id,
            export_name="AlpinePeakRdsSecurityGroupId",
        )
        database = add_rds_database(
            self,
            application_security_group_id=rds_security_group.security_group_id,
            operator_security_group_id=(
                operator_rds_access_security_group.attr_group_id
            ),
        )
        CfnOutput(
            self,
            "RdsDatabaseIdentifier",
            value=database.ref,
            description="CloudFormation-owned Alpine Peak RDS identifier",
        )
        CfnOutput(
            self,
            "RdsDatabaseEndpoint",
            value=database.attr_endpoint_address,
            description="Alpine Peak PostgreSQL endpoint address",
        )
        deployment_subnets = [
            ec2.Subnet.from_subnet_attributes(
                self,
                f"SharedPublicSubnet{index}",
                subnet_id=subnet_id,
                availability_zone=availability_zones[index - 1],
            )
            for index, subnet_id in enumerate(public_subnet_ids, start=1)
        ]
        execution_role_arn = self.format_arn(
            service="iam",
            region="",
            resource="role",
            resource_name=existing.EXECUTION_ROLE_NAME,
        )
        execution_role = iam.Role.from_role_arn(
            self, "ExistingExecutionRole", execution_role_arn, mutable=False
        )

        # Target group (L1 CFN so we can reference its ARN directly).
        target_group = elbv2.CfnTargetGroup(
            self, "ProductionTargetGroup",
            name="alpine-peak-cdk",
            protocol="HTTP",
            port=80,
            target_type="ip",
            vpc_id=vpc_id,
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
        target_group.apply_removal_policy(RemovalPolicy.RETAIN)

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

        # RepositoryStack owns ECR and exports the URI before images are built.
        repository_uri = Fn.import_value("AlpinePeakRepositoryUri")

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
                        parameter_name=existing.JWT_PARAMETER_NAME
                    )
                ),
                "MONGO_URL": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "ExpressMongoSecureParam",
                        parameter_name=existing.MONGO_PARAMETER_NAME
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
                        parameter_name=existing.JWT_PARAMETER_NAME
                    )
                ),
                "POSTGRES_URL_SKI_ROCK_SHOP": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "DotnetPostgresSecureParam",
                        parameter_name=existing.POSTGRES_PARAMETER_NAME
                    )
                ),
                "GOOGLE_OAUTH_CLIENT_ID": ecs.Secret.from_ssm_parameter(
                    ssm.StringParameter.from_secure_string_parameter_attributes(
                        self, "DotnetGoogleOauthSecureParam",
                        parameter_name=existing.GOOGLE_OAUTH_CLIENT_ID_PARAMETER_NAME
                    )
                ),
            },
        )
        dotnet_api.add_port_mappings(
            ecs.PortMapping(container_port=5001, host_port=5001, name="backendv2")
        )

        listener_rule = elbv2.CfnListenerRule(
            self,
            "ProductionListenerRule",
            listener_arn=Fn.import_value("SharedHttpsListenerArn"),
            priority=1,
            conditions=[{
                "field": "host-header",
                "hostHeaderConfig": {"values": [existing.DOMAIN_NAME]},
            }],
            actions=[{"type": "forward", "targetGroupArn": target_group.ref}],
        )
        listener_rule.apply_removal_policy(RemovalPolicy.RETAIN)

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
        service.add_resource_dependency(listener_rule)
