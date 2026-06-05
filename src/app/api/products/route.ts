import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, slugify } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const activeOnly = searchParams.get("active") !== "false";

  const products = await prisma.product.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug || slugify(body.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Товар с таким slug уже существует" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: body.price,
      stock: body.stock,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      categoryId: body.categoryId || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
