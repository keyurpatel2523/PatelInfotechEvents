import { SupplierSidebar }      from "@/components/supplier/supplier-sidebar";
import { ToastContainer }        from "@/components/supplier/toast-container";
import { SupplierDataProvider }  from "@/components/supplier/supplier-data-provider";

export const metadata = {
  title: { template: "%s | Supplier Portal — EventSphere", default: "Supplier Portal" },
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupplierDataProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
        <SupplierSidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {children}
        </div>
        <ToastContainer />
      </div>
    </SupplierDataProvider>
  );
}
