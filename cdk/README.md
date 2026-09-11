# Alpine Peak Climbing and Ski Shop CDK

GitHub Actions deploys the app using AWS CDK.

The frontend, .NET API, and PostgreSQL run as ECS containers on one On-Demand
`t3.nano`. PostgreSQL data lives on retained EBS storage.

## Structure

- `app.py` creates the repository and application stacks.
- `alpine_peak_cdk/` contains the stack definitions.
- `alpine_peak_cdk/constructs/` contains small constructs for networking, routing,
  EC2, containers, credentials, and logging.
- `postgres/` contains the PostgreSQL Docker image and configuration.
- `tests/` checks the main infrastructure settings.

## Runtime

- The pinned AMI keeps routine app deployments on the same EC2 host.
- On-Demand EC2 has no Spot interruptions.
- The EC2 role is limited to this app's ECS cluster; ECS fetches only the app's required secrets.
- Container updates briefly stop the app; only one database container runs at a time.

## Database

- Secrets Manager supplies the API connection string.
- Container restarts and EC2 stop/start keep the database on EBS.
- Replacing EC2 creates a new disk. The old disk is retained; reattach it or restore a backup manually.
- Removing RDS from CDK retains it. Rolling back requires re-importing RDS and copying back any new writes.
