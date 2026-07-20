import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ==========================
  // ROLE
  // ==========================
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Administrator",
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: "Cashier" },
    update: {},
    create: {
      name: "Cashier",
      description: "Kasir",
    },
  });

  // ==========================
  // PERMISSION
  // ==========================

  const permissions = [
    { module: "dashboard", action: "view" },

    { module: "product", action: "create" },
    { module: "product", action: "read" },
    { module: "product", action: "update" },
    { module: "product", action: "delete" },

    { module: "category", action: "create" },
    { module: "category", action: "read" },
    { module: "category", action: "update" },
    { module: "category", action: "delete" },

    { module: "transaction", action: "create" },
    { module: "transaction", action: "read" },
    { module: "transaction", action: "cancel" },

    { module: "cashier", action: "create" },
    { module: "cashier", action: "read" },
    { module: "cashier", action: "update" },
    { module: "cashier", action: "delete" },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        module_action: {
          module: permission.module,
          action: permission.action,
        },
      },
      update: {},
      create: permission,
    });
  }

  // ==========================
  // CATEGORY
  // ==========================

  const categories = [
    {
      name: "Makanan",
      icon: "🍔",
    },
    {
      name: "Minuman",
      icon: "🥤",
    },
    {
      name: "Snack",
      icon: "🍟",
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // ==========================
  // ADMIN
  // ==========================

  await prisma.cashier.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      password_hash: "$2b$10$replace_with_bcrypt_hash",
      email: "admin@pos.com",
      shift: "Pagi",
      position: "Owner",
      role_id: adminRole.id,
    },
  });

  console.log("✅ Database seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });