"use client";

/**
 * Payment form with Stripe Elements (PaymentElement).
 *
 * In production: requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var.
 * In demo mode (key not set): shows a simulated card UI that auto-succeeds.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Lock, ShieldCheck, CreditCard, ChevronLeft, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constants";

/* ── Load Stripe once at module level (null in demo mode) ── */
const stripePromise =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

const STRIPE_APPEARANCE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary:         "#6366f1",
    colorBackground:      "#ffffff",
    colorText:            "#18181b",
    colorDanger:          "#ef4444",
    fontFamily:           "ui-sans-serif, system-ui, sans-serif",
    borderRadius:         "12px",
    spacingUnit:          "4px",
  },
};

/* ─── Props ──────────────────────────────────────────────── */
interface PaymentFormProps {
  clientSecret:  string | null;
  total:         number;
  isDemo:        boolean;
  onSuccess:     () => void;
  onBack:        () => void;
}

/* ─── Inner form (inside Elements provider) ──────────────── */
function StripePaymentFormInner({
  total,
  onSuccess,
  onBack,
}: {
  total:     number;
  onSuccess: () => void;
  onBack:    () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = React.useState(false);
  const [error, setError]           = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== "undefined" ? window.location.href : "",
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    } else {
      setError("Unexpected payment status. Please contact support.");
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1,  y: 0 }}
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950"
        >
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </motion.div>
      )}

      <PaymentCTA
        total={total}
        processing={processing}
        disabled={!stripe || !elements || processing}
        onBack={onBack}
      />
    </form>
  );
}

/* ─── Demo payment form (no Stripe configured) ───────────── */
function DemoPaymentForm({
  total,
  onSuccess,
  onBack,
}: {
  total:     number;
  onSuccess: () => void;
  onBack:    () => void;
}) {
  const [processing, setProcessing] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    /* Simulate network delay */
    await new Promise((r) => setTimeout(r, 1800));
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Demo notice */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950">
        <CreditCard className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <span className="font-semibold">Demo mode</span> — No real payment will be processed.
          Add <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable Stripe.
        </p>
      </div>

      {/* Mock card fields */}
      <div className="space-y-3">
        <div className="rounded-xl border border-[--border] bg-[--bg] p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-[--text-3] uppercase tracking-wider">
              Card number
            </label>
            <div className="mt-1.5 h-10 rounded-lg border border-[--border] bg-[--bg-muted] flex items-center px-3">
              <span className="text-sm text-[--text-4]">4242 4242 4242 4242</span>
              <CreditCard className="ml-auto h-4 w-4 text-[--text-4]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[--text-3] uppercase tracking-wider">
                Expiry
              </label>
              <div className="mt-1.5 h-10 rounded-lg border border-[--border] bg-[--bg-muted] flex items-center px-3">
                <span className="text-sm text-[--text-4]">12 / 28</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[--text-3] uppercase tracking-wider">
                CVC
              </label>
              <div className="mt-1.5 h-10 rounded-lg border border-[--border] bg-[--bg-muted] flex items-center px-3">
                <span className="text-sm text-[--text-4]">•••</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentCTA
        total={total}
        processing={processing}
        disabled={processing}
        onBack={onBack}
      />
    </form>
  );
}

/* ─── Shared CTA ─────────────────────────────────────────── */
function PaymentCTA({
  total,
  processing,
  disabled,
  onBack,
}: {
  total:      number;
  processing: boolean;
  disabled:   boolean;
  onBack:     () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl border border-[--border] px-5 py-4",
            "text-sm font-semibold text-[--text-2] hover:border-[--text-3] hover:text-[--text-1]",
            "transition-all duration-150 disabled:opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <motion.button
          type="submit"
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled  ? { scale: 0.98 } : {}}
          disabled={disabled}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white",
            "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
            "shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-150",
            "hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
          )}
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing payment…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay {formatCurrency(total)}
            </>
          )}
        </motion.button>
      </div>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-4 pt-1">
        {[
          { icon: <ShieldCheck className="h-3.5 w-3.5 text-green-500" />, label: "SSL encrypted" },
          { icon: <Lock className="h-3.5 w-3.5 text-green-500" />,       label: "Secure checkout" },
          { icon: <CreditCard className="h-3.5 w-3.5 text-green-500" />, label: "Stripe payments" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1">
            {icon}
            <span className="text-[10px] text-[--text-4]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton while loading ─────────────────────────────── */
function PaymentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 rounded-xl bg-[--bg-muted]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 rounded-xl bg-[--bg-muted]" />
        <div className="h-10 rounded-xl bg-[--bg-muted]" />
      </div>
      <div className="h-12 rounded-2xl bg-[--bg-muted]" />
    </div>
  );
}

/* ─── Public component ───────────────────────────────────── */
export function PaymentForm({
  clientSecret,
  total,
  isDemo,
  onSuccess,
  onBack,
}: PaymentFormProps) {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[#eef2ff] flex items-center justify-center">
          <Lock className="h-5 w-5 text-[#6366f1]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[--text-1]">Secure payment</h2>
          <p className="text-xs text-[--text-3]">Your card details are encrypted end-to-end</p>
        </div>
      </div>

      {/* Amount display */}
      <div className="rounded-2xl border border-[--border] bg-[--bg-subtle] p-4 flex items-center justify-between">
        <span className="text-sm text-[--text-2]">Amount due today</span>
        <span className="text-xl font-bold text-[--text-1] tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Payment input */}
      {isDemo ? (
        <DemoPaymentForm total={total} onSuccess={onSuccess} onBack={onBack} />
      ) : !clientSecret ? (
        <PaymentSkeleton />
      ) : !stripePromise ? (
        <DemoPaymentForm total={total} onSuccess={onSuccess} onBack={onBack} />
      ) : (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
        >
          <StripePaymentFormInner
            total={total}
            onSuccess={onSuccess}
            onBack={onBack}
          />
        </Elements>
      )}
    </div>
  );
}
