import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUser() {
  const email = "rahulpoddar798@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log(`User found: ${user.email}, Role: ${user.role}`);
    
    if (user.role === "USER") {
      console.log("Promoting user to SUPER_ADMIN...");
      await prisma.user.update({
        where: { email },
        data: { role: "SUPER_ADMIN" },
      });
      console.log("User promoted successfully.");
    }
  } else {
    console.log(`User not found: ${email}`);
  }

  await prisma.$disconnect();
}

checkUser();
