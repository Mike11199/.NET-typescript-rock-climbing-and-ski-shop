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
  → retained RDS instance: alpine-peak-db-rds
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
  resources, service security group, RDS instance, ECS-to-RDS security group,
  and pgAdmin RDS access security group.
- The service security group accepts port 80 only from the shared ALB security
  group. The ECS-to-RDS group accepts PostgreSQL port 5432 only from the
  application service group. The separate definition in
  `alpine_peak_cdk/operator_rds_access.py` adds the pgAdmin group to the same
  `AlpinePeakStack`; it is a separate file, not a separate CloudFormation stack.
- `alpine_peak_cdk/rds_database.py` similarly keeps the database declaration
  readable while the resource remains part of `AlpinePeakStack`.
- Runtime resource names remain stable, while account- and region-dependent
  references are built from CloudFormation pseudo parameters.

## Existing account

- The existing ECR repository, listener rule, and target group were retained and imported without changing physical IDs.
- Shared identifiers now come from CloudFormation exports.
- Drift detection reports `IN_SYNC`; the final CDK diff is empty; target health and HTTPS are healthy.
- The existing RDS instance was imported as `AlpinePeakRdsDatabase` without
  changing its physical identifier, endpoint, credentials, or configuration.
- RDS has the two Alpine-owned access groups below attached and active.

## RDS security groups

`AlpinePeakStack` owns and exports both retained groups:

- `AlpinePeakRdsSecurityGroupId` permits PostgreSQL only from the Alpine ECS
  service security group.
- `AlpinePeakOperatorRdsAccessSecurityGroupId` permits public IPv4 PostgreSQL
  for pgAdmin from a changing home address.

The imported RDS instance and both attached security groups belong to
`AlpinePeakStack`. Routine GitHub Actions deployments use `--exclusively` to deploy only the application stack. Automatic drift repair is disabled.

The database has `DeletionPolicy: Retain` and `UpdateReplacePolicy: Retain`.
These policies protect it from CloudFormation lifecycle removal or replacement;
they do not prevent deletion through the RDS service API. Credentials and secret
values remain external to this source.

## Drift repair

Routine application deployments apply template changes without automatic drift repair. Review and resolve out-of-band resource changes separately.

## Referenced, not created

CDK does not create or manage the shared ALB/VPC/subnets, route tables, MongoDB
Atlas, or secret values. Physical network IDs are not stored in source;
application stacks consume stable CloudFormation exports.
