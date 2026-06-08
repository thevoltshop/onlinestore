import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Создаём/обновляем админа
  const email = process.env.ADMIN_EMAIL || "admin@store.local";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Администратор",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  // Навсегда скрываем старые сидовые товары
  const OLD_SLUGS = [
    "dashcam-4k", "car-vacuum", "car-freshener",
    "gaming-headset", "gaming-mouse", "gaming-keyboard",
    "wireless-headphones-anc", "smartwatch-pro", "bluetooth-speaker",
    "wireless-charger-15w", "screen-protector-9h", "silicone-case-magsafe",
    "sport-sneakers", "oversized-hoodie", "slim-fit-jeans",
  ];
  await prisma.product.updateMany({
    where: { slug: { in: OLD_SLUGS } },
    data: { isActive: false },
  });

  // Все остальные товары (добавленные через админку) — активны
  await prisma.product.updateMany({
    where: { slug: { notIn: OLD_SLUGS } },
    data: { isActive: true },
  });

  // Клавиатура Pastel 75%
  const gamingCat = await prisma.category.findUnique({ where: { slug: "gaming" } });
  if (gamingCat) {
    const mk87Colors = "Белый/Розовый|||https://i.postimg.cc/1n7XSRRF/Screenshot-20260608-034157-Alibabacom.jpg:::Чёрный/Оранжевый|||https://i.postimg.cc/HcvnmWWc/Screenshot-20260608-034148-Alibabacom.jpg";
    await prisma.product.upsert({
      where: { slug: "mk87-pastel" },
      update: {
        price: 350_000,
        name: "Механическая клавиатура Pastel 75% (83 клавиши)",
        imageUrl: "https://i.postimg.cc/4yvNQ5zx/Screenshot-20260608-041812-Alibabacom.jpg",
        colors: mk87Colors,
        isActive: true,
      },
      create: {
        name: "Механическая клавиатура Pastel 75% (83 клавиши)",
        slug: "mk87-pastel",
        description: "Механическая игровая клавиатура 75% формфактора, 83 клавиши, подключение Type-C. Пастельный дизайн — доступна в цветах: синий/розовый и чёрный/оранжевый. Светодиодная RGB-подсветка, эргономичный корпус, совместима с Windows и macOS.",
        price: 350_000,
        stock: 10,
        imageUrl: "https://i.postimg.cc/4yvNQ5zx/Screenshot-20260608-041812-Alibabacom.jpg",
        colors: mk87Colors,
        isActive: true,
        categoryId: gamingCat.id,
      },
    });
  }

  console.log("✅ Seed выполнен.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
