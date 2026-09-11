"""The low-memory PostgreSQL container and persistent mount."""

from aws_cdk import Duration
from aws_cdk import aws_ecs as ecs
from constructs import Construct


class PostgresContainer(Construct):
    def __init__(self, scope, construct_id, *, task, password, logging, repository_uri, image_tag):
        super().__init__(scope, construct_id)

        postgres = task.add_container(
            "Postgres", container_name="postgres", image=ecs.ContainerImage.from_registry(
                f"{repository_uri}:postgres-{image_tag}"
            ),
            memory_limit_mib=128, memory_reservation_mib=64,
            environment={"POSTGRES_DB": "alpine-peak-db",
                         "PGDATA": "/var/lib/postgresql/data/pgdata"},
            secrets={"POSTGRES_PASSWORD": ecs.Secret.from_secrets_manager(password)},
            logging=logging,
            health_check=ecs.HealthCheck(
                command=["CMD-SHELL", "pg_isready -h 127.0.0.1 -U postgres -d alpine-peak-db"],
                interval=Duration.seconds(10), start_period=Duration.seconds(60),
                timeout=Duration.seconds(5), retries=5,
            ),
            stop_timeout=Duration.seconds(120),
        )
        postgres.add_mount_points(ecs.MountPoint(
            source_volume="postgres", container_path="/var/lib/postgresql/data",
            read_only=False,
        ))
        postgres.add_port_mappings(ecs.PortMapping(container_port=5432, host_port=5432))
        self.container = postgres
