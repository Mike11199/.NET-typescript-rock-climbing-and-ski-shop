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
  → retained RDS security group
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
  resources, service security group, and RDS security group.
- The service security group accepts port 80 only from the shared ALB security
  group. The RDS security group accepts PostgreSQL port 5432 only from the
  application service security group.
- Runtime resource names remain stable, while account- and region-dependent
  references are built from CloudFormation pseudo parameters.

## Existing account

- The existing ECR repository, listener rule, and target group were retained and imported without changing physical IDs.
- Shared identifiers now come from CloudFormation exports.
- Drift detection reports `IN_SYNC`; the final CDK diff is empty; target health and HTTPS are healthy.
- The RDS security-group attachment remains the manual step below.

## RDS security-group manual cutover

`AlpinePeakStack` exports the retained database security-group ID as
`AlpinePeakRdsSecurityGroupId`. CDK does **not** modify or replace the existing
RDS instance.

After deploying and verifying `AlpinePeakStack`:

1. Read the `AlpinePeakRdsSecurityGroupId` stack output.
2. Manually attach that group to the current RDS instance (or to the RDS instance
   created in a fresh environment) while keeping the current group attached.
3. Verify the Alpine Peak ECS task can connect to PostgreSQL through port 5432.
4. Only after successful verification, manually detach the old broad database
   security group. Reattach it immediately if connectivity fails.

This attachment and cutover are deliberate operator actions; they are not
performed by this stack or by the disabled workflow.

## Drift repair

The application deployment uses `cdk deploy --revert-drift` so supported
application resources are reconciled with the template. Shared resources and the
manually managed RDS instance remain outside that repair boundary.

## Referenced, not created

CDK does not create or manage the shared ALB/VPC/subnets, route tables, the RDS
PostgreSQL instance, MongoDB Atlas, or secret values. Physical network IDs are
not stored in source; application stacks consume stable CloudFormation exports.
