import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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

  const categories = [
    { name: "Электроника", slug: "electronics", description: "Гаджеты и техника" },
    { name: "Одежда", slug: "clothing", description: "Модная одежда" },
    { name: "Дом и сад", slug: "home-garden", description: "Товары для дома" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const electronics = await prisma.category.findUnique({ where: { slug: "electronics" } });
  const clothing = await prisma.category.findUnique({ where: { slug: "clothing" } });
  const home = await prisma.category.findUnique({ where: { slug: "home-garden" } });

  const products = [
    {
      name: "Беспроводные наушники",
      slug: "wireless-headphones",
      description: "Качественный звук, шумоподавление, до 30 часов работы.",
      price: 4990,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      categoryId: electronics?.id,
    },
    {
      name: "Смарт-часы",
      slug: "smart-watch",
      description: "Мониторинг здоровья, уведомления, водонепроницаемость.",
      price: 8990,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      categoryId: electronics?.id,
    },
    {
      name: "Хлопковая футболка",
      slug: "cotton-tshirt",
      description: "100% хлопок, удобная посадка, несколько цветов.",
      price: 1290,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      categoryId: clothing?.id,
    },
    {
      name: "Джинсы классические",
      slug: "classic-jeans",
      description: "Плотный деним, классический крой.",
      price: 3490,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
      categoryId: clothing?.id,
    },
    {
      name: "Настольная лампа",
      slug: "desk-lamp",
      description: "LED-подсветка, регулировка яркости.",
      price: 2190,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
      categoryId: home?.id,
    },
    {
      name: "Керамическая кружка",
      slug: "ceramic-mug",
      description: "Объём 350 мл, подходит для посудомойки.",
      price: 590,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
      categoryId: home?.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("База данных заполнена демо-данными.");
  console.log(`Админ: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
