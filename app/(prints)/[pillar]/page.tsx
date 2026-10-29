import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Chapter from "@/components/prints/Chapter";
import { CHAPTERS } from "@/lib/chapters";
import { PRINTS, isPrintId, printById } from "@/lib/prints";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRINTS.map((print) => ({ pillar: print.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar } = await params;
  const print = printById(pillar);
  if (!print) return {};
  const copy = CHAPTERS[print.id];
  return {
    title: print.label,
    description: copy.lines[0] ?? print.alt,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar } = await params;
  if (!isPrintId(pillar)) notFound();
  return <Chapter printId={pillar} />;
}
