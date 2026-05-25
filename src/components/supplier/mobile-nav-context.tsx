"use client";

import * as React from "react";

interface MobileNavCtx {
  open:   boolean;
  toggle: () => void;
  close:  () => void;
}

const Ctx = React.createContext<MobileNavCtx>({ open: false, toggle: () => {}, close: () => {} });

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Ctx.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMobileNav() { return React.useContext(Ctx); }
