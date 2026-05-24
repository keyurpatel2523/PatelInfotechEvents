import { Suspense } from "react";
import { LoginPage } from "@/components/auth/login-page";

export const metadata = {
  title: "Supplier Portal — Sign in | EventSphere",
};

export default function SupplierLoginPage() {
  return (
    <Suspense>
      <LoginPage variant="supplier" />
    </Suspense>
  );
}
