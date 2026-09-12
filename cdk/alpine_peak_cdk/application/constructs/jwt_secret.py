"""
Generate the private key the API uses to sign and verify login tokens.

The signature prevents users from changing a token to impersonate someone else.
Secrets Manager creates the key once, and ECS injects it into the API without
exposing it to the browser. Deployments reuse it; automatic rotation is disabled.
A stolen valid token can still be misused, and endpoints must check permissions.
"""

from aws_cdk import RemovalPolicy, aws_secretsmanager as secretsmanager
from constructs import Construct


class JwtSecret(Construct):
    def __init__(self, scope: Construct, construct_id: str) -> None:
        super().__init__(scope, construct_id)
        self.secret = secretsmanager.Secret(
            self, "Secret",
            description="Ski shop API JWT signing key",
            generate_secret_string=secretsmanager.SecretStringGenerator(
                password_length=64, exclude_punctuation=True,
            ),
            removal_policy=RemovalPolicy.RETAIN,
        )
