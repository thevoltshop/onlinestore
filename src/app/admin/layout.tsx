import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 overflow-auto bg-background p-6">{children}</div>
    </div>
  );
}
