# Alpine Peak CDK

This CDK creates an isolated Alpine Peak **preview** ECS service:

```text
AlpinePeakPreviewStack
  → ECS Fargate service: alpine-peak-preview-cdk
  → target group: alpine-peak-preview-cdk
  → task definition using commit-SHA image tags
```

GitHub Actions builds and deploys the same immutable images to both the current
legacy service and this preview service:

```text
front-<commit-sha>
api-v1-<commit-sha>
api-v2-<commit-sha>
```

## What this CDK does not touch

It does not create or modify the shared ALB, listeners, DNS, certificates, VPC,
subnets, security groups, existing production target group, or other sites.

`alpine_peak_cdk/shared_stack_resources/` records those excluded shared
resources. It is documentation only and is not loaded by CDK.

## Current deployment behavior

- The legacy ECS service remains the public production service.
- GitHub Actions updates the legacy task definition with SHA-tagged images.
- GitHub Actions also deploys `AlpinePeakPreviewStack` after CDK bootstrap.
- The preview service has no public route until a separately approved ALB rule
  change sends traffic to its new target group.

## Local validation

```bash
cd cdk
uv sync --group dev
uv run pytest
# GitHub Actions installs the pinned CDK CLI, then runs:
cdk synth AlpinePeakPreviewStack
```

`cdk synth` is local only; it does not deploy or change AWS resources.
