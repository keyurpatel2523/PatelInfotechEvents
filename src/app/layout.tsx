import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EventSphere — Multi-Vendor Event Marketplace",
    template: "%s | EventSphere",
  },
  description:
    "Discover, book, and host extraordinary events with EventSphere — the premium multi-vendor marketplace for event professionals.",
  keywords: ["events", "marketplace", "vendors", "booking", "tickets"],
  openGraph: {
    title: "EventSphere — Multi-Vendor Event Marketplace",
    description: "Discover, book, and host extraordinary events.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
