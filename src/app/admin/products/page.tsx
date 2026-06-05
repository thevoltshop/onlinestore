import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Добавить товар
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="card w-full text-left text-sm">
          <thead className="border-b border-border bg-gray-50">
            <tr>
              <th className="p-4">Товар</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Остаток</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-gray-100">
                      {product.imageUrl && (
                        <Image src={product.imageUrl} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted">{product.category?.name || "—"}</td>
                <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={`badge ${
                      product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.isActive ? "Активен" : "Скрыт"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      Изменить
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="mt-4 text-muted">Товары не найдены. Добавьте первый товар.</p>
        )}
      </div>
    </div>
  );
}
