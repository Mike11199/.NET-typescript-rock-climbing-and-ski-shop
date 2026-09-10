"""Owned API logs and execution permissions."""


def test_dotnet_logs(template, resources):
    template.resource_count_is("AWS::Logs::LogGroup", 1)
    group = resources["AlpinePeakDotnetLogGroup"]["Properties"]
    assert group == {
        "LogGroupName": "/ecs/deploy-ski-shop-back-end-v2-dotnet", "RetentionInDays": 30,
    }
    task = next(iter(template.find_resources("AWS::ECS::TaskDefinition").values()))["Properties"]
    api = next(c for c in task["ContainerDefinitions"] if c["Name"] == "back-end-dotnet-api")
    assert api["LogConfiguration"]["Options"]["awslogs-group"] == group["LogGroupName"]
    assert task["ExecutionRoleArn"] == {"Fn::GetAtt": ["AlpinePeakExecutionRole", "Arn"]}


def test_execution_role(resources):
    role = resources["AlpinePeakExecutionRole"]["Properties"]
    assert role["AssumeRolePolicyDocument"]["Statement"] == [{
        "Action": "sts:AssumeRole", "Effect": "Allow",
        "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    }]
    assert "AmazonECSTaskExecutionRolePolicy" in str(role["ManagedPolicyArns"])
    assert "RoleName" not in role and "ecsTaskExecutionRole" not in str(resources)
    assert len(role["Policies"]) == 1
    assert role["Policies"][0]["PolicyDocument"]["Statement"] == [{
        "Effect": "Allow", "Resource": "*",
        "Action": ["ssm:GetParameters", "secretsmanager:GetSecretValue"],
    }]
