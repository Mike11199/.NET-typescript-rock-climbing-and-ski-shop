"""Immutable images, deployment order, and infrastructure boundaries."""


def test_release_pipeline(workflow):
    for text in (
        "IMAGE_TAG: front-end-${{ github.sha }}",
        "IMAGE_TAG: back-end-dotnet-api-${{ github.sha }}",
        "deploy-repository:", "deploy-application:", "CDK_CLI_VERSION: 2.1139.0",
        'npm install --global "aws-cdk@$CDK_CLI_VERSION"',
        "--parameters ImageTag=${{ github.sha }}",
    ):
        assert text in workflow
    steps = ("cdk deploy AlpinePeakRepositoryStack", "uses: aws-actions/amazon-ecr-login@v2",
             "docker push", "cdk deploy AlpinePeakStack")
    positions = [workflow.index(step) for step in steps]
    assert positions == sorted(positions)
    deploy = workflow[positions[-1]:]
    assert deploy.index("--exclusively") < deploy.index("--parameters")


def test_no_manual_infrastructure_changes(workflow):
    for text in (
        "--revert-drift", "cdk deploy AlpinePeakOperatorAccessStack",
        "create-repository", "describe-repositories", "backend_v2_socket_io_api",
        "back-end-express-socket-io-api", "npx --yes aws-cdk@2",
        "route53 change-resource-record-sets", "elbv2 create-rule",
        "elbv2 modify-rule", "acm request-certificate",
    ):
        assert text not in workflow
