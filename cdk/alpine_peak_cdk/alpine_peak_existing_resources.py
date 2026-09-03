"""Stable runtime names used by the Alpine Peak application stack.

Shared network and repository values are imported from CloudFormation exports.
Runtime ARNs are assembled by the stack from these names so the template remains
portable across AWS accounts and regions.
"""

DOMAIN_NAME = "alpine-peak-climbing-ski-gear.com"

# Existing runtime dependencies, referenced without reading secret values.
EXECUTION_ROLE_NAME = "ecsTaskExecutionRole"
EXPRESS_LOG_GROUP_NAME = "/ecs/deploy-ski-shop-back-end-v1-express"
DOTNET_LOG_GROUP_NAME = "/ecs/deploy-ski-shop-back-end-v2-dotnet"
JWT_PARAMETER_NAME = "JWT_STRING_SKI_SHOP"
MONGO_PARAMETER_NAME = "MONGO_URL_SKI_ROCK_SHOP"
POSTGRES_PARAMETER_NAME = "POSTGRES_URL_SKI_ROCK_SHOP"
GOOGLE_OAUTH_CLIENT_ID_PARAMETER_NAME = "GOOGLE_OAUTH_CLIENT_ID"
