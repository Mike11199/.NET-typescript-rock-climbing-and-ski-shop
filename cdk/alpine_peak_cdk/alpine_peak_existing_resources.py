"""Existing Alpine Peak inputs used by the application CDK stack.

Shared hosted-zone and certificate ownership is defined by SharedDomainsStack
in C:/Git/shared-infra-aws-cdk. AlpinePeakStack owns its root A-alias record and
consumes shared hosted-zone, ALB, and listener exports for that route.

The ECR repository is managed externally by GitHub Actions (auto-created on first push).
The root alias, ECS cluster, service, task definition, target group, and listener
rule are owned by AlpinePeakStack.

No value in this file is a credential or secret; SSM parameters are referenced
by ARN only so tasks can resolve them at runtime.
"""

AWS_ACCOUNT_ID = "456461478565"
AWS_REGION = "us-west-1"

# External network/edge references. This CDK never creates or owns them.
SERVICE_SECURITY_GROUP_ID = "sg-0190e299544ca1711"
VPC_ID = "vpc-031a34e2307900372"

DOMAIN_NAME = "alpine-peak-climbing-ski-gear.com"

AVAILABILITY_ZONES = ("us-west-1b", "us-west-1c")
PUBLIC_SUBNET_IDS = (
    "subnet-0069d564c7d9784e5",  # us-west-1b
    "subnet-0e28687dfd9d81afc",  # us-west-1c
)

# Existing runtime dependencies, referenced without reading their values.
EXECUTION_ROLE_ARN = "arn:aws:iam::456461478565:role/ecsTaskExecutionRole"
EXPRESS_LOG_GROUP_NAME = "/ecs/deploy-ski-shop-back-end-v1-express"
DOTNET_LOG_GROUP_NAME = "/ecs/deploy-ski-shop-back-end-v2-dotnet"
JWT_PARAMETER_ARN = "arn:aws:ssm:us-west-1:456461478565:parameter/JWT_STRING_SKI_SHOP"
MONGO_PARAMETER_ARN = "arn:aws:ssm:us-west-1:456461478565:parameter/MONGO_URL_SKI_ROCK_SHOP"
POSTGRES_PARAMETER_ARN = "arn:aws:ssm:us-west-1:456461478565:parameter/POSTGRES_URL_SKI_ROCK_SHOP"
GOOGLE_OAUTH_CLIENT_ID_PARAMETER_ARN = (
    "arn:aws:ssm:us-west-1:456461478565:parameter/GOOGLE_OAUTH_CLIENT_ID"
)
