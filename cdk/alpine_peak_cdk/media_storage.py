"""Private media storage owned by the main application stack."""
from aws_cdk import RemovalPolicy, Stack, aws_s3 as s3
from constructs import Construct

MEDIA_REGION = "us-west-1"


def media_bucket_name(stack: Stack) -> str:
    return f"alpine-peak-media-{stack.account}-{MEDIA_REGION}"


class MediaStorage(Construct):
    def __init__(self, scope: Construct, construct_id: str) -> None:
        super().__init__(scope, construct_id)
        self.bucket = s3.Bucket(
            self, "MediaBucket", bucket_name=media_bucket_name(Stack.of(self)),
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            removal_policy=RemovalPolicy.RETAIN,
        )
        # The delivery stack owns the bucket policy, including TLS enforcement.
