def test_operator_access(resources):
    group = resources["AlpinePeakOperatorRdsAccessSecurityGroup"]["Properties"]
    assert group["VpcId"] == {"Fn::ImportValue": "SharedVpcId"}
    assert len(group["SecurityGroupIngress"]) == 1
    ingress = group["SecurityGroupIngress"][0]
    assert ingress["CidrIp"] == "0.0.0.0/0"
    assert ingress["FromPort"] == ingress["ToPort"] == 5432
    assert ingress["IpProtocol"] == "tcp"
