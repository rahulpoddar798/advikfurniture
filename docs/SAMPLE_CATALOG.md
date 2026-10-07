# Add the sample furniture catalog

The curated catalog contains **60 complete sample products**, ten each for Sofas, Chairs, Tables, Beds, Dining and Living Room. Photos come from Unsplash; original photo links, contributor credits and the [Unsplash license](https://unsplash.com/license) are recorded in `frontend/data/sample-catalog.json`.

1. Sign in as a Super Admin, Staff Admin or Content Manager.
2. Open **Admin → Products → Add sample catalog (60 products)**.
3. Review the photos, example INR prices, descriptions, dimensions, materials, colors and SKUs.
4. Select **Add 60 sample products**. The result reports added and skipped products.
5. Open the public collection and check each category.
6. Before selling a sample item, replace its illustrative photo, verify its specifications and price, confirm care/assembly/delivery/warranty terms, and set actual inventory in the product editor. Remove the Sample label only after verification.

All imported products are published so visitors can browse them. Each name and description clearly identifies a sample listing; stock is zero so purchase buttons stay disabled. Six products are featured, one per category. No discounts, sales rankings or reviews are invented.

The import checks the current database role, uses the site's configured production database, requires the six existing categories and inserts in one transaction. Stable unique SKUs and slugs prevent duplicates on retries. It never deletes or overwrites products, including edits to previously imported samples. No public seed endpoint or database credentials are added.

To validate a catalog edit, run `node scripts/validate-sample-catalog.cjs` from `frontend`. The maintainer helper `node scripts/build-sample-catalog.cjs` rebuilds the manifest from the curated photo pool and its product specifications. Do not run the older destructive Prisma seed scripts on production.
