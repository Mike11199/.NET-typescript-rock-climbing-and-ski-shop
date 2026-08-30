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

## Shared resources (imported, not created)

CDK does NOT create or manage:
- ALB (`consolidated-load-balancer`) and other sites' listener rules
- VPC, subnets, security groups, route tables
- Route 53 hosted zones / DNS records
- ACM certificates
- RDS PostgreSQL instance
- MongoDB Atlas connection
- Secrets Manager keys (JWT, OAuth, database credentials)

These are read-only imports in `alpine_peak_existing_resources.py`.