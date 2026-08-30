"""Existing Alpine Peak inputs used by the CDK stack.

These identifiers are live AWS resources that the Alpine Peak application uses
but does not create during the first CDK deployment. They are inputs to the
application stack:

- the existing ECS cluster and networking remain external/shared;
- the existing target group belongs to the shared ALB edge and remains external;
- the ECS execution role, CloudWatch log groups, and SSM parameters are
  referenced by ARN/name, never recreated or read for their secret values.

The `AlpinePeakStack` declares the ECS service, its task definition, and a new
target group behind the shared ALB. No value in this file is a credential or a
secret.
"""

AWS_ACCOUNT_ID = "456461478565"
AWS_REGION = "us-west-1"

# ECS cluster (imported read-only; never created or modified).
ECS_CLUSTER_ARN = "arn:aws:ecs:us-west-1:456461478565:cluster/rock-climbing-ski-shop"

# External network/edge references. This CDK never creates or owns them.
SERVICE_SECURITY_GROUP_ID = "sg-0190e299544ca1711"
VPC_ID = "vpc-031a34e2307900372"

# Shared ALB (read-only import only; never created or modified).
SHARED_ALB_ARN = "arn:aws:elasticloadbalancing:us-west-1:456461478565:loadbalancer/app/consolidated-load-balancer/cebd4e468e9c8526"
# Canonical hosted zone ID for Route 53 Alias (required when creating an Alias to this ALB).
SHARED_ALB_CANONICAL_HOSTED_ZONE_ID = "Z368ELLRRE2KJ0"
SHARED_ALB_DNS_NAME = "consolidated-load-balancer-1342855394.us-west-1.elb.amazonaws.com"

# Route 53 hosted zone for domain routing (imported read-only).
ROUTE53_HOSTED_ZONE_ID = "Z040844618MP488RZ84GN"
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

# Task-definition shape captured from live revision 321.
TASK_FAMILY = "deploy-ski-shop-full-stack-github-actions-v3"
TASK_CPU = 512
TASK_MEMORY_MIB = 1024
