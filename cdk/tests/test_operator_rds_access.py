"""Tests for pgAdmin access owned by the main application stack."""

from aws_cdk import App
from aws_cdk.assertions import Template

import app as cdk_app
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack


def test_application_stack_owns_retained_public_postgres_group():
    document = Template.from_stack(AlpinePeakStack(App(), "ApplicationStack")).to_json()
    security_group = document["Resources"]["AlpinePeakOperatorRdsAccessSecurityGroup"]

    assert security_group["DeletionPolicy"] == "Retain"
    assert security_group["UpdateReplacePolicy"] == "Retain"
    assert security_group["Properties"] == {
        "GroupDescription": "Public pgAdmin access to Alpine Peak PostgreSQL",
        "VpcId": {"Fn::ImportValue": "SharedVpcId"},
        "SecurityGroupEgress": [
            {
                "CidrIp": "0.0.0.0/0",
                "Description": "Allow all outbound traffic by default",
                "IpProtocol": "-1",
            }
        ],
        "SecurityGroupIngress": [
            {
                "CidrIp": "0.0.0.0/0",
                "Description": "Public PostgreSQL for pgAdmin with a changing home IP",
                "FromPort": 5432,
                "IpProtocol": "tcp",
                "ToPort": 5432,
            }
        ],
    }
    assert document["Outputs"]["OperatorRdsAccessSecurityGroupId"]["Export"] == {
        "Name": "AlpinePeakOperatorRdsAccessSecurityGroupId"
    }


def test_app_creates_only_repository_and_application_stacks():
    app = App()

    repository_stack, application_stack = cdk_app.create_stacks(app)

    assert repository_stack.stack_name == "AlpinePeakRepositoryStack"
    assert application_stack.stack_name == "AlpinePeakStack"
