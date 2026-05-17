
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  console.log({ productCount, categoryCount });
  const products = await prisma.product.findMany({ take: 5 });
  console.log('Sample products:', products);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
