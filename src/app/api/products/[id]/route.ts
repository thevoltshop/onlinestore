import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, slugify } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const slug = body.slug || slugify(body.name);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: body.price,
      stock: body.stock,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive,
      categoryId: body.categoryId || null,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
