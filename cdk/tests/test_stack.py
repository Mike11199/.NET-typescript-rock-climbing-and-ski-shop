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
    assert stacks[1] in stacks[2].dependencies
