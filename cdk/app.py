"""Synthesize the Alpine Peak production stack locally.

`cdk synth` creates only a CloudFormation template. It does not contact AWS,
bootstrap CDK, deploy, change DNS, or alter live traffic.
"""

from aws_cdk import App, Environment

from alpine_peak_cdk.alpine_peak_existing_resources import AWS_ACCOUNT_ID, AWS_REGION
from alpine_peak_cdk.alpine_peak_stack import AlpinePeakStack


def main() -> None:
    app = App()
    AlpinePeakStack(
        app,
        "AlpinePeakStack",
        env=Environment(account=AWS_ACCOUNT_ID, region=AWS_REGION),
    )
    app.synth()


if __name__ == "__main__":
    main()
