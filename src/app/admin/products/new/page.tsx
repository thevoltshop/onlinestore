import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Новый товар</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
