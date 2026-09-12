from aws_cdk.assertions import Template


def test_application(stacks):
    Template.from_stack(stacks[0]).resource_count_is("AWS::ECR::Repository", 1)
    app = Template.from_stack(stacks[1])
    app.resource_count_is("AWS::EC2::Instance", 1)
    app.has_resource_properties("AWS::ECS::Service", {"DesiredCount": 1})
    app.resource_count_is("AWS::RDS::DBInstance", 0)


def test_media(stacks):
    Template.from_stack(stacks[1]).has_resource("AWS::S3::Bucket", {"DeletionPolicy": "Retain"})
    Template.from_stack(stacks[2]).resource_count_is("AWS::CloudFront::Distribution", 1)
    # Anonymous product images require the managed SimpleCORS response policy.
    Template.from_stack(stacks[2]).has_resource_properties("AWS::CloudFront::Distribution", {
        "DistributionConfig": {"DefaultCacheBehavior": {
            "ResponseHeadersPolicyId": "60669652-455b-4ae9-85a4-c4c02393f86c",
        }},
    })
    assert stacks[1] in stacks[2].dependencies


def test_jwt_secret(stacks):
    app = Template.from_stack(stacks[1])
    secret_id, = app.find_resources("AWS::SecretsManager::Secret", {
        "Properties": {"GenerateSecretString": {"PasswordLength": 64}},
        "DeletionPolicy": "Retain", "UpdateReplacePolicy": "Retain",
    })
    app.resource_count_is("AWS::SecretsManager::RotationSchedule", 0)
    task, = app.find_resources("AWS::ECS::TaskDefinition").values()
    api = next(c for c in task["Properties"]["ContainerDefinitions"]
               if c["Name"] == "back-end-dotnet-api")
    assert {"Name": "JWT_SECRET_KEY", "ValueFrom": {"Ref": secret_id}} in api["Secrets"]
