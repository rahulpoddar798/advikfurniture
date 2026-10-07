# Deployment guide

The public storefront is **[https://advikfurniture.vercel.app](https://advikfurniture.vercel.app)**. Use this URL in the README and repository Website field. A Vercel dashboard or deployment-detail URL is for operators, not visitors.

## 1. Prepare PostgreSQL

Use a dedicated database with backups. Configure a pooled `DATABASE_URL` for runtime requests and a direct `DIRECT_URL` for migrations if your provider requires this distinction. For an unpooled local database, both URLs can be identical.

From `frontend/`, with the intended database credentials configured:

```bash
npm ci
npm run prisma:migrate
```

This applies committed migrations; it does not seed products. For an existing database created outside migration history, inspect and baseline it before deployment. Do not use `migrate reset`, destructive seeds, or test-user utilities against production.

Both services have the same schema and migration history. Treat them as one database model and synchronize changes in both directories. The backend currently runs `migrate deploy` on startup too; Prisma records migrations already applied. Avoid concurrent schema changes from independently diverging deployments.

## 2. Configure Vercel

Use the existing `advikfurniture` project rather than creating a duplicate. For a fresh setup, import `rahulpoddar798/advikfurniture`.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | `frontend` |
| Production branch | `main` |
| Node version | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Framework default |

The build generates the Prisma client. It does not apply migrations; run the migration command against the correct database before releasing schema-dependent code. The storefront needs the database even when the separate API is not deployed.

### Environment variables

Add variables in the project's environment settings. Use isolated credentials and databases for previews. Never commit actual values.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL runtime connection |
| `DIRECT_URL` | PostgreSQL migration connection |
| `AUTH_SECRET` | Random authentication secret |
| `AUTH_URL` | `https://advikfurniture.vercel.app` for production |
| `NEXT_PUBLIC_APP_URL` | `https://advikfurniture.vercel.app` for production |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in credentials |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public Cloudinary cloud identifier |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Restricted unsigned upload preset |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Server-side image management credentials |
| `RESEND_API_KEY`, `EMAIL_FROM` | Password-reset email delivery; use a verified sender |
| `NEXT_PUBLIC_API_URL` | Optional separate API URL ending in `/api` |

Generate independent secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Configure Google OAuth's authorized redirect URI as `https://advikfurniture.vercel.app/api/auth/callback/google`, and the local URI as `http://localhost:3000/api/auth/callback/google` for development. Custom domains need matching OAuth URLs and canonical application URL settings. The current URL helper favors Vercel's production hostname when Vercel supplies it; review `frontend/lib/site.ts` before switching to a custom domain.

Redeploy after changing variables. Browser-exposed `NEXT_PUBLIC_*` values are embedded during builds; database credentials and secrets must never use that prefix.

## 3. Keep the visitor URL public

The existing storefront returned HTTP 200 to an unauthenticated request during the 7 October 2026 review. This verifies access at that time, not future availability.

1. Share the stable production domain, not a dashboard URL or a protected preview hostname.
2. In Vercel, inspect **Settings → Deployment Protection** if visitors encounter a Vercel login page. Configure protection so the production visitor domain is public; retain any preview protection you need. See [Vercel deployment protection](https://vercel.com/docs/deployment-protection).
3. Open the production domain in a private browser window without a Vercel session.
4. Confirm the homepage, collections, and a published product render successfully.
5. Confirm `/admin` still requires an administrator account. Public hosting must not remove application authorization.

The repository itself is already public. Repository visibility and website access are separate settings.

## 4. Optional: deploy the API to Render

Create or sync a Blueprint from `render.yaml` in the same repository. It defines a public Node web service with root directory `backend`, reproducible dependency installation, a production environment, and `/health` checks.

Provide `DATABASE_URL`, `DIRECT_URL`, and any additional `CORS_ORIGINS`. The Blueprint generates `JWT_SECRET` and sets `FRONTEND_URL` to the production storefront. For an existing service, ensure its signing secret has at least 32 characters before releasing this change; startup now rejects missing or weak secrets. Rotating it invalidates existing API tokens.

The build is `npm ci --include=dev && npm run build`; startup is `npm start`. Keep development dependencies available while building because TypeScript and Prisma CLI are needed. Verify the actual assigned Render URL in the dashboard rather than assuming a service name determines it.

After release, open `https://<assigned-render-host>/health` and `https://<assigned-render-host>/api/products`. Anonymous POST/PUT/DELETE product requests must return 401. Authorized administrators must log in to the Express API to obtain a bearer token; Auth.js cookies are not interchangeable.

See the [Render Blueprint specification](https://render.com/docs/blueprint-spec) for field definitions and current service options.

## 5. Verify and maintain

| Check | Expected result |
| --- | --- |
| Frontend `/api/health` | HTTP 200 and a process-health JSON response |
| Frontend `/` and `/collections` | Catalog pages render against the migrated database |
| Frontend `/robots.txt` | One generated robots file with the production sitemap URL |
| Frontend `/sitemap.xml` | Published product and category URLs |
| Frontend `/test-auth` | Unavailable in production |
| API `/health` | HTTP 200 and process-health JSON |
| Anonymous API product writes | HTTP 401 |
| Normal user API product writes | HTTP 403 |

Health endpoints report process health, not database readiness. Inspect runtime logs for database failures. Verify Google sign-in, password-reset delivery, and image operations only after configuring their providers.

Keep deployment and database backups. Reverting code does not undo migrations; plan compatible database rollbacks separately. Checkout and newsletter remain demos until their integrations are implemented.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Visitors see Vercel login | Shared hostname and production deployment protection |
| Homepage returns 500 | Database connectivity, direct/pooled URLs, migrations, runtime logs |
| Google callback fails | Provider credentials, callback URI, production URL |
| API refuses startup | `JWT_SECRET` length and database migration connectivity |
| Browser CORS error | Exact origin in `FRONTEND_URL` or comma-separated `CORS_ORIGINS` |
| Images upload but cannot be removed | Cloudinary server API credentials and upload preset restrictions |
| Reset email never arrives | Resend key, verified sender, provider errors |
| Demo checkout shows success without an order | Expected current limitation; implement persistent orders and payment integration |

## Repository About field

Suggested description: **Furniture storefront with Next.js, a 3D showroom, account management, and role-based catalog administration.**

Suggested Website: **https://advikfurniture.vercel.app**

Suggested topics: `nextjs`, `react`, `typescript`, `prisma`, `postgresql`, `furniture`, `threejs`, `tailwindcss`.

These metadata fields require a repository-administration interface; the connected GitHub tools used for this review do not expose a repository-metadata write operation.
