"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowRight, BarChart3,
  Settings, HelpCircle, Zap,
  MessageSquare, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard";
import { getAllNavItems } from "@/lib/nav-config";

/* ─── Quick actions (shown when no query) ────────────────── */
const QUICK_ACTIONS = [
  { id: "new-event",   label: "Create new event",      icon: Zap,         shortcut: "N",   href: "/dashboard/events/new" },
  { id: "analytics",  label: "View analytics",         icon: BarChart3,   shortcut: "A",   href: "/dashboard/analytics" },
  { id: "messages",   label: "Open messages",          icon: MessageSquare,shortcut: "M",  href: "/dashboard/messages" },
];

/* ─── CommandPalette ──────────────────────────────────────── */
export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen, role } = useDashboardStore();
  const [query, setQuery] = React.useState("");
  const navItems = getAllNavItems(role);

  /* Keyboard shortcut: ⌘K */
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  /* Reset query when closed */
  React.useEffect(() => {
    if (!commandOpen) setQuery("");
  }, [commandOpen]);

  function navigate(href: string) {
    router.push(href);
    setCommandOpen(false);
  }

  const itemClass = cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
    "text-[--text-1] cursor-pointer transition-colors duration-100",
    "aria-selected:bg-[--bg-muted] aria-selected:text-[--text-1]",
    "data-[selected=true]:bg-brand-100 dark:data-[selected=true]:bg-brand-950",
    "[&[data-selected='true']]:bg-[--bg-muted]"
  );

  return (
    <AnimatePresence>
      {commandOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="cmd-panel"
            initial={{ opacity: 0, scale: 0.97, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[15vh] z-50 w-full max-w-xl -translate-x-1/2 px-4"
          >
            <Command
              className={cn(
                "w-full overflow-hidden rounded-2xl",
                "bg-[--bg] border border-[--border]",
                "shadow-[var(--shadow-xl)]"
              )}
              shouldFilter
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-[--border] px-4">
                <Search className="h-4 w-4 shrink-0 text-[--text-3]" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search pages, actions, events..."
                  className={cn(
                    "flex h-14 w-full bg-transparent text-sm text-[--text-1]",
                    "placeholder:text-[--text-4] outline-none"
                  )}
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-lg text-[--text-4] hover:text-[--text-2] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 rounded-md border border-[--border] px-1.5 py-1 text-[10px] font-medium text-[--text-4] bg-[--bg-muted]">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="flex flex-col items-center py-12 text-center">
                  <div className="mb-3 text-3xl">🔍</div>
                  <p className="text-sm font-medium text-[--text-2]">No results found</p>
                  <p className="mt-1 text-xs text-[--text-4]">Try a different search term</p>
                </Command.Empty>

                {/* Quick actions (no query) */}
                {!query && (
                  <Command.Group
                    heading="Quick actions"
                    className={cn(
                      "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
                      "[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold",
                      "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider",
                      "[&_[cmdk-group-heading]]:text-[--text-4]"
                    )}
                  >
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Command.Item
                          key={action.id}
                          value={action.label}
                          onSelect={() => navigate(action.href)}
                          className={itemClass}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gradient">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="flex-1">{action.label}</span>
                          <div className="flex items-center gap-1">
                            <kbd className="flex h-5 w-5 items-center justify-center rounded-md border border-[--border] text-[10px] font-bold text-[--text-4] bg-[--bg-muted]">
                              {action.shortcut}
                            </kbd>
                          </div>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}

                {/* Nav items */}
                <Command.Group
                  heading="Navigation"
                  className={cn(
                    "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
                    "[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold",
                    "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider",
                    "[&_[cmdk-group-heading]]:text-[--text-4]",
                    !query && "mt-1 pt-1 border-t border-[--border-subtle]"
                  )}
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={item.label}
                        onSelect={() => navigate(item.href)}
                        className={itemClass}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[--bg-muted] border border-[--border]">
                          <Icon className="h-4 w-4 text-[--text-2]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[--text-1]">{item.label}</p>
                          <p className="text-xs text-[--text-4]">{item.href}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[--text-4] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Command.Item>
                    );
                  })}
                </Command.Group>

                {/* Settings */}
                <Command.Group
                  heading="Settings"
                  className={cn(
                    "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
                    "[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold",
                    "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider",
                    "[&_[cmdk-group-heading]]:text-[--text-4]",
                    "mt-1 pt-1 border-t border-[--border-subtle]"
                  )}
                >
                  {[
                    { id: "settings",  label: "Account Settings", icon: Settings,  href: "/dashboard/settings" },
                    { id: "support",   label: "Help & Support",   icon: HelpCircle, href: "/dashboard/support" },
                  ].map(({ id, label, icon: Icon, href }) => (
                    <Command.Item
                      key={id}
                      value={label}
                      onSelect={() => navigate(href)}
                      className={itemClass}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[--bg-muted] border border-[--border]">
                        <Icon className="h-4 w-4 text-[--text-2]" />
                      </div>
                      <span className="flex-1 text-sm text-[--text-1]">{label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[--border] px-4 py-2.5">
                <div className="flex items-center gap-3 text-[10px] text-[--text-4]">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-[--border] px-1 py-0.5 font-medium bg-[--bg-muted]">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-[--border] px-1 py-0.5 font-medium bg-[--bg-muted]">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-[--border] px-1 py-0.5 font-medium bg-[--bg-muted]">esc</kbd>
                    close
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[--text-4]">
                  <Zap className="h-3 w-3 text-[#6366f1]" />
                  EventSphere
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
