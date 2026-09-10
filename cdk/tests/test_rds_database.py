def test_database(resources):
    database = resources["AlpinePeakRdsDatabase"]["Properties"]
    assert database["DBInstanceIdentifier"] == "alpine-peak-db-rds"
    assert database["Engine"] == "postgres"
    assert database["StorageEncrypted"] is True
    assert database["VPCSecurityGroups"] == [
        {"Fn::GetAtt": ["AlpinePeakRdsSecurityGroup", "GroupId"]},
        {"Fn::GetAtt": ["AlpinePeakOperatorRdsAccessSecurityGroup", "GroupId"]},
    ]
    assert "MasterUsername" not in database
    assert "MasterUserPassword" not in database
    assert "ManageMasterUserPassword" not in database


def test_database_access(resources):
    ingress = resources["RdsSecurityGroupfromApplication5432"]["Properties"]
    assert ingress["FromPort"] == ingress["ToPort"] == 5432
    assert ingress["IpProtocol"] == "tcp"
    assert ingress["SourceSecurityGroupId"] == {
        "Fn::GetAtt": ["AlpinePeakServiceSecurityGroup", "GroupId"],
    }
    assert ingress["GroupId"] == {"Fn::GetAtt": ["AlpinePeakRdsSecurityGroup", "GroupId"]}
