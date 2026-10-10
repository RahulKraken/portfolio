import Link from "next/link";
import { CopyEmail } from "@/components/CopyEmail";
import { contactCopy } from "@/lib/chapters";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <section className="contact" id="contact">
      <h2>Contact</h2>
      <p className="contact-line">{contactCopy.line}</p>
      <CopyEmail />
      <footer className="foot">
        <span>
          {site.name} · {site.origin} → {site.location}
        </span>
        <span>
          <Link href="/notes">Notes</Link>
          {" · "}
          <Link href="/credits">Credits</Link>
          {" · "}
          <Link href="/list-100">List 100</Link>
          {" · "}
          <a href={site.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </span>
      </footer>
    </section>
  );
}
