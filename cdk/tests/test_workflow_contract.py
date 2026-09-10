from pathlib import Path


def test_deployment():
    path = Path(__file__).resolve().parents[2] / ".github/workflows/deploy-cdk-aws.yml"
    workflow = path.read_text()
    assert "IMAGE_TAG: front-end-${{ github.sha }}" in workflow
    assert "IMAGE_TAG: back-end-dotnet-api-${{ github.sha }}" in workflow
    repository = workflow.index("cdk deploy AlpinePeakRepositoryStack")
    images = workflow.index("docker push")
    application = workflow.index("cdk deploy AlpinePeakStack")
    assert repository < images < application
    assert "--exclusively" in workflow[application:]
    assert "--parameters ImageTag=${{ github.sha }}" in workflow[application:]
    assert "--revert-drift" not in workflow
