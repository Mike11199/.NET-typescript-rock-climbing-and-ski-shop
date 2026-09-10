"""Public pgAdmin access owned by the application stack."""


def test_operator_access(resources, document):
    assert resources["AlpinePeakOperatorRdsAccessSecurityGroup"]["Properties"] == {
        "GroupDescription": "Public pgAdmin access to Alpine Peak PostgreSQL",
        "VpcId": {"Fn::ImportValue": "SharedVpcId"},
        "SecurityGroupEgress": [{
            "CidrIp": "0.0.0.0/0", "IpProtocol": "-1",
            "Description": "Allow all outbound traffic by default",
        }],
        "SecurityGroupIngress": [{
            "CidrIp": "0.0.0.0/0", "IpProtocol": "tcp", "FromPort": 5432, "ToPort": 5432,
            "Description": "Public PostgreSQL for pgAdmin with a changing home IP",
        }],
    }
    assert document["Outputs"]["OperatorRdsAccessSecurityGroupId"]["Export"] == {
        "Name": "AlpinePeakOperatorRdsAccessSecurityGroupId",
    }
