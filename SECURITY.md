# Security

Do not publish credentials, exploit details, or customer information in public issues. Contact the repository owner privately at **rahulpoddar798@gmail.com**, or use GitHub private vulnerability reporting if enabled. Include affected routes, impact, and safe reproduction steps.

Keep secrets in provider environment settings or ignored local `.env` files. Use separate, random `AUTH_SECRET` and `JWT_SECRET` values. Public access applies to the storefront; account data and administration must retain authentication.

Never run destructive seed scripts or test-account utilities against production. Review Cloudinary unsigned upload restrictions, database permissions, and authentication rate limits before operating a commercial service.

The [project review](docs/PROJECT_REVIEW.md) records remaining production gaps. This is not a completed security audit.
