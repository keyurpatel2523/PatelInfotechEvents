import { Suspense } from "react";
import { LoginPage } from "@/components/auth/login-page";

export const metadata = {
  title: "Admin Console — Sign in | EventSphere",
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginPage variant="admin" />
    </Suspense>
  );
}
