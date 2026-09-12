"""Media delivery in us-east-1, separate from the application in us-west-1.

CloudFront requires its ACM certificate and CLOUDFRONT-scoped WAF in us-east-1.
A CloudFormation stack belongs to one region, so delivery needs this separate
stack for both fresh deployments and updates. The main application stack owns
the S3 bucket in us-west-1 through MediaStorage. GitHub Actions deploys both
stacks using the standard CDK bootstrap roles configured in each region.
"""
from aws_cdk import (
    CfnOutput, CfnParameter, CfnResource, Stack,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_s3 as s3,
    aws_wafv2 as waf,
)
from constructs import Construct
from .media_storage import MEDIA_REGION, media_bucket_name

from .alpine_peak_existing_resources import DOMAIN_NAME as PRODUCTION_HOST

MEDIA_HOST = f"assets.{PRODUCTION_HOST}"


class MediaStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        zone_id = CfnParameter(self, "HostedZoneId", type="AWS::Route53::HostedZone::Id")
        zone = route53.HostedZone.from_hosted_zone_attributes(
            self, "ExistingZone", hosted_zone_id=zone_id.value_as_string,
            zone_name=PRODUCTION_HOST,
        )
        bucket = s3.Bucket.from_bucket_attributes(
            self, "MediaBucket", bucket_name=media_bucket_name(self),
            region=MEDIA_REGION,
        )
        certificate = acm.Certificate(
            self, "MediaCertificate", domain_name=MEDIA_HOST,
            validation=acm.CertificateValidation.from_dns(zone),
        )
        web_acl = waf.CfnWebACL(
            self, "MediaWebAcl", scope="CLOUDFRONT",
            default_action=waf.CfnWebACL.DefaultActionProperty(allow={}),
            visibility_config=waf.CfnWebACL.VisibilityConfigProperty(
                cloud_watch_metrics_enabled=False, sampled_requests_enabled=False,
                metric_name="alpinePeakMedia",
            ),
        )
        distribution = cloudfront.Distribution(
            self, "MediaDistribution", domain_names=[MEDIA_HOST],
            certificate=certificate, web_acl_id=web_acl.attr_arn,
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3BucketOrigin.with_origin_access_control(bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                response_headers_policy=cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
            ),
            comment="Alpine Peak media",
        )
        # CloudFormation supports cross-region S3 bucket policies from us-east-1.
        # Keep permissions with the distribution to avoid cross-region exports or
        # granting access to other distributions in this account.
        s3.CfnBucketPolicy(
            self, "RegionalMediaBucketPolicy", bucket=bucket.bucket_name,
            policy_document={
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "cloudfront.amazonaws.com"},
                        "Action": "s3:GetObject",
                        "Resource": bucket.arn_for_objects("*"),
                        "Condition": {"StringEquals": {"AWS:SourceArn": distribution.distribution_arn}},
                    },
                    {
                        "Effect": "Deny", "Principal": {"AWS": "*"},
                        "Action": "s3:*",
                        "Resource": [bucket.bucket_arn, bucket.arn_for_objects("*")],
                        "Condition": {"Bool": {"aws:SecureTransport": "false"}},
                    },
                ],
            },
        )
        # Match the portfolio CloudFront subscription configuration.
        plan = CfnResource(
            self, "FreeMediaPlan", type="AWS::PricingPlanManager::Subscription",
            properties={
                "PlanFamily": "CloudFront", "PlanTier": "FREE", "UsageLevel": "DEFAULT",
                "ResourceArns": [distribution.distribution_arn, web_acl.attr_arn],
            },
        )
        for record_type in (route53.ARecord, route53.AaaaRecord):
            record = record_type(
                self, record_type.__name__, zone=zone, record_name="assets",
                target=route53.RecordTarget.from_alias(targets.CloudFrontTarget(distribution)),
            )
            record.node.add_dependency(plan)
        CfnOutput(self, "BucketName", value=bucket.bucket_name)
        CfnOutput(self, "DistributionId", value=distribution.distribution_id)
        CfnOutput(self, "SubscriptionArn", value=plan.ref)
        CfnOutput(self, "MediaBaseUrl", value=f"https://{MEDIA_HOST}")
