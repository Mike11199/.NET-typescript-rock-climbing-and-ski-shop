"""Import-ready declaration for the existing Alpine Peak PostgreSQL instance.

The resource belongs to ``AlpinePeakStack``. This helper is a separate source
file only for readability and intentionally contains no database credentials.
"""

from aws_cdk import Fn, RemovalPolicy, Stack
from aws_cdk import aws_rds as rds

from . import alpine_peak_existing_resources as existing


def add_rds_database(
    stack: Stack,
    *,
    application_security_group_id: str,
    operator_security_group_id: str,
) -> rds.CfnDBInstance:
    """Declare the existing production database exactly for CFN import."""
    kms_key_arn = stack.format_arn(
        service="kms",
        resource="key",
        resource_name=existing.RDS_KMS_KEY_ID,
    )
    database = rds.CfnDBInstance(
        stack,
        "RdsDatabaseResource",
        allocated_storage="20",
        auto_minor_version_upgrade=True,
        availability_zone=Fn.import_value("SharedPublicSubnet2AvailabilityZone"),
        backup_retention_period=1,
        backup_target="region",
        ca_certificate_identifier="rds-ca-rsa2048-g1",
        copy_tags_to_snapshot=True,
        database_insights_mode="standard",
        db_instance_class="db.t4g.micro",
        db_instance_identifier=existing.RDS_DATABASE_IDENTIFIER,
        db_parameter_group_name="default.postgres16",
        db_subnet_group_name="default-vpc-031a34e2307900372",
        dedicated_log_volume=False,
        deletion_protection=False,
        enable_iam_database_authentication=False,
        enable_performance_insights=True,
        engine="postgres",
        engine_lifecycle_support="open-source-rds-extended-support",
        engine_version="16.13",
        kms_key_id=kms_key_arn,
        license_model="postgresql-license",
        max_allocated_storage=1000,
        monitoring_interval=0,
        multi_az=False,
        network_type="IPV4",
        option_group_name="default:postgres-16",
        performance_insights_kms_key_id=kms_key_arn,
        performance_insights_retention_period=7,
        port="5432",
        preferred_backup_window="10:23-10:53",
        preferred_maintenance_window="thu:07:48-thu:08:18",
        publicly_accessible=True,
        storage_encrypted=True,
        storage_type="gp2",
        vpc_security_groups=[
            application_security_group_id,
            operator_security_group_id,
        ],
    )
    database.override_logical_id("AlpinePeakRdsDatabase")
    database.apply_removal_policy(RemovalPolicy.RETAIN)
    return database
