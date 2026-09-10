def test_log_retention(resources):
    assert resources["AlpinePeakDotnetLogGroup"]["Properties"] == {
        "LogGroupName": "/ecs/deploy-ski-shop-back-end-v2-dotnet",
        "RetentionInDays": 30,
    }


def test_execution_role(resources):
    role = resources["AlpinePeakExecutionRole"]["Properties"]
    assert role["AssumeRolePolicyDocument"]["Statement"] == [{
        "Action": "sts:AssumeRole", "Effect": "Allow",
        "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    }]
    assert "AmazonECSTaskExecutionRolePolicy" in str(role["ManagedPolicyArns"])
    assert len(role["Policies"]) == 1
    assert role["Policies"][0]["PolicyDocument"]["Statement"] == [{
        "Effect": "Allow", "Resource": "*",
        "Action": ["ssm:GetParameters", "secretsmanager:GetSecretValue"],
    }]
