import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, slugify } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
