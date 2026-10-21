/** The CV, as the work laptop shows it. **Double asterisks** mark the figures to emphasise. */
export type Point = { label: string; text: string; link?: string };
export type Role = { title: string; dates: string; points: Point[] };
export type Job = { company: string; place: string; roles: Role[] };

export const resume = {
  name: "Rahul Kumar",
  headline: "Founding Engineer at Straiker, building security for AI agents.",
  place: "Bengaluru, India",
  links: [
    { label: "LinkedIn", href: "https://linkedin.com/in/rahulkraken" },
    { label: "GitHub", href: "https://github.com/rahulkraken" },
  ],
  jobs: [
    {
      company: "Straiker",
      place: "Bengaluru",
      roles: [
        {
          title: "Founding Engineer",
          dates: "Jun 2024 – Present",
          points: [
            {
              label: "Product direction",
              text: "Conceived and built Straiker’s **agentic security capability**, extending security from prompts and responses to agents’ tool use, process activity, and network traffic.",
            },
            {
              label: "Agent runtime security",
              text: "Runtime security from event capture to threat detection: an eBPF sensor that reconstructs LLM interactions from fragmented SSL events, an OpenTelemetry SDK, and a macOS endpoint agent.",
              link: "https://www.straiker.ai/blog/securing-agentic-ai-in-a-multi-agent-world",
            },
            {
              label: "Detection architecture",
              text: "**Three parallel detection tiers** combining pattern checks, small language models, and an **agentic harness** for complex threat investigation. **~1.5M traces a day** at **400 ms** average inference latency, with p99 traces above **10K tokens**.",
            },
            {
              label: "Tracing platform",
              text: "Microservices to collect, correlate, store, and query **15M+ events a day** across model calls, tool use, process activity, and network traffic.",
            },
            {
              label: "Integrations platform",
              text: "A shared platform for third-party integrations that scaled to **15+ integrations**, with new ones added in days; owned agentic functionality across **25+ Fortune 500** POVs and deployments.",
            },
            {
              label: "Security analytics",
              text: "A ClickHouse-backed analytics and policy platform for researchers to define custom policies and threat models, supporting **100+ policies**.",
            },
            {
              label: "Other directions",
              text: "Prototyped a developer-security MCP server for VS Code and Cursor that flags unsafe prompts, risky tool parameters, and dangerous MCP servers.",
            },
            {
              label: "Technical leadership",
              text: "Guided architecture and implementation across India engineering.",
            },
          ],
        },
      ],
    },
    {
      company: "Palo Alto Networks",
      place: "Bengaluru",
      roles: [
        {
          title: "Staff Engineer",
          dates: "Oct 2023 – May 2024",
          points: [
            {
              label: "Application search",
              text: "Led cloud resource search for application-level discovery across **10M assets** at **~100 ms p95**.",
            },
            {
              label: "Resource clustering",
              text: "Application-centric clustering that maps Kubernetes workloads to their related cloud assets.",
            },
          ],
        },
        {
          title: "Software Engineer",
          dates: "Aug 2021 – Oct 2023",
          points: [
            {
              label: "Distributed tracing",
              text: "Led the move to OpenTelemetry tracing across **15+ teams** and **50+ services**.",
            },
            {
              label: "Flow-log ingestion",
              text: "Co-built a Spark pipeline for Prisma Cloud network flow logs, cutting ingestion lag from **150+ hours to 10–30 minutes** at **~100 GB an hour**.",
              link: "https://aws.amazon.com/blogs/database/how-prisma-cloud-built-infinity-graph-using-amazon-neptune-and-amazon-opensearch-service/",
            },
            {
              label: "Data persistence",
              text: "A platform for relationships between cloud resources, decoupled from ingestion; **25+ resource types** across **3 major clouds**.",
            },
            {
              label: "Resource queries",
              text: "A query system that retrieves Kubernetes resources and builds the application context of a cloud environment.",
            },
            {
              label: "Integration testing",
              text: "CI integration tests on LocalStack and Testcontainers, cutting deployment time.",
            },
            {
              label: "eBPF",
              text: "A proof of concept for real-time Kubernetes security with eBPF.",
            },
          ],
        },
      ],
    },
  ] satisfies Job[],
  skills: [
    { label: "Languages", items: "Java, Go, SQL, Scala" },
    {
      label: "Engineering",
      items:
        "Distributed systems, backend, data pipelines, observability, LLM inference",
    },
    {
      label: "Tools",
      items:
        "eBPF, OpenTelemetry, Spark, Kafka, ClickHouse, Elasticsearch, PostgreSQL, Docker, Kubernetes, AWS",
    },
  ],
  education: {
    degree: "B.Tech, Computer Science and Engineering",
    school: "Birla Institute of Technology, Mesra",
    dates: "2017 – 2021",
  },
};
