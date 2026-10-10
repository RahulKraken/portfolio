"use client";

import { useEffect, useState } from "react";

function formatIst(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function Clock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => setTime(formatIst(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) {
    return (
      <span className="nav-clock" suppressHydrationWarning>
        —:— IST
      </span>
    );
  }

  return <span className="nav-clock">{time} IST</span>;
}
