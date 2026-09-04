# Alpine Peak CDK

Deployment is performed by GitHub Actions. The existing ECR repository, target group, and listener rule are now owned by their final CDK stacks; routine deployments use normal `cdk deploy`.

```text
AlpinePeakRepositoryStack
  → retained ECR repository: ski-rock-climbing-shop
  → export: AlpinePeakRepositoryUri

AlpinePeakStack (depends on AlpinePeakRepositoryStack)
  → ECS cluster and Fargate service: alpine-peak-ski-shop
  → target group and shared-listener rule
  → application service security group
  → retained ECS-to-RDS security group
  → retained pgAdmin RDS access security group
```

Three containers run in one task:

```text
front-end                         :80   → React SPA
back-end-express-socket-io-api    :5000 → Express/Socket.io API
back-end-dotnet-api               :5001 → .NET API
```

## Resource ownership

- Shared infrastructure exports the VPC, two public subnets and Availability
  Zones, shared ALB security group, hosted zone, ALB, and HTTPS listener values.
- `AlpinePeakRepositoryStack` owns the retained, AES256-encrypted, mutable ECR repository
  with push scanning disabled to match the existing repository.
- `AlpinePeakStack` owns its root A-alias, listener rule, target group, ECS
  resources, service security group, ECS-to-RDS security group, and pgAdmin RDS
  access security group.
- The service security group accepts port 80 only from the shared ALB security
  group. The ECS-to-RDS group accepts PostgreSQL port 5432 only from the
  application service group. The separate definition in
  `alpine_peak_cdk/operator_rds_access.py` adds the pgAdmin group to the same
  `AlpinePeakStack`; it is a separate file, not a separate CloudFormation stack.
- Runtime resource names remain stable, while account- and region-dependent
  references are built from CloudFormation pseudo parameters.

## Existing account

- The existing ECR repository, listener rule, and target group were retained and imported without changing physical IDs.
- Shared identifiers now come from CloudFormation exports.
- Drift detection reports `IN_SYNC`; the final CDK diff is empty; target health and HTTPS are healthy.
- RDS has the two Alpine-owned access groups below attached and active.

## RDS security groups

`AlpinePeakStack` owns and exports both retained groups:

- `AlpinePeakRdsSecurityGroupId` permits PostgreSQL only from the Alpine ECS
  service security group.
- `AlpinePeakOperatorRdsAccessSecurityGroupId` permits public IPv4 PostgreSQL
  for pgAdmin from a changing home address.

The RDS instance remains manually managed and is not created, imported, or
modified by CDK. Its security-group attachment is an operator action. Routine
GitHub Actions deployments deploy only `AlpinePeakStack` with the
`--exclusively` and `--revert-drift` flags, so CloudFormation maintains both
group definitions without changing the RDS attachment list.

## Drift repair

The application deployment uses `cdk deploy --revert-drift` so supported
application resources are reconciled with the template. Shared resources and the
manually managed RDS instance remain outside that repair boundary.

## Referenced, not created

CDK does not create or manage the shared ALB/VPC/subnets, route tables, the RDS
PostgreSQL instance, MongoDB Atlas, or secret values. Physical network IDs are
not stored in source; application stacks consume stable CloudFormation exports.
