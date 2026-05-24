import { Suspense } from "react";
import { LoginPage } from "@/components/auth/login-page";

export const metadata = {
  title: "Sign in — EventSphere",
};

export default function CustomerLoginPage() {
  return (
    <Suspense>
      <LoginPage variant="customer" />
    </Suspense>
  );
}
