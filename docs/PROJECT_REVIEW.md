# Project review

Reviewed on **7 October 2026** against main commit `eb98daf9c2c9c11aa080a919282b702a25ec3970`.

## Architecture and current deployment

This repository contains a Next.js 16.2 / React 19 storefront with Auth.js and direct Prisma access, plus a separate Express API with JWT authentication. Both services use the same PostgreSQL model. The storefront does not rely on Express for catalog queries or server actions.

GitHub confirmed the repository is public and the reviewed main commit had a successful Vercel deployment status. An unauthenticated request to `https://advikfurniture.vercel.app` returned HTTP 200 with the expected page title. Render configuration is present, but no backend deployment account or actual API hostname was available for live verification.

## Improvements included in this change

- Replace the empty root README and starter frontend README with branded, accurate documentation.
- Add service documentation, environment examples, contribution/security guidance, and a deployment runbook.
- Add issue forms, a pull request template, and CI for builds, types, shared database consistency, and API access tests.
- Protect API product writes with signed-token validation and a current database administrator-role check.
- Reject weak/missing API signing secrets instead of falling back to the publicly known string `secret`.
- Limit public product retrieval to published products in both services.
- Disable the authentication diagnostic page in production.
- Remove duplicate robots sources and generate the database-backed sitemap at request time.
- Add a frontend process-health endpoint and configure Render health checks.
- Make Render installs reproducible, collect required secrets with `sync: false`, and separate compilation from the backend installation hook.
- Remove a generated Prisma configuration file using APIs incompatible with the installed Prisma 5 toolchain; the schema remains the source of database URLs.
- Correct the nested Next.js ignore pattern and allow safe environment examples to be committed.

## Remaining production work

| Priority | Finding | Required work |
| --- | --- | --- |
| High | Checkout reports success after a timer and does not create orders | Implement authenticated order creation, server-calculated totals, stock checks, and durable status transitions |
| High | Card fields are a demo UI; no payment provider is connected | Replace direct card entry with a provider-hosted payment flow and verified webhooks before accepting payments |
| High | Login/register/reset paths have no application-level rate limits | Add abuse controls and validate input consistently |
| High | Seed scripts delete users, orders, and catalog data | Replace with explicit, guarded development fixtures; never execute them during production deployment |
| Medium | Password-reset mail has a development-log fallback and swallows provider errors | Fail safely in production and surface delivery failures without exposing reset links in production logs |
| Medium | Google config permits dangerous account linking | Review linking policy and provider email-verification guarantees |
| Medium | Newsletter submission only waits and displays success | Integrate a subscription store/provider and truthful success/error responses |
| Medium | Duplicated database schema/migrations can drift | CI now checks consistency; consider a shared database package in a future refactor |
| Medium | Full frontend lint reports 11 errors and 7 warnings | Refactor state synchronization/nested components, remove unsafe `any` types and unused bindings, remove an unnecessary `@ts-ignore` |
| Medium | Admin promotion/test-account scripts contain hardcoded targets/default passwords | Replace with reviewed, parameterized maintenance tools restricted to appropriate environments |
| Medium | API product writes accept request bodies without a dedicated validation schema | Validate writable fields, limits, prices, and product state transitions |
| Medium | Public API query pagination/price values have limited validation | Validate bounds and cap catalog response size |
| Low | A settings navigation item points to an unimplemented payments route | Implement the destination or remove the link |
| Low | No repository license is selected | Owner should choose reuse terms; no license was assumed |

The storefront's policy pages should be checked against actual order/payment functionality and business operations before commercial use.

## Validation scope

The frontend production build, including its TypeScript checks, passed locally. Backend compilation and six access regression tests passed. Tests cover anonymous/tampered/expired tokens, missing user IDs, demoted/deleted users, supported admin roles, database failure, and secret validation. They do not require or mutate a live database.

Full frontend lint was run and its existing findings are recorded above. Builds and TypeScript checks are verified as part of this change and the new CI workflow. Live database writes, payments, OAuth transactions, and provider account settings were not exercised by the review.

This is a focused engineering review, not a full security or commercial-readiness certification.
