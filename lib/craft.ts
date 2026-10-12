/** Domain-level systems. One line each. No current employer, no customers, no metrics. */
export type Craft = {
  id: string;
  label: string;
  line: string;
};

export const craft: Craft[] = [
  {
    id: "ebpf",
    label: "eBPF",
    line: "Kernel-level runtime monitoring with eBPF.",
  },
  {
    id: "macos",
    label: "macOS",
    line: "macOS endpoint agent.",
  },
  {
    id: "otel",
    label: "Tracing",
    line: "OpenTelemetry tracing pipelines.",
  },
  {
    id: "detection",
    label: "Detection",
    line: "Detection engineering for AI agents.",
  },
  {
    id: "panw",
    label: "Previously",
    line: "Network security at Palo Alto Networks (SDE-2).",
  },
];
