import * as React from "react";
import { AdminSidebar }         from "@/components/admin/admin-sidebar";
import { AdminHeader }          from "@/components/admin/admin-header";
import { AdminToastContainer }  from "@/components/admin/admin-toast-container";

export const metadata = {
  title: { template: "%s | Admin — EventSphere", default: "Admin Console" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <AdminToastContainer />
    </div>
  );
}
