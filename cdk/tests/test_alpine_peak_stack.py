def test_service(resources):
    service = resources["ProductionService"]["Properties"]
    assert service["ServiceName"] == "alpine-peak-ski-shop"
    assert service["DesiredCount"] == 1
    assert service["LoadBalancers"][0]["ContainerName"] == "front-end"
    assert service["LoadBalancers"][0]["ContainerPort"] == 80


def test_routing(resources):
    rule = resources["ProductionListenerRule"]["Properties"]
    assert rule["ListenerArn"] == {"Fn::ImportValue": "SharedHttpsListenerArn"}
    assert rule["Priority"] == 1
    assert rule["Conditions"][0]["HostHeaderConfig"]["Values"] == [
        "alpine-peak-climbing-ski-gear.com",
    ]
    alias = resources["AlpinePeakAliasRecord"]["Properties"]
    assert alias["Type"] == "A"
    assert alias["Name"] == "alpine-peak-climbing-ski-gear.com."
    assert alias["HostedZoneId"] == {"Fn::ImportValue": "SharedAlpinePeakHostedZoneId"}
    assert resources["ProductionTargetGroup"]["Properties"]["HealthCheckPath"] == "/"


def test_containers(resources):
    task = next(r["Properties"] for r in resources.values() if r["Type"] == "AWS::ECS::TaskDefinition")
    containers = {c["Name"]: c for c in task["ContainerDefinitions"]}
    assert set(containers) == {"front-end", "back-end-dotnet-api"}
    for container in containers.values():
        assert {"Ref": "ImageTag"} in container["Image"]["Fn::Join"][1]
    logs = containers["back-end-dotnet-api"]["LogConfiguration"]["Options"]
    assert logs["awslogs-group"] == "/ecs/deploy-ski-shop-back-end-v2-dotnet"
    assert task["ExecutionRoleArn"] == {"Fn::GetAtt": ["AlpinePeakExecutionRole", "Arn"]}
