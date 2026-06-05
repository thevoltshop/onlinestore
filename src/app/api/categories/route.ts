import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, slugify } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug || slugify(body.name);

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description || null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
