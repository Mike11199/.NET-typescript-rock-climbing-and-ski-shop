# Shared resources — excluded from this CDK

This folder documents AWS resources that the Alpine Peak CDK must not create,
modify, import, or deploy.

```text
consolidated-load-balancer
ALB listeners and host-header rules
shared VPC, subnets, routes, and security groups
Route 53 hosted zones/records
ACM certificates and validation records
other sites' target groups and routing
```

These resources affect multiple websites. A separate shared-infrastructure CDK
project can manage them only after a dedicated inventory and migration plan.

This folder contains documentation only. `app.py` does not load it.

## Current shared edge

```text
ALB: consolidated-load-balancer
VPC: vpc-031a34e2307900372
Current Alpine target group: react-ski-shop-2
Alpine host: alpine-peak-climbing-ski-gear.com
Other routed hosts:
  - michael-iwanek-portfolio.com
  - machine-learning-projects.com
```
