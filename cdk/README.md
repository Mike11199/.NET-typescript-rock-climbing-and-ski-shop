# Alpine Peak CDK

Deployed via GitHub Actions only — no local CDK commands required.

```text
AlpinePeakStack
  → ECS cluster: alpine-peak-ski-shop (CDK-managed)
  → Fargate service: alpine-peak-ski-shop
  → target group: alpine-peak-production-cdk-tg
  → task definition family: alpine-peak-ski-shop
```

Three containers in one task, routed through Nginx sidecar:
```text
front-end              :80   → React SPA
back-end-express-socket-io-api :5000 → Express/Socket.io API
back-end-dotnet-api    :5001 → .NET 9 API
```

## Application-owned imported resources

The stack owns these existing production resources after a one-time CloudFormation import:
- Route 53 hosted zone
- Root-domain alias record to the shared ALB
- Certificate-validation CNAME record
- ACM certificate

The shared infrastructure stack owns the ALB and HTTPS listener. It references the Alpine Peak certificate ARN as the listener's default certificate.

## HTTPS certificate ownership

- `AlpinePeakStack` owns the ACM certificate and its Route 53 validation record.
- `SharedInfrastructureStack` owns the HTTPS listener and its default-certificate attachment.
- The shared listener uses the Alpine Peak certificate ARN, so the attachment is managed and is not orphaned.
- The stacks intentionally use a literal ARN instead of a CloudFormation cross-stack reference. A formal reference would create a dependency cycle because Alpine Peak also depends on the shared listener for its routing rule.
- A future from-scratch redesign can remove that bootstrap coupling by separating domain/certificate resources into a domain stack, then deploying shared listeners, then deploying application routing.
- The listener currently has a redundant non-default association for the same Alpine Peak certificate. It is not needed for traffic and is not managed by either stack. Do not remove it as part of a normal application deployment; review it as a separate shared-listener cleanup.

## Shared resources (referenced, not created)

CDK does NOT create or manage:
- ALB (`consolidated-load-balancer`) and other sites' listener rules
- VPC, subnets, security groups, route tables
- RDS PostgreSQL instance
- MongoDB Atlas connection
- Secrets Manager keys (JWT, OAuth, database credentials)

These identifiers are kept in `alpine_peak_existing_resources.py`.