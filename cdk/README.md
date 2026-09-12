# Alpine Peak Climbing and Ski Shop CDK

Deployments run only through the GitHub Actions CI/CD workflow using AWS CDK.

The frontend, .NET API, and PostgreSQL run as ECS containers on one On-Demand
`t3.nano` EC2. PostgreSQL data lives on retained EBS storage.

## Structure

- `app.py` creates the repository, application, and media delivery stacks.
- `alpine_peak_cdk/` contains the stack definitions.
- `alpine_peak_cdk/media_storage.py` defines the `MediaStorage` construct inside the application stack; its S3 bucket stays in `us-west-1`.
- `alpine_peak_cdk/media_stack.py` defines the separate delivery stack in `us-east-1`, required for CloudFront's ACM certificate and WAF. The same CI/CD workflow deploys it with the application.
- `postgres/` contains the PostgreSQL Docker image and configuration.
- `tests/` checks the main infrastructure settings.

Constructs and helpers in `alpine_peak_cdk/constructs/`:

| File | Responsibility |
| --- | --- |
| `shared_network.py` | References the shared VPC, subnet, and ALB security group. |
| `web_routing.py` | Routes the domain through the shared ALB to the EC2 service. |
| `nano_host.py` | Creates the EC2 server, retained EBS disk, Elastic IP, and network access rules. |
| `host_role.py` | Limits the server's IAM permissions to this app's ECS cluster. |
| `database_credentials.py` | Generates the database password and stores connection strings in Secrets Manager. |
| `postgres_container.py` | Configures PostgreSQL memory, health checks, and the persistent data mount. |
| `application_containers.py` | Configures the frontend and API images, secrets, and startup dependency. |
| `nano_service.py` | Assembles the host and containers into one ECS task and service. |
| `runtime_dependencies.py` | Creates the API log group and ECS execution role for images, logs, and secrets. |

## Runtime

- The pinned AMI keeps routine app deployments on the same EC2 host.
- On-Demand EC2 has no Spot interruptions.
- The EC2 role is limited to this app's ECS cluster; ECS fetches only the app's required secrets.
- Container updates briefly stop the app; only one database container runs at a time.

## Database

- Secrets Manager supplies the API connection string.
- Container restarts and EC2 stop/start keep the database on EBS.
- Replacing EC2 creates a new disk. The old disk is retained.
- Removing RDS from CDK retains it. Rolling back requires re-importing RDS and copying back any new writes.
