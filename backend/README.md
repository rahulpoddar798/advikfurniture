# Advik Furniture API

Express, TypeScript, Prisma/PostgreSQL, and JWT authentication. See the [root README](../README.md) and [deployment guide](../docs/DEPLOYMENT.md).

| Method | Route | Access |
| --- | --- | --- |
| GET | `/health` | Public process health |
| POST | `/api/auth/register` | Public registration |
| POST | `/api/auth/login` | Public login; returns an API bearer token |
| GET | `/api/products` | Public published catalog |
| GET | `/api/products/categories` | Public categories |
| GET | `/api/products/:id` | Public published product |
| POST | `/api/products` | Current administrator |
| PUT | `/api/products/:id` | Current administrator |
| DELETE | `/api/products/:id` | Current administrator |

Write requests need `Authorization: Bearer <token>` from this API's login response. Auth.js cookies do not authenticate Express requests. Access checks verify signatures and the user's current database role.

`/health` confirms the process responds; it does not verify database readiness.

Install with `npm ci`, copy `.env.example` to `.env`, and configure database URLs and a `JWT_SECRET` of at least 32 characters.

Run `npm run dev` for development. Verify with `npm run typecheck` and `npm test`. Production uses `npm run build` then `npm start`; startup applies committed migrations.
