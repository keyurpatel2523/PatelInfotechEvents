"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ServiceCardData } from "@/components/marketplace/service-card";
import type {
  BookingDetails,
  AddOnItem,
  PricingBreakdown,
  CheckoutPackage,
  BookingPayload,
  CreateBookingResponse,
  CreateIntentResponse,
} from "@/types/booking";

import { StepIndicator }      from "@/components/checkout/step-indicator";
import type { Step }           from "@/components/checkout/step-indicator";
import { BookingSummaryCard }  from "@/components/checkout/booking-summary-card";
import { BookingDetailsStep }  from "@/components/checkout/booking-details-step";
import { ReviewStep, DEFAULT_ADD_ONS } from "@/components/checkout/review-step";
import { PaymentForm }         from "@/components/checkout/payment-form";
import { ConfirmationStep }    from "@/components/checkout/confirmation-step";

/* ─── Helpers ────────────────────────────────────────────── */
const SERVICE_FEE_RATE = 0.12;

function buildPackages(price: number, priceUnit: string): CheckoutPackage[] {
  const u = priceUnit || "event";
  return [
    {
      id:          "standard",
      label:       "Standard",
      price:       Math.round(price * 0.8),
      unit:        u,
      description: "Core service, ideal for straightforward events",
      popular:     false,
    },
    {
      id:          "premium",
      label:       "Premium",
      price,
      unit:        u,
      description: "Enhanced experience with priority service & support",
      popular:     true,
    },
    {
      id:          "ultimate",
      label:       "Ultimate",
      price:       Math.round(price * 1.65),
      unit:        u,
      description: "All-inclusive luxury with bespoke customisation",
      popular:     false,
    },
  ];
}

function computePricing(
  pkgPrice:   number,
  guestCount: number,
  priceUnit:  string,
  addOns:     AddOnItem[],
): PricingBreakdown {
  const packageTotal =
    priceUnit === "per head" ? pkgPrice * guestCount : pkgPrice;
  const addOnsTotal   = addOns
    .filter((a) => a.selected)
    .reduce((s, a) => s + a.price, 0);
  const serviceFee    = Math.round((packageTotal + addOnsTotal) * SERVICE_FEE_RATE);
  return {
    packagePrice:   packageTotal,
    addOnsTotal,
    serviceFeeRate: SERVICE_FEE_RATE,
    serviceFee,
    total:          packageTotal + addOnsTotal + serviceFee,
  };
}

/* ─── Step transition variants ───────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stepVariants = {
  enter: (dir: number) => ({
    x:       dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x:       0,
    opacity: 1,
    transition: { duration: 0.32, ease: EASE },
  },
  exit: (dir: number) => ({
    x:       dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
};

/* ─── Props ──────────────────────────────────────────────── */
interface CheckoutFlowProps {
  service: ServiceCardData;
}

/* ─── Main component ─────────────────────────────────────── */
export default function CheckoutFlow({ service }: CheckoutFlowProps) {
  const packages = buildPackages(
    service.price,
    service.priceUnit ?? "event",
  );

  /* ── State ────────────────────────────────────────────── */
  const [step,      setStep]    = React.useState<Step>(1);
  const [direction, setDirection] = React.useState(1); // +1 forward / -1 backward

  const [details, setDetails] = React.useState<Partial<BookingDetails>>({
    guestCount:   50,
    packageId:    packages[1].id,
    packageLabel: packages[1].label,
    packagePrice: packages[1].price,
    notes:        "",
  });

  const [addOns,     setAddOns]     = React.useState<AddOnItem[]>(DEFAULT_ADD_ONS);
  const [bookingId,  setBookingId]  = React.useState<string | null>(null);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isDemo,     setIsDemo]     = React.useState(false);
  const [apiLoading, setApiLoading] = React.useState(false);
  const [errors,     setErrors]     = React.useState<Record<string, string>>({});

  /* ── Derived pricing ──────────────────────────────────── */
  const pricing = React.useMemo<PricingBreakdown>(() => {
    const pkg = packages.find((p) => p.id === details.packageId) ?? packages[1];
    return computePricing(
      details.packagePrice ?? pkg.price,
      details.guestCount   ?? 50,
      service.priceUnit    ?? "event",
      addOns,
    );
  }, [details.packageId, details.packagePrice, details.guestCount, addOns, packages, service.priceUnit]);

  /* ── Navigation helpers ───────────────────────────────── */
  function goTo(next: Step) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!details.date)     errs.date     = "Please select a date";
    if (!details.timeSlot) errs.timeSlot = "Please select a time";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Step 2 → 3: create booking + payment intent ──────── */
  async function handleConfirmAndPay() {
    setApiLoading(true);

    try {
      const payload: BookingPayload = {
        serviceId:    service.id,
        serviceSlug:  service.slug,
        serviceTitle: service.title,
        serviceImage: service.image,
        supplierId:   service.supplier.name.toLowerCase().replace(/\s+/g, "-"),
        supplierName: service.supplier.name,
        customerId:   "guest", // replace with auth user ID in production
        details: {
          date:         details.date!,
          timeSlot:     details.timeSlot!,
          guestCount:   details.guestCount!,
          packageId:    details.packageId!,
          packageLabel: details.packageLabel!,
          packagePrice: pricing.packagePrice,
          addOns,
          notes:        details.notes ?? "",
        },
        pricing,
      };

      /* 1. Create booking */
      const bookingRes = await fetch("/api/bookings/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!bookingRes.ok) throw new Error("Failed to create booking");
      const { bookingId: newBookingId } =
        (await bookingRes.json()) as CreateBookingResponse;
      setBookingId(newBookingId);

      /* 2. Create payment intent */
      const intentRes = await fetch("/api/payments/create-intent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          bookingId: newBookingId,
          amount:    pricing.total,
          currency:  "gbp",
        }),
      });
      if (!intentRes.ok) throw new Error("Failed to create payment intent");
      const { clientSecret: secret, demo } =
        (await intentRes.json()) as CreateIntentResponse;

      setClientSecret(secret);
      setIsDemo(!!demo);
      goTo(3);
    } catch (err) {
      console.error("[CheckoutFlow] confirm-and-pay error:", err);
    } finally {
      setApiLoading(false);
    }
  }

  /* ── Patch helpers ────────────────────────────────────── */
  function patchDetails(patch: Partial<BookingDetails>) {
    setDetails((prev) => ({ ...prev, ...patch }));
    if (Object.keys(patch).some((k) => k in errors)) {
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(patch).forEach((k) => delete next[k]);
        return next;
      });
    }
  }

  function toggleAddOn(id: string) {
    setAddOns((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)),
    );
  }

  /* ── Confirmation state ───────────────────────────────── */
  const confirmedBookingId = bookingId ?? `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  /* ── Step 4 is full-width ─────────────────────────────── */
  if (step === 4) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Top bar */}
        <div className="border-b border-[--border]">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-5">
            <StepIndicator current={4} />
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ConfirmationStep
                service={service}
                details={details as BookingDetails}
                pricing={pricing}
                bookingId={confirmedBookingId}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ── Steps 1-3: two-column layout ────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Top bar (step indicator) ─────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-[--border] bg-[--bg]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Left: step content ────────────────────────── */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Step heading */}
            <div className="mb-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${step}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1,  y: 0 }}
                  exit={{   opacity: 0,  y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#6366f1] mb-1">
                    Step {step} of 3
                  </p>
                  <h1 className="text-2xl font-bold text-[--text-1]">
                    {step === 1 && "Booking details"}
                    {step === 2 && "Review your order"}
                    {step === 3 && "Payment"}
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated step body */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`step-${step}`}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {step === 1 && (
                  <BookingDetailsStep
                    packages={packages}
                    priceUnit={service.priceUnit ?? "event"}
                    details={details}
                    onChange={patchDetails}
                    errors={errors}
                    onNext={() => {
                      if (validateStep1()) goTo(2);
                    }}
                  />
                )}

                {step === 2 && (
                  <ReviewStep
                    details={details as BookingDetails}
                    addOns={addOns}
                    pricing={pricing}
                    onAddOnToggle={toggleAddOn}
                    onBack={() => goTo(1)}
                    onNext={handleConfirmAndPay}
                    loading={apiLoading}
                  />
                )}

                {step === 3 && (
                  <PaymentForm
                    clientSecret={clientSecret}
                    total={pricing.total}
                    isDemo={isDemo}
                    onSuccess={() => goTo(4)}
                    onBack={() => goTo(2)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: sticky summary card ────────────────── */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 lg:sticky lg:top-[88px]">
            {/* Mobile: show compact at top, full on desktop */}
            <BookingSummaryCard
              service={service}
              details={details}
              pricing={step >= 2 ? pricing : null}
              step={step}
            />

            {/* Booking reference (once created) */}
            {bookingId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-between rounded-xl border border-[--border] bg-[--bg-subtle] px-4 py-2.5"
              >
                <span className="text-xs text-[--text-3]">Booking ref</span>
                <span className="text-xs font-bold text-[--text-1] font-mono">
                  {bookingId}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
