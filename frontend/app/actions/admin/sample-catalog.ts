'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import catalog from '@/data/sample-catalog.json';
import { Prisma, Role, ProductStatus } from '@prisma/client';

const adminRoles: Role[] = ['SUPER_ADMIN', 'STAFF_ADMIN', 'CONTENT_MANAGER'];

export async function importSampleCatalog() {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Sign in with an admin account to import products.' };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Recheck the persisted role on every invocation, including direct action requests.
      const user = await tx.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
      if (!user || !adminRoles.includes(user.role)) throw new Error('IMPORT_UNAUTHORIZED');

      const categories = await tx.category.findMany({ select: { id: true, name: true } });
      const categoryIds = new Map(categories.map((category) => [category.name, category.id]));
      if (catalog.some((product) => !categoryIds.has(product.categoryName))) {
        throw new Error('IMPORT_MISSING_CATEGORIES');
      }

      const data: Prisma.ProductCreateManyInput[] = catalog.map(({ categoryName, imageCredit, ...product }) => {
        // Credits stay in the manifest and product description; no extra database columns are needed.
        void imageCredit;
        return { ...product, status: ProductStatus.PUBLISHED, categoryId: categoryIds.get(categoryName)! };
      });
      // Unique SKU and slug constraints make retries safe, including simultaneous imports.
      // Existing products and edits to previously imported products are never overwritten.
      return tx.product.createMany({ data, skipDuplicates: true });
    }, { timeout: 15000 });

    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    return { created: result.count, skipped: catalog.length - result.count, total: catalog.length };
  } catch (error) {
    if (error instanceof Error && error.message === 'IMPORT_UNAUTHORIZED') {
      return { error: 'Your account does not have permission to import products.' };
    }
    if (error instanceof Error && error.message === 'IMPORT_MISSING_CATEGORIES') {
      return { error: 'Restore the Sofas, Chairs, Tables, Beds, Dining and Living Room categories before importing.' };
    }
    return { error: 'The import could not finish. Retry safely; existing products will be skipped.' };
  }
}
