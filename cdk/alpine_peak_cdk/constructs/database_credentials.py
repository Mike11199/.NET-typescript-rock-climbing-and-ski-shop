"""Generate the PostgreSQL password and client connection strings."""

from aws_cdk import CfnOutput, RemovalPolicy, SecretValue
from aws_cdk import aws_secretsmanager as secretsmanager
from constructs import Construct


class DatabaseCredentials(Construct):
    def __init__(self, scope, construct_id, *, public_ip):
        super().__init__(scope, construct_id)

        password = secretsmanager.Secret(
            self, "Password",
            generate_secret_string=secretsmanager.SecretStringGenerator(
                password_length=32, exclude_punctuation=True,
            ),
        )
        password.apply_removal_policy(RemovalPolicy.RETAIN)
        # CloudFormation resolves the password only into another secret, never an output.
        password_reference = password.secret_value.unsafe_unwrap()
        connections = secretsmanager.Secret(
            self, "Connections",
            secret_object_value={
                "connectionString": SecretValue.unsafe_plain_text(
                    f"postgresql://postgres:{password_reference}@{public_ip}:5432/alpine-peak-db?sslmode=require"
                ),
                "applicationConnectionString": SecretValue.unsafe_plain_text(
                    "Host=127.0.0.1;Port=5432;Database=alpine-peak-db;Username=postgres;"
                    f"Password={password_reference};SSL Mode=Require;"
                    "Trust Server Certificate=true;Maximum Pool Size=10"
                ),
            },
        )
        connections.apply_removal_policy(RemovalPolicy.RETAIN)
        self.password = password
        self.connections = connections
        CfnOutput(self, "PasswordSecretArn", value=password.secret_arn)
        CfnOutput(self, "ConnectionSecretArn", value=connections.secret_arn)
