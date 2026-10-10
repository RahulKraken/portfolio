import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Say the thing. No form, no funnel.",
};

export default function ContactPage() {
  return (
    <main>
      <SiteFooter />
    </main>
  );
}
