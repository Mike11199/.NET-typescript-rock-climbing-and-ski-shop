# Alpine Peak Climbing and Ski Shop CDK

The frontend, .NET API, and PostgreSQL run as one ECS task on one On-Demand `t3.nano` EC2 host. Deployments run through GitHub Actions.

## Structure and ownership

```text
app.py                                  # connects the three stacks
alpine_peak_cdk/
+-- alpine_peak_existing_resources.py    # application constants
+-- application/
|   +-- stack.py                         # AlpinePeakStack
|   \-- constructs/
|       +-- nano_service.py              # connects the host and containers
|       +-- nano_host.py                 # EC2 host, ECS cluster, disk, and public IP
|       +-- host_role.py                 # EC2 host permissions
|       +-- application_containers.py    # frontend and API containers
|       +-- postgres_container.py        # database container and persistent mount
|       +-- database_credentials.py      # Secrets Manager password and connections
|       +-- runtime_dependencies.py      # API logs and ECS execution role
|       +-- shared_network.py            # imports shared networking
|       +-- web_routing.py               # Route 53 alias, ALB rule, and target group
|       \-- media_storage.py             # retained private S3 bucket
+-- media/
|   \-- stack.py                         # AlpinePeakMediaStack (us-east-1)
\-- repository/
    \-- stack.py                         # AlpinePeakRepositoryStack: retained ski-rock-climbing-shop ECR
```

The application stack owns the S3 bucket in `us-west-1`. The media stack owns CloudFront with a FREE-plan subscription, WAF, origin access control, the bucket policy, an ACM certificate, and Route 53 assets A/AAAA records. Its certificate and CloudFront-scoped WAF require `us-east-1`.

Shared infrastructure owns the VPC, subnets, ALB security group, hosted zone, ALB certificate, load balancer, and listeners. This application imports their CloudFormation exports.

## Deployment

Deploy shared infrastructure first; its workflow bootstraps missing CDK environments in both regions. The [site workflow](../.github/workflows/deploy-cdk-aws.yml) then deploys the repository, builds and pushes the frontend, API, and PostgreSQL images, and deploys the application and media stacks together. It reads the hosted-zone ID from shared exports.

A fresh account needs GitHub AWS credentials and the region configured, plus domain registration/name-server delegation. The existing SSM parameters `JWT_STRING_SKI_SHOP` and `GOOGLE_OAUTH_CLIENT_ID` must also be supplied. Media uploads and database schema/data migration are separate from CDK resource deployment.

## Runtime and data

The host uses a pinned AMI and retained EBS storage. Container restarts and EC2 stop/start preserve PostgreSQL data; replacing the host creates a new disk and retains the old one. Restore or migrate data before using a replacement host.

Container updates briefly stop the application and database. Only one database container runs at a time. PostgreSQL image configuration lives in `postgres/`.
