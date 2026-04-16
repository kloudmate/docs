---
title: On-premises configuration
description: Configure your KloudMate on-premises deployment including storage, networking, and authentication.
---

# On-premises configuration

## Overview

After installation, use the configuration options in this guide to adapt KloudMate to your infrastructure requirements.

## Configuration file

Configuration is managed through environment variables in the `.env` file (Docker Compose) or Helm values (`values.yaml`).

## Key configuration options

| Variable | Description | Default |
|---|---|---|
| `KLOUDMATE_LICENCE_KEY` | Enterprise licence key | Required |
| `KLOUDMATE_BASE_URL` | Public URL of your KloudMate instance | `http://localhost:3000` |
| `KLOUDMATE_STORAGE_TYPE` | Storage backend: `local` or `s3` | `local` |
| `KLOUDMATE_S3_BUCKET` | S3 bucket name (if `s3` storage) | — |
| `KLOUDMATE_SMTP_HOST` | SMTP host for email alerts | — |
| `KLOUDMATE_SSO_ENABLED` | Enable SAML/OIDC SSO | `false` |

## Enabling SSO

Set `KLOUDMATE_SSO_ENABLED=true` and provide your identity provider metadata URL:

```bash
KLOUDMATE_SSO_PROVIDER=oidc
KLOUDMATE_SSO_ISSUER=https://your-idp.example.com
KLOUDMATE_SSO_CLIENT_ID=<CLIENT_ID>
KLOUDMATE_SSO_CLIENT_SECRET=<CLIENT_SECRET>
```

## Using S3 for storage

```bash
KLOUDMATE_STORAGE_TYPE=s3
KLOUDMATE_S3_BUCKET=kloudmate-data
KLOUDMATE_S3_REGION=us-east-1
```

## Troubleshooting

After changing configuration, restart the services:

```bash
docker compose restart
```

## Related

- [On-premises installation](/on-prem/installation)
- [On-premises overview](/on-prem/overview)
