"""Define the independently deployable Alpine Peak CDK stacks."""

from aws_cdk import App

from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack
from alpine_peak_cdk.repository_stack import RepositoryStack


def create_stacks(app: App) -> tuple[RepositoryStack, AlpinePeakStack]:
    """Create stacks with the application's one-way repository dependency."""
    repository_stack = RepositoryStack(
        app, "AlpinePeakRepositoryStack", analytics_reporting=False
    )
    application_stack = AlpinePeakStack(app, "AlpinePeakStack")
    application_stack.add_stack_dependency(repository_stack)
    return repository_stack, application_stack


def main() -> None:
    app = App()
    create_stacks(app)
    app.synth()


if __name__ == "__main__":
    main()
