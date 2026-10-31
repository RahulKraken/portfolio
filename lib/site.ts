export const site = {
  name: "Rahul Kumar",
  /** Tab title and link previews. The visual mark is still the helmet in components/Mark.tsx. */
  title: "Rahul Kumar",
  email: "r.rahul4511@gmail.com",
  github: "https://github.com/RahulKraken",
  linkedin: "https://linkedin.com/in/rahulkraken",
  x: "https://x.com/RahulKraken",
  url: "https://www.rahulkraken.com",
  description:
    "Step inside Rahul Kumar’s studio. Engineering, personal projects, motorcycles, guitar, and a good cup of coffee.",
} as const;

/** Shared Open Graph fields. Next replaces the whole `openGraph` object per page, so pages spread this. */
export const openGraphSite = {
  title: site.title,
  description: site.description,
  url: site.url,
  siteName: site.title,
  locale: "en_IN",
  type: "website" as const,
  videos: [
    {
      url: "https://www.rahulkraken.com/og/ripple-portrait-v1.mp4",
      secureUrl: "https://www.rahulkraken.com/og/ripple-portrait-v1.mp4",
      type: "video/mp4",
      width: 1200,
      height: 630,
    },
  ],
};

/** Always-visible studio links. Order is the reading order in the corner. */
export const socials = [
  { id: "github", label: "GitHub", href: site.github },
  { id: "linkedin", label: "LinkedIn", href: site.linkedin },
  { id: "x", label: "X", href: site.x },
] as const;

export type SocialId = (typeof socials)[number]["id"];
