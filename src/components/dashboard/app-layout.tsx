"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { CommandPalette } from "./command-palette";
import { useDashboardStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const EXPANDED_W = 248;
const COLLAPSED_W = 64;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const collapsed = useDashboardStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main area */}
      <motion.div
        animate={{ marginLeft: 0 }}
        className="flex flex-1 flex-col overflow-hidden min-w-0"
      >
        {/* Header */}
        <AppHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={collapsed ? "collapsed" : "expanded"}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* Command Palette — rendered at root so it overlays everything */}
      <CommandPalette />
    </div>
  );
}
