import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { productId, authorName, rating, text } = await request.json();

  if (!productId || !authorName?.trim() || !text?.trim() || !rating) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Оценка от 1 до 5" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      authorName: authorName.trim(),
      rating: Number(rating),
      text: text.trim(),
    },
  });

  return NextResponse.json(review, { status: 201 });
}
