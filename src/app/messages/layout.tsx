import type { ReactNode } from "react";

export const metadata = {
  title: "Messages | PatelInfotech Events",
  description: "Chat with your event suppliers in real time",
};

/**
 * Full-screen layout — no navbar/footer, just the chat UI.
 * Prevents the body from scrolling; the chat manages its own scroll.
 */
export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[--bg]">
      {children}
    </div>
  );
}
