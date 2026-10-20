"use client";

import { usePathname } from "next/navigation";

/** Root nav, cursor, and motion stay off the /lab exploration. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/lab" || pathname.startsWith("/lab/")) return null;
  return children;
}
