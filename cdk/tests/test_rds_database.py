"""Import contract for the existing Alpine Peak PostgreSQL instance."""

from pathlib import Path

from aws_cdk import App
from aws_cdk.assertions import Template

import app as cdk_app
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack


REPO_ROOT = Path(__file__).resolve().parents[2]


def _document() -> dict:
    return Template.from_stack(AlpinePeakStack(App(), "ApplicationStack")).to_json()


def test_application_stack_owns_exactly_one_retained_rds_instance():
    document = _document()
    databases = {
        logical_id: resource
        for logical_id, resource in document["Resources"].items()
        if resource["Type"] == "AWS::RDS::DBInstance"
    }

    assert set(databases) == {"AlpinePeakRdsDatabase"}
    database = databases["AlpinePeakRdsDatabase"]
    assert database["DeletionPolicy"] == "Retain"
    assert database["UpdateReplacePolicy"] == "Retain"


def test_rds_instance_matches_the_verified_live_import_inventory():
    database = _document()["Resources"]["AlpinePeakRdsDatabase"]

    assert database["Properties"] == {
        "AllocatedStorage": "20",
        "AutoMinorVersionUpgrade": True,
        "AvailabilityZone": {
            "Fn::ImportValue": "SharedPublicSubnet2AvailabilityZone"
        },
        "BackupRetentionPeriod": 1,
        "BackupTarget": "region",
        "CACertificateIdentifier": "rds-ca-rsa2048-g1",
        "CopyTagsToSnapshot": True,
        "DatabaseInsightsMode": "standard",
        "DBInstanceClass": "db.t4g.micro",
        "DBInstanceIdentifier": "alpine-peak-db-rds",
        "DBParameterGroupName": "default.postgres16",
        "DBSubnetGroupName": "default-vpc-031a34e2307900372",
        "DedicatedLogVolume": False,
        "DeletionProtection": False,
        "EnableIAMDatabaseAuthentication": False,
        "Engine": "postgres",
        "EngineLifecycleSupport": "open-source-rds-extended-support",
        "EngineVersion": "16.13",
        "KmsKeyId": {
            "Fn::Join": [
                "",
                [
                    "arn:",
                    {"Ref": "AWS::Partition"},
                    ":kms:",
                    {"Ref": "AWS::Region"},
                    ":",
                    {"Ref": "AWS::AccountId"},
                    ":key/baa6ff9f-797e-4564-b672-50080d0e04e5",
                ],
            ]
        },
        "LicenseModel": "postgresql-license",
        "MaxAllocatedStorage": 1000,
        "MonitoringInterval": 0,
        "MultiAZ": False,
        "NetworkType": "IPV4",
        "OptionGroupName": "default:postgres-16",
        "EnablePerformanceInsights": True,
        "PerformanceInsightsKMSKeyId": {
            "Fn::Join": [
                "",
                [
                    "arn:",
                    {"Ref": "AWS::Partition"},
                    ":kms:",
                    {"Ref": "AWS::Region"},
                    ":",
                    {"Ref": "AWS::AccountId"},
                    ":key/baa6ff9f-797e-4564-b672-50080d0e04e5",
                ],
            ]
        },
        "PerformanceInsightsRetentionPeriod": 7,
        "Port": "5432",
        "PreferredBackupWindow": "10:23-10:53",
        "PreferredMaintenanceWindow": "thu:07:48-thu:08:18",
        "PubliclyAccessible": True,
        "StorageEncrypted": True,
        "StorageType": "gp2",
        "VPCSecurityGroups": [
            {"Fn::GetAtt": ["AlpinePeakRdsSecurityGroup", "GroupId"]},
            {
                "Fn::GetAtt": [
                    "AlpinePeakOperatorRdsAccessSecurityGroup",
                    "GroupId",
                ]
            },
        ],
    }


def test_rds_instance_synthesizes_no_credentials_or_secret_resource():
    document = _document()
    database_properties = document["Resources"]["AlpinePeakRdsDatabase"]["Properties"]
    serialized = str(document).lower()

    assert "MasterUsername" not in database_properties
    assert "MasterUserPassword" not in database_properties
    assert "ManageMasterUserPassword" not in database_properties
    assert "postgresql://" not in serialized
    assert all(
        resource["Type"] != "AWS::SecretsManager::Secret"
        for resource in document["Resources"].values()
    )


def test_rds_identifier_and_endpoint_are_exposed_without_credentials():
    outputs = _document()["Outputs"]

    assert outputs["RdsDatabaseIdentifier"]["Value"] == {
        "Ref": "AlpinePeakRdsDatabase"
    }
    assert outputs["RdsDatabaseEndpoint"]["Value"] == {
        "Fn::GetAtt": ["AlpinePeakRdsDatabase", "Endpoint.Address"]
    }


def test_rds_declaration_remains_in_the_main_application_stack():
    app = App()
    repository_stack, application_stack = cdk_app.create_stacks(app)

    assert repository_stack.stack_name == "AlpinePeakRepositoryStack"
    assert application_stack.stack_name == "AlpinePeakStack"
    assert all(stack.stack_name != "AlpinePeakDatabaseStack" for stack in app.node.children)


def test_workflow_keeps_exclusive_application_deploy_without_drift_repair():
    workflow = (
        REPO_ROOT / ".github" / "workflows" / "deploy-cdk-aws.yml"
    ).read_text(encoding="utf-8")
    application_deploy = workflow[workflow.index("cdk deploy AlpinePeakStack") :]

    assert "--exclusively" in application_deploy
    assert "--revert-drift" not in application_deploy
