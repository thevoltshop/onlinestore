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

  // Пропускаем если цены уже обновлены до реальных UZS
  const dashcam = await prisma.product.findUnique({ where: { slug: "dashcam-4k" } });
  if (dashcam && dashcam.price >= 100000) {
    console.log("Данные уже актуальны. Пропуск.");
    return;
  }

  // Сброс старых данных
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Категории
  const categoriesData = [
    { name: "Товары для машины", slug: "car-accessories", description: "Аксессуары и электроника для автомобиля" },
    { name: "Игровая периферия", slug: "gaming", description: "Наушники, мыши и клавиатуры для геймеров" },
    { name: "Электроника и гаджеты", slug: "electronics", description: "Смарт-устройства и гаджеты" },
    { name: "Аксессуары для телефона", slug: "phone-accessories", description: "Чехлы, стёкла и зарядки" },
    { name: "Одежда и обувь", slug: "clothing-shoes", description: "Стильная одежда и удобная обувь" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  const car = await prisma.category.findUnique({ where: { slug: "car-accessories" } });
  const gaming = await prisma.category.findUnique({ where: { slug: "gaming" } });
  const electronics = await prisma.category.findUnique({ where: { slug: "electronics" } });
  const phone = await prisma.category.findUnique({ where: { slug: "phone-accessories" } });
  const clothing = await prisma.category.findUnique({ where: { slug: "clothing-shoes" } });

  const products = [
    // Товары для машины
    {
      name: "Видеорегистратор 4K",
      slug: "dashcam-4k",
      description: "Запись в разрешении 4K UHD, ночное видение Sony STARVIS, угол обзора 170°, встроенный GPS-трекер, датчик удара G-Sensor. Петлевая запись на карту до 256 ГБ.",
      price: 650000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop",
      categoryId: car?.id,
    },
    {
      name: "Автомобильный пылесос 120W",
      slug: "car-vacuum",
      description: "Мощный пылесос 120W для салона автомобиля. Питание от прикуривателя 12V, шнур 4.5м, сменные насадки, HEPA-фильтр. Убирает шерсть животных и крошки.",
      price: 250000,
      stock: 35,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      categoryId: car?.id,
    },
    {
      name: "Ароматизатор-диффузор для авто",
      slug: "car-freshener",
      description: "Стильный диффузор с натуральными эфирными маслами. Крепится на дефлектор, устойчив к вибрации, не оставляет пятен. Аромат держится до 30 дней.",
      price: 55000,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop",
      categoryId: car?.id,
    },

    // Игровая периферия
    {
      name: "Игровые наушники 7.1 с микрофоном",
      slug: "gaming-headset",
      description: "Объёмный звук 7.1, шумоподавляющий съёмный микрофон, RGB-подсветка, мягкие амбушюры с памятью формы. Совместимы с PC, PS5, Xbox Series X, Nintendo Switch.",
      price: 850000,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop",
      categoryId: gaming?.id,
    },
    {
      name: "Игровая мышь 16000 DPI",
      slug: "gaming-mouse",
      description: "Оптический сенсор 16000 DPI, 8 программируемых кнопок, RGB-подсветка 16.8 млн цветов, плетёный провод 1.8м, вес 95г.",
      price: 420000,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
      categoryId: gaming?.id,
    },
    {
      name: "Механическая клавиатура RGB",
      slug: "gaming-keyboard",
      description: "Механические свитчи Blue, полноразмерная раскладка 104 клавиши, RGB-подсветка на каждую клавишу, алюминиевая панель, съёмный USB-C кабель.",
      price: 680000,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop",
      categoryId: gaming?.id,
    },

    // Электроника и гаджеты
    {
      name: "Наушники с шумоподавлением ANC",
      slug: "wireless-headphones-anc",
      description: "Активное шумоподавление -35 дБ, Bluetooth 5.3, до 40 часов работы, быстрая зарядка (10 мин = 3 ч), мультиточечное подключение к 2 устройствам.",
      price: 1200000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      categoryId: electronics?.id,
    },
    {
      name: "Смарт-часы Pro Max",
      slug: "smartwatch-pro",
      description: "AMOLED 1.4\", ЧСС + SpO2 + ЭКГ, встроенный GPS, 100+ режимов тренировок, водозащита IP68, до 14 дней без зарядки.",
      price: 1800000,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      categoryId: electronics?.id,
    },
    {
      name: "Bluetooth-колонка 20W",
      slug: "bluetooth-speaker",
      description: "Мощность 20W стерео, 360° звук с глубоким басом, IPX7 водозащита, 24 часа работы, встроенный микрофон, TWS-режим (2 колонки = один звук).",
      price: 490000,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
      categoryId: electronics?.id,
    },

    // Аксессуары для телефона
    {
      name: "Беспроводная зарядка 15W",
      slug: "wireless-charger-15w",
      description: "15W для Samsung, MagSafe 15W для iPhone, 10W для других Qi-устройств. Заряжает через чехол до 3мм, индикатор заряда, защита от перегрева.",
      price: 220000,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop",
      categoryId: phone?.id,
    },
    {
      name: "Защитное стекло 9H Anti-Spy",
      slug: "screen-protector-9h",
      description: "Твёрдость 9H, антишпионское покрытие (видно только смотрящему прямо), олеофобное покрытие, полный клей по краям, ультратонкое 0.26мм.",
      price: 45000,
      stock: 150,
      imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop",
      categoryId: phone?.id,
    },
    {
      name: "Чехол MagSafe Premium",
      slug: "silicone-case-magsafe",
      description: "Премиум жидкий силикон, встроенные магниты MagSafe 15W, защита камеры +1.5мм, бархатистое покрытие внутри. 12 цветов, iPhone 14/15/16.",
      price: 130000,
      stock: 80,
      imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop",
      categoryId: phone?.id,
    },

    // Одежда и обувь
    {
      name: "Кроссовки спортивные Airmax",
      slug: "sport-sneakers",
      description: "Дышащий сетчатый верх, амортизирующая подошва EVA с воздушными камерами, нескользящий протектор, рефлективные элементы безопасности. Размеры 36–46.",
      price: 980000,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      categoryId: clothing?.id,
    },
    {
      name: "Худи оверсайз Essentials",
      slug: "oversized-hoodie",
      description: "100% хлопок 350г/м², крой оверсайз, регулируемый капюшон на кулиске, карман-кенгуру, рибана на манжетах. Не садится после стирки. XS–XXL.",
      price: 450000,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
      categoryId: clothing?.id,
    },
    {
      name: "Джинсы Slim Fit Premium",
      slug: "slim-fit-jeans",
      description: "Стрейч-деним 98% хлопок 2% эластан, облегающий силуэт slim fit, 5 карманов, усиленные швы. Не вытягиваются при носке. Размеры 26–36.",
      price: 620000,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
      categoryId: clothing?.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ База данных заполнена новыми данными.");
  console.log(`   Категорий: ${categoriesData.length}`);
  console.log(`   Товаров: ${products.length}`);
  console.log(`   Админ: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
