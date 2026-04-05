import { notFound }    from "next/navigation";
import type { Metadata } from "next";
import { Navbar }        from "@/components/layout/navbar";
import { MOCK_SERVICES } from "@/lib/mock-services";
import CheckoutFlow      from "./checkout-flow";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service  = MOCK_SERVICES.find((s) => s.slug === slug);
  return {
    title: service ? `Book — ${service.title}` : "Checkout",
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const service  = MOCK_SERVICES.find((s) => s.slug === slug);

  if (!service) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <CheckoutFlow service={service} />
    </div>
  );
}
