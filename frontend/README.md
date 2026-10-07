# Advik Furniture frontend

Next.js 16.2, React 19, TypeScript, Tailwind CSS 4, Auth.js, and Prisma/PostgreSQL.

- [Public storefront](https://advikfurniture.vercel.app)
- [Setup and architecture](../README.md)
- [Deployment guide](../docs/DEPLOYMENT.md)
- [Project review](../docs/PROJECT_REVIEW.md)

Install with `npm ci`. Copy `.env.example` to `.env`, configure database URLs and `AUTH_SECRET`, then run:

```bash
npm exec prisma generate
npm run prisma:migrate
npm run dev
```

Open [localhost:3000](http://localhost:3000).

Verify with `npm run typecheck`, `npm run lint`, and `npm run build`. The build generates Prisma's client. Database-backed pages need a reachable, migrated database at runtime. Existing full-lint findings are documented in the review.

The app uses Prisma directly; the Express API is optional. Checkout and newsletter forms currently demonstrate UI behavior without performing commerce or subscription operations.
