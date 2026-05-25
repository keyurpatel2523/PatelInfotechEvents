"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ChevronRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth/client";
import { setSessionCookie, ROLE_HOME } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth";
import { useDashboardStore } from "@/store/dashboard";
import { DEMO_CREDENTIALS } from "@/lib/auth/demo-users";
import type { UserRole } from "@/types/auth";

/* ── Variant config ───────────────────────────────────────── */

type Variant = "customer" | "supplier" | "admin";

const VARIANT_CONFIG = {
  customer: {
    title:       "Welcome back",
    subtitle:    "Sign in to your EventSphere account",
    btnLabel:    "Sign in",
    leftBg:      "from-violet-600 via-indigo-600 to-purple-700",
    headline:    "Your London event journey starts here",
    tagline:     "Find, book and experience the best events across London.",
    demoRoles:   ["customer"] as UserRole[],
    links: [
      { label: "Forgot password?", href: "#", align: "right" as const },
      { label: "Don't have an account? Sign up", href: "#", align: "center" as const },
      { label: "Are you a supplier?", href: "/login/supplier", cta: "Supplier login →", align: "center" as const },
    ],
    stats: [
      { value: "50K+",  label: "Attendees" },
      { value: "1,200+",label: "Vendors"   },
      { value: "4.9★",  label: "Rating"    },
    ],
    features: [
      "Discover events across London",
      "Instant, secure booking",
      "Real-time availability",
    ],
  },
  supplier: {
    title:       "Supplier Portal",
    subtitle:    "Sign in to manage your services & bookings",
    btnLabel:    "Sign in to Portal",
    leftBg:      "from-emerald-600 via-teal-600 to-green-700",
    headline:    "Grow your event business",
    tagline:     "Join London's #1 event marketplace and reach thousands of customers.",
    demoRoles:   ["supplier"] as UserRole[],
    links: [
      { label: "Forgot password?", href: "#", align: "right" as const },
      { label: "New supplier? Apply to join →", href: "#", align: "center" as const },
      { label: "Back to customer login", href: "/login", align: "center" as const },
    ],
    stats: [
      { value: "1,200+", label: "Suppliers"  },
      { value: "£2.4M",  label: "Paid out"   },
      { value: "98%",    label: "Satisfaction"},
    ],
    features: [
      "Accept bookings instantly",
      "Real-time earnings tracking",
      "Build your reputation with reviews",
    ],
  },
  admin: {
    title:       "Admin Console",
    subtitle:    "Secure access for platform administrators",
    btnLabel:    "Sign in Securely",
    leftBg:      "from-slate-800 via-slate-900 to-gray-900",
    headline:    "Platform Administration",
    tagline:     "Manage suppliers, customers, bookings and platform settings.",
    demoRoles:   ["admin"] as UserRole[],
    links: [
      { label: "Forgot password?", href: "#", align: "right" as const },
      { label: "← Back to main login",  href: "/login", align: "center" as const },
    ],
    stats: [
      { value: "£2.4M", label: "Revenue"   },
      { value: "50K+",  label: "Attendees" },
      { value: "99.9%", label: "Uptime"    },
    ],
    features: [
      "Full platform visibility",
      "Supplier approval & management",
      "Enterprise-grade security",
    ],
  },
} as const;

/* ── Props ────────────────────────────────────────────────── */

interface LoginPageProps {
  variant: Variant;
}

/* ── Main component ───────────────────────────────────────── */

export function LoginPage({ variant }: LoginPageProps) {
  const config      = VARIANT_CONFIG[variant];
  const router      = useRouter();
  const searchParams = useSearchParams();
  const setUser     = useAuthStore((s) => s.setUser);
  const setRole     = useDashboardStore((s) => s.setRole);

  const [email,    setEmail]    = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw,   setShowPw]   = React.useState(false);
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState("");
  const [shake,    setShake]    = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { triggerError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const user = await signIn(email.trim(), password);
      setSessionCookie(user.uid, user.role);
      setUser(user);
      setRole(user.role as Parameters<typeof setRole>[0]);
      const redirect = searchParams.get("redirect") ?? ROLE_HOME[user.role];
      router.push(redirect);
    } catch (err) {
      triggerError((err as Error).message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const fillDemo = (role: UserRole) => {
    const creds = DEMO_CREDENTIALS[role as keyof typeof DEMO_CREDENTIALS];
    if (creds) { setEmail(creds.email); setPassword(creds.password); }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Left hero panel ─────────────────────────────────── */}
      <div
        className={cn(
          "hidden lg:flex lg:w-[55%] xl:w-[60%]",
          "flex-col justify-between p-10 xl:p-14",
          "bg-gradient-to-br",
          config.leftBg,
          "text-white relative overflow-hidden",
        )}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x:       [0, 30, 0],
                y:       [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat:   Infinity,
                delay:    i * 1.2,
              }}
              style={{
                position: "absolute",
                width:    200 + i * 60,
                height:   200 + i * 60,
                borderRadius: "50%",
                background:   "rgba(255,255,255,0.15)",
                left:   `${10 + i * 15}%`,
                top:    `${-10 + i * 20}%`,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-black">E</span>
            </div>
            <span className="text-lg font-bold tracking-tight">EventSphere</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl xl:text-4xl font-bold leading-tight mb-3"
            >
              {config.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base xl:text-lg text-white/75 leading-relaxed max-w-sm"
            >
              {config.tagline}
            </motion.p>
          </div>

          {/* Features */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {config.features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3 text-sm xl:text-base text-white/90"
              >
                <span className="flex-none flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold">
                  ✓
                </span>
                {f}
              </motion.li>
            ))}
          </motion.ul>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="grid grid-cols-3 gap-4"
          >
            {config.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center"
              >
                <div className="text-lg xl:text-xl font-bold">{s.value}</div>
                <div className="text-xs text-white/65 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} EventSphere · London, UK
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 bg-[--bg]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className={cn(
                "h-8 w-8 rounded-xl bg-gradient-to-br flex items-center justify-center",
                config.leftBg,
              )}
            >
              <span className="text-sm font-black text-white">E</span>
            </div>
            <span className="text-base font-bold text-[--text-1]">EventSphere</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-[--text-1] tracking-tight">
              {config.title}
            </h2>
            <p className="text-sm text-[--text-3] mt-1">{config.subtitle}</p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[--text-2] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.co.uk"
                autoComplete="email"
                required
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl text-sm",
                  "bg-[--bg-muted] border border-[--border]",
                  "text-[--text-1] placeholder:text-[--text-4]",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
                  "transition-all duration-150",
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[--text-2] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={cn(
                    "w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm",
                    "bg-[--bg-muted] border border-[--border]",
                    "text-[--text-1] placeholder:text-[--text-4]",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
                    "transition-all duration-150",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-4] hover:text-[--text-2] transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="#" className="text-xs text-brand-500 hover:text-brand-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2.5 px-4 rounded-xl text-sm font-semibold text-white",
                "bg-gradient-to-r from-brand-600 to-brand-500",
                "hover:opacity-90 active:scale-[0.98]",
                "transition-all duration-150 shadow-sm",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {config.btnLabel}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>

          {/* Role-specific extra links */}
          <div className="mt-5 space-y-2 text-center">
            {variant === "customer" && (
              <>
                <p className="text-xs text-[--text-3]">
                  Don&apos;t have an account?{" "}
                  <Link href="#" className="text-brand-500 hover:text-brand-600 font-medium">
                    Sign up free
                  </Link>
                </p>
                <p className="text-xs text-[--text-4]">
                  Are you a supplier?{" "}
                  <Link href="/login/supplier" className="text-[--text-2] hover:text-[--text-1] font-medium">
                    Supplier login →
                  </Link>
                </p>
              </>
            )}
            {variant === "supplier" && (
              <>
                <p className="text-xs text-[--text-3]">
                  New supplier?{" "}
                  <Link href="#" className="text-brand-500 hover:text-brand-600 font-medium">
                    Apply to join →
                  </Link>
                </p>
                <p className="text-xs text-[--text-4]">
                  <Link href="/login" className="text-[--text-2] hover:text-[--text-1]">
                    ← Back to customer login
                  </Link>
                </p>
              </>
            )}
            {variant === "admin" && (
              <p className="text-xs text-[--text-4]">
                <Link href="/login" className="text-[--text-2] hover:text-[--text-1]">
                  ← Back to main login
                </Link>
              </p>
            )}
          </div>

          {/* Demo credentials */}
          <DemoCredentialsCard roles={config.demoRoles} onFill={fillDemo} />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Demo credentials card ────────────────────────────────── */

function DemoCredentialsCard({
  roles,
  onFill,
}: {
  roles: UserRole[];
  onFill: (role: UserRole) => void;
}) {
  const [open,   setOpen]   = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mt-6 rounded-xl border border-[--border] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-[--text-3] hover:bg-[--bg-muted] transition-colors"
      >
        <span>🔑 Demo credentials</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-3 border-t border-[--border]">
              {roles.map((role) => {
                const creds = DEMO_CREDENTIALS[role as keyof typeof DEMO_CREDENTIALS];
                if (!creds) return null;
                return (
                  <div key={role} className="pt-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[--text-4]">
                        {creds.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => onFill(role)}
                        className="text-[10px] text-brand-500 hover:text-brand-600 font-medium transition-colors"
                      >
                        Fill form →
                      </button>
                    </div>
                    {[
                      { label: "Email",    value: creds.email,    key: `${role}-email` },
                      { label: "Password", value: creds.password, key: `${role}-pw`    },
                    ].map(({ label, value, key }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-2 py-1"
                      >
                        <span className="text-[11px] text-[--text-4] w-14 shrink-0">{label}</span>
                        <code className="flex-1 text-[11px] text-[--text-2] truncate font-mono">
                          {value}
                        </code>
                        <button
                          type="button"
                          onClick={() => copy(value, key)}
                          className="shrink-0 text-[--text-4] hover:text-[--text-2] transition-colors"
                          aria-label={`Copy ${label}`}
                        >
                          {copied === key ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
