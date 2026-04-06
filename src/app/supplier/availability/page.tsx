"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Info } from "lucide-react";
import { AvailabilityCalendar } from "@/components/supplier/availability-calendar";

/* In production, pull this from the auth session / user context.
   We use the same supplier id as the mock data throughout the app. */
const SUPPLIER_ID = "sup-001";

export default function AvailabilityPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">

      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="h-5 w-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">Availability</h1>
        </div>
        <p className="text-sm text-gray-500">
          Mark dates when you are unavailable. Customers will only be able to
          book on dates you leave open.
        </p>
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3"
      >
        <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-px" />
        <div className="text-[12px] text-indigo-700 space-y-0.5">
          <p className="font-semibold">How it works</p>
          <p>Click any future date to toggle it unavailable. Confirmed bookings (red) cannot be changed here — contact support to cancel a booking.</p>
          <p className="mt-1">Hold <kbd className="rounded bg-indigo-100 px-1 py-0.5 font-mono text-[10px]">Shift</kbd> and click a second date to block a range at once.</p>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
      >
        <AvailabilityCalendar supplierId={SUPPLIER_ID} />
      </motion.div>

    </div>
  );
}
