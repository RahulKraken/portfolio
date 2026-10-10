"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <a className="email" href={`mailto:${site.email}`}>
        {site.email}
      </a>
      <button type="button" className="copy-note" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
