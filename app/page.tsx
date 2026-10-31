import RoomExperience from "@/components/room/RoomExperience";
import { openGraphSite, site } from "@/lib/site";
import "./room.css";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...openGraphSite, url: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.rahulkraken.com/#website",
      url: site.url,
      name: site.name,
    },
    {
      "@type": "Person",
      "@id": "https://www.rahulkraken.com/#person",
      name: site.name,
      url: site.url,
      jobTitle: "Founding Engineer",
      worksFor: { "@type": "Organization", name: "Straiker" },
      sameAs: [site.github, site.linkedin, site.x],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RoomExperience />
    </>
  );
}
