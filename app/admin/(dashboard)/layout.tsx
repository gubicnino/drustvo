import { verifySession } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <AdminSidebar username={session.username} />
      <div className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
