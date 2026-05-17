import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "test@example.com".toLowerCase();
  const user = await prisma.user.update({
    where: { email },
    data: { role: "SUPER_ADMIN" },
  });
  console.log("User promoted to SUPER_ADMIN:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
