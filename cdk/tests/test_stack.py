"""Small checks for the deployment's important guarantees."""

from aws_cdk.assertions import Template


def one(resources, kind):
    matches = [r for r in resources.values() if r["Type"] == kind]
    assert len(matches) == 1
    return matches[0]


def test_one_ec2_service_and_three_containers(resources):
    assert not any(r["Type"].startswith("AWS::RDS::") for r in resources.values())
    service = one(resources, "AWS::ECS::Service")["Properties"]
    assert service["LaunchType"] == "EC2" and service["DesiredCount"] == 1
    assert service["DeploymentConfiguration"]["MaximumPercent"] == 100
    assert service["DeploymentConfiguration"]["MinimumHealthyPercent"] == 0
    task = one(resources, "AWS::ECS::TaskDefinition")["Properties"]
    assert task["NetworkMode"] == "host" and task["RequiresCompatibilities"] == ["EC2"]
    assert {c["Name"]: c["Memory"] for c in task["ContainerDefinitions"]} == {
        "Postgres": 128, "back-end-dotnet-api": 192, "front-end": 16,
    }
    assert task["Volumes"][0]["Host"]["SourcePath"] == "/var/lib/alpine-peak-postgres"


def test_persistent_on_demand_host(resources):
    host = one(resources, "AWS::EC2::Instance")
    assert host["Properties"]["InstanceType"] == "t3.nano"
    assert host["Properties"]["CreditSpecification"]["CPUCredits"] == "standard"
    assert "InstanceMarketOptions" not in host["Properties"]
    assert host["DeletionPolicy"] == host["UpdateReplacePolicy"] == "Retain"
    for kind in ("AWS::ECS::Cluster", "AWS::EC2::SecurityGroup", "AWS::IAM::InstanceProfile"):
        assert one(resources, kind)["DeletionPolicy"] == "Retain"
    disk = host["Properties"]["BlockDeviceMappings"][0]["Ebs"]
    assert disk == {"DeleteOnTermination": False, "Encrypted": True, "VolumeSize": 30, "VolumeType": "gp3"}


def test_website_and_database_access(resources):
    rule = resources["ProductionListenerRule"]["Properties"]
    assert rule["Actions"][0]["TargetGroupArn"] == {"Ref": "NanoTargetGroup"}
    assert resources["NanoTargetGroup"]["Properties"]["TargetType"] == "instance"
    service = one(resources, "AWS::ECS::Service")
    assert "ProductionListenerRule" in service["DependsOn"]
    assert service["Properties"]["LoadBalancers"][0]["TargetGroupArn"] == {"Ref": "NanoTargetGroup"}
    group = one(resources, "AWS::EC2::SecurityGroup")["Properties"]
    pg, = group["SecurityGroupIngress"]
    assert pg["CidrIp"] == "0.0.0.0/0"
    assert pg["FromPort"] == pg["ToPort"] == 5432
    http = one(resources, "AWS::EC2::SecurityGroupIngress")["Properties"]
    assert http["FromPort"] == http["ToPort"] == 80
    assert http["SourceSecurityGroupId"] == {"Fn::ImportValue": "SharedAlbSecurityGroupId"}



def test_secrets_and_repository(resources, stacks):
    secrets = [r for r in resources.values() if r["Type"] == "AWS::SecretsManager::Secret"]
    assert len(secrets) == 2 and all(s["DeletionPolicy"] == "Retain" for s in secrets)
    assert any("GenerateSecretString" in s["Properties"] for s in secrets)
    task = one(resources, "AWS::ECS::TaskDefinition")["Properties"]
    api = next(c for c in task["ContainerDefinitions"] if c["Name"] == "back-end-dotnet-api")
    assert api["DependsOn"] == [{"Condition": "HEALTHY", "ContainerName": "Postgres"}]
    assert "applicationConnectionString" in str(api["Secrets"])
    repository = Template.from_stack(stacks[0]).to_json()["Resources"]["AlpinePeakRepository"]
    assert repository["DeletionPolicy"] == "Retain"
    assert stacks[0] in stacks[1].dependencies


def test_limited_aws_permissions(resources):
    roles = [r["Properties"] for r in resources.values() if r["Type"] == "AWS::IAM::Role"]
    assert all(not r.get("ManagedPolicyArns") for r in roles)
    host = next(r for r in roles if "ec2.amazonaws.com" in str(r["AssumeRolePolicyDocument"]))
    host_statements = host["Policies"][0]["PolicyDocument"]["Statement"]
    for statement in host_statements:
        actions = statement["Action"]
        actions = [actions] if isinstance(actions, str) else actions
        assert all(a.startswith("ecs:") and "*" not in a for a in actions)
        if statement["Resource"] in ("*", ["*"]):
            assert actions == ["ecs:DiscoverPollEndpoint"]
    policies = [r["Properties"] for r in resources.values() if r["Type"] == "AWS::IAM::Policy"]
    for policy in policies:
        for statement in policy["PolicyDocument"]["Statement"]:
            if statement["Resource"] in ("*", ["*"]):
                assert statement["Action"] in ("ecr:GetAuthorizationToken", ["ecr:GetAuthorizationToken"])
