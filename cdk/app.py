"""Synthesize the isolated Alpine Peak preview stack locally.

`cdk synth` creates only a CloudFormation template. It does not contact AWS,
bootstrap CDK, deploy a preview, change DNS, or alter production traffic.
"""

from aws_cdk import App, Environment

from alpine_peak_cdk.alpine_peak_existing_resources import AWS_ACCOUNT_ID, AWS_REGION
from alpine_peak_cdk.alpine_peak_preview_stack import AlpinePeakPreviewStack


def main() -> None:
    app = App()
    AlpinePeakPreviewStack(
        app,
        "AlpinePeakPreviewStack",
        env=Environment(account=AWS_ACCOUNT_ID, region=AWS_REGION),
    )
    app.synth()


if __name__ == "__main__":
    main()
