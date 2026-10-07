# Contributing

Read the [setup guide](README.md#local-setup) and [project review](docs/PROJECT_REVIEW.md). Use an isolated development database. Never commit credentials or customer data.

1. Create a focused branch from `main`.
2. Keep changes related to one problem and preserve design conventions.
3. For database changes, keep both Prisma schemas and migration directories identical. Generate migrations with `prisma migrate dev` against a development database; apply committed migrations with `prisma migrate deploy`.
4. Update documentation when configuration changes.
5. Include relevant validation results in a pull request.

From `frontend/`, run `npm exec prisma generate`, `npm run typecheck`, `npm run lint`, and `npm run build`. Full lint has existing findings; explain findings that predate your change and fix findings introduced by changed code.

From `backend/`, run `npm run typecheck` and `npm test`.

For UI changes, check desktop/mobile, both themes, keyboard navigation, and loading/error states. Include screenshots when useful.

Open pull requests against `main` using the template and check CI before merging. After deployment, verify the public storefront without a signed-in session and confirm protected routes require the correct role.
