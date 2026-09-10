"""Database settings and credential boundaries."""


def test_database_settings(template, resources):
    template.resource_count_is("AWS::RDS::DBInstance", 1)
    key = {"Fn::Join": ["", [
        "arn:", {"Ref": "AWS::Partition"}, ":kms:", {"Ref": "AWS::Region"}, ":",
        {"Ref": "AWS::AccountId"}, ":key/baa6ff9f-797e-4564-b672-50080d0e04e5",
    ]]}
    assert resources["AlpinePeakRdsDatabase"]["Properties"] == {
        "AllocatedStorage": "20", "AutoMinorVersionUpgrade": True,
        "AvailabilityZone": {"Fn::ImportValue": "SharedPublicSubnet2AvailabilityZone"},
        "BackupRetentionPeriod": 1, "BackupTarget": "region",
        "CACertificateIdentifier": "rds-ca-rsa2048-g1", "CopyTagsToSnapshot": True,
        "DatabaseInsightsMode": "standard", "DBInstanceClass": "db.t4g.micro",
        "DBInstanceIdentifier": "alpine-peak-db-rds",
        "DBParameterGroupName": "default.postgres16",
        "DBSubnetGroupName": "default-vpc-031a34e2307900372",
        "DedicatedLogVolume": False, "DeletionProtection": False,
        "EnableIAMDatabaseAuthentication": False, "Engine": "postgres",
        "EngineLifecycleSupport": "open-source-rds-extended-support", "EngineVersion": "16.13",
        "KmsKeyId": key, "LicenseModel": "postgresql-license", "MaxAllocatedStorage": 1000,
        "MonitoringInterval": 0, "MultiAZ": False, "NetworkType": "IPV4",
        "OptionGroupName": "default:postgres-16", "EnablePerformanceInsights": True,
        "PerformanceInsightsKMSKeyId": key, "PerformanceInsightsRetentionPeriod": 7,
        "Port": "5432", "PreferredBackupWindow": "10:23-10:53",
        "PreferredMaintenanceWindow": "thu:07:48-thu:08:18", "PubliclyAccessible": True,
        "StorageEncrypted": True, "StorageType": "gp2",
        "VPCSecurityGroups": [
            {"Fn::GetAtt": [name, "GroupId"]}
            for name in ("AlpinePeakRdsSecurityGroup", "AlpinePeakOperatorRdsAccessSecurityGroup")
        ],
    }


def test_database_credentials_and_outputs(template, document, resources):
    props = resources["AlpinePeakRdsDatabase"]["Properties"]
    assert not {"MasterUsername", "MasterUserPassword", "ManageMasterUserPassword"} & props.keys()
    assert "postgresql://" not in str(document).lower()
    template.resource_count_is("AWS::SecretsManager::Secret", 0)
    outputs = document["Outputs"]
    assert outputs["RdsDatabaseIdentifier"]["Value"] == {"Ref": "AlpinePeakRdsDatabase"}
    assert outputs["RdsDatabaseEndpoint"]["Value"] == {
        "Fn::GetAtt": ["AlpinePeakRdsDatabase", "Endpoint.Address"],
    }
