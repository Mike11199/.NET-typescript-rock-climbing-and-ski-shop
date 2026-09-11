"""Reference the shared VPC and ALB; do not create networking infrastructure."""

from aws_cdk import Fn
from aws_cdk import aws_ec2 as ec2
from constructs import Construct


class SharedNetwork(Construct):
    def __init__(self, scope, construct_id):
        super().__init__(scope, construct_id)
        self.vpc_id = Fn.import_value("SharedVpcId")
        zones = [Fn.import_value(f"SharedPublicSubnet{i}AvailabilityZone") for i in (1, 2)]
        subnets = [Fn.import_value(f"SharedPublicSubnet{i}Id") for i in (1, 2)]
        self.vpc = ec2.Vpc.from_vpc_attributes(
            self, "Vpc", vpc_id=self.vpc_id,
            availability_zones=zones, public_subnet_ids=subnets,
        )
        self.subnet = ec2.Subnet.from_subnet_attributes(
            self, "Subnet", subnet_id=subnets[0], availability_zone=zones[0],
        )
        self.alb_security_group = ec2.SecurityGroup.from_security_group_id(
            self, "AlbSecurityGroup", Fn.import_value("SharedAlbSecurityGroupId"),
            mutable=False,
        )
