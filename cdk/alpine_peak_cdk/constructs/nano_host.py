"""The persistent On-Demand ECS host and its network access."""

from aws_cdk import CfnOutput, RemovalPolicy
from aws_cdk import aws_ec2 as ec2, aws_ecs as ecs
from constructs import Construct
from .host_role import create_host_role


class NanoHost(Construct):
    def __init__(self, scope, construct_id, *, vpc, subnet, alb_security_group):
        super().__init__(scope, construct_id)

        cluster = ecs.Cluster(self, "Cluster", vpc=vpc)
        security_group = ec2.SecurityGroup(self, "SecurityGroup", vpc=vpc)
        security_group.add_ingress_rule(alb_security_group, ec2.Port.tcp(80))
        security_group.add_ingress_rule(
            ec2.Peer.any_ipv4(), ec2.Port.tcp(5432), "PostgreSQL TLS access from changing client IPs"
        )
        host = ec2.Instance(
            self, "Host", vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnets=[subnet]),
            instance_type=ec2.InstanceType("t3.nano"),
            # Pin the regional ECS AMI so app deploys do not replace the data disk.
            machine_image=ec2.MachineImage.generic_linux({
                "us-west-1": "ami-08e618af0ff4ed7c8",
            }),
            security_group=security_group, require_imdsv2=True,
            role=create_host_role(self, cluster),
            block_devices=[ec2.BlockDevice(
                device_name="/dev/xvda",
                volume=ec2.BlockDeviceVolume.ebs(
                    30, volume_type=ec2.EbsDeviceVolumeType.GP3,
                    encrypted=True, delete_on_termination=False,
                ),
            )],
        )
        # Retain the host's dependencies too; an attached group/registered cluster
        # cannot be deleted while the retained instance still exists.
        for resource in (host, cluster, security_group, host.role,
                         host.node.find_child("InstanceProfile")):
            resource.apply_removal_policy(RemovalPolicy.RETAIN)
        host.node.default_child.disable_api_termination = True
        host.node.default_child.credit_specification = ec2.CfnInstance.CreditSpecificationProperty(
            cpu_credits="standard"
        )
        # ECS-optimized AMI already has Docker and ECS; only register the host.
        host.add_user_data(
            f"echo ECS_CLUSTER={cluster.cluster_name} >> /etc/ecs/ecs.config",
            "echo ECS_RESERVED_MEMORY=128 >> /etc/ecs/ecs.config",
            "echo ECS_ENABLE_AWSLOGS_EXECUTIONROLE_OVERRIDE=true >> /etc/ecs/ecs.config",
        )
        address = ec2.CfnEIP(self, "Address", domain="vpc")
        address.apply_removal_policy(RemovalPolicy.RETAIN)
        ec2.CfnEIPAssociation(self, "AddressAssociation",
                              allocation_id=address.attr_allocation_id,
                              instance_id=host.instance_id)
        self.cluster = cluster
        self.instance = host
        self.public_ip = address.ref
        CfnOutput(self, "PublicIp", value=address.ref)
        CfnOutput(self, "InstanceId", value=host.instance_id)
