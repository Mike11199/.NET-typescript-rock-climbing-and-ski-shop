"""Define the independently deployable Alpine Peak CDK stacks."""

from aws_cdk import App, Environment
from alpine_peak_cdk.media_stack import MediaStack

from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack
from alpine_peak_cdk.repository_stack import RepositoryStack


def create_stacks(app: App):
    """Create stacks with the application's one-way repository dependency."""
    repository_stack = RepositoryStack(
        app, "AlpinePeakRepositoryStack", analytics_reporting=False
    )
    application_stack = AlpinePeakStack(app, "AlpinePeakStack")
    application_stack.add_stack_dependency(repository_stack)
    media = MediaStack(
        app, "AlpinePeakMediaStack", env=Environment(region="us-east-1"),
        analytics_reporting=False,
    )
    media.add_stack_dependency(application_stack)
    return repository_stack, application_stack, media


def main() -> None:
    app = App()
    create_stacks(app)
    app.synth()


if __name__ == "__main__":
    main()
