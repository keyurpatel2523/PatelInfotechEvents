/**
 * Transactional email helpers using Resend.
 * Requires env var: RESEND_API_KEY
 */

const FROM = "PatelInfotech Events <noreply@patelinfotech.co.uk>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const { Resend } = require("resend") as { Resend: new (k: string) => { emails: { send: (opts: unknown) => Promise<unknown> } } };
  return new Resend(key);
}

/* ── Booking confirmation (customer) ──────────────────────── */

export async function sendBookingConfirmationEmail(opts: {
  to:           string;
  customerName: string;
  bookingId:    string;
  serviceTitle: string;
  date:         string;
  total:        number;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const formattedTotal = `£${opts.total.toLocaleString("en-GB")}`;

  await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `Booking Confirmed — ${opts.serviceTitle} · ${opts.bookingId}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#6366f1">Booking Request Submitted</h2>
        <p>Hi ${opts.customerName},</p>
        <p>Your booking request has been submitted successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Booking ID</td><td style="padding:8px 0;font-weight:600">${opts.bookingId}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0;font-weight:600">${opts.serviceTitle}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Date</td><td style="padding:8px 0;font-weight:600">${opts.date}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Total</td><td style="padding:8px 0;font-weight:600">${formattedTotal}</td></tr>
        </table>
        <p>The supplier will review your request and confirm shortly.</p>
        <a href="https://patelinfotech.co.uk/dashboard/bookings/${opts.bookingId}"
           style="display:inline-block;background:#6366f1;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          View Booking
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">PatelInfotech Events · London, UK</p>
      </div>
    `,
  });
}

/* ── New booking alert (supplier) ─────────────────────────── */

export async function sendNewBookingEmail(opts: {
  to:           string;
  supplierName: string;
  bookingId:    string;
  serviceTitle: string;
  customerName: string;
  date:         string;
  total:        number;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const formattedTotal = `£${opts.total.toLocaleString("en-GB")}`;

  await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `New Booking Request — ${opts.serviceTitle} · ${opts.bookingId}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#6366f1">New Booking Request</h2>
        <p>Hi ${opts.supplierName},</p>
        <p>You have a new booking request.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Booking ID</td><td style="padding:8px 0;font-weight:600">${opts.bookingId}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0;font-weight:600">${opts.serviceTitle}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Customer</td><td style="padding:8px 0;font-weight:600">${opts.customerName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Date</td><td style="padding:8px 0;font-weight:600">${opts.date}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Value</td><td style="padding:8px 0;font-weight:600">${formattedTotal}</td></tr>
        </table>
        <a href="https://patelinfotech.co.uk/supplier/bookings/${opts.bookingId}"
           style="display:inline-block;background:#6366f1;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Review Booking
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">PatelInfotech Events · London, UK</p>
      </div>
    `,
  });
}

/* ── Payment success (customer) ───────────────────────────── */

export async function sendPaymentSuccessEmail(opts: {
  to:           string;
  customerName: string;
  bookingId:    string;
  serviceTitle: string;
  amount:       number;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const formattedAmount = `£${opts.amount.toLocaleString("en-GB")}`;

  await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `Payment Confirmed — ${formattedAmount} · ${opts.bookingId}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#22c55e">Payment Confirmed</h2>
        <p>Hi ${opts.customerName},</p>
        <p>Your payment has been processed and your booking is now confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Booking ID</td><td style="padding:8px 0;font-weight:600">${opts.bookingId}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0;font-weight:600">${opts.serviceTitle}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Amount Paid</td><td style="padding:8px 0;font-weight:600;color:#22c55e">${formattedAmount}</td></tr>
        </table>
        <a href="https://patelinfotech.co.uk/dashboard/bookings/${opts.bookingId}"
           style="display:inline-block;background:#6366f1;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          View Booking
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">PatelInfotech Events · London, UK</p>
      </div>
    `,
  });
}
