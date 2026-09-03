"""Workflow contract: one commit SHA -> immutable ECR images + CDK deployment."""

from pathlib import Path


WORKFLOW = (
    Path(__file__).parents[2]
    / ".github"
    / "workflows"
    / "deploy-cdk-aws.yml"
)


def test_workflow_deploys_from_the_same_commit_sha() -> None:
    """One commit SHA -> immutable images deployed via CDK ImageTag parameter."""
    text = WORKFLOW.read_text(encoding="utf-8")

    assert "IMAGE_TAG: front-end-${{ github.sha }}" in text
    assert "IMAGE_TAG: back-end-express-socket-io-api-${{ github.sha }}" in text
    assert "IMAGE_TAG: back-end-dotnet-api-${{ github.sha }}" in text
    assert "deploy-repository:" in text
    assert "deploy-application:" in text
    assert "CDK_CLI_VERSION: 2.1139.0" in text
    assert 'npm install --global "aws-cdk@$CDK_CLI_VERSION"' in text
    assert "cdk deploy AlpinePeakRepositoryStack" in text
    assert "cdk deploy AlpinePeakStack" in text
    assert "--parameters ImageTag=${{ github.sha }}" in text
    assert "npx --yes aws-cdk@2" not in text


def test_workflow_does_not_create_or_switch_dns_or_listener_rules() -> None:
    """CDK deployment only; shared ALB/DNS promotion is a separate manual step."""
    text = WORKFLOW.read_text(encoding="utf-8")

    assert "route53 change-resource-record-sets" not in text
    assert "elbv2 create-rule" not in text
    assert "elbv2 modify-rule" not in text
    assert "acm request-certificate" not in text
