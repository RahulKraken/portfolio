"use client";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Motion } from "./home/Motion";
import { Eyes } from "./home/Eyes";
import { Cursor } from "./Cursor";
export function LegacyChrome() {
  const path = usePathname();
  if (path === "/") return null;
  return (
    <>
      <Nav />
      <Motion />
      <Eyes />
      <Cursor />
    </>
  );
}
