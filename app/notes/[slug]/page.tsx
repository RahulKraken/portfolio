import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayBuiltItHimself } from "@/components/EssayBuiltItHimself";
import { notes } from "@/lib/notes";

type Params = { slug: string };

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return { title: "Note" };
  return { title: note.title, description: note.dek };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (slug !== "built-it-himself") notFound();
  return <EssayBuiltItHimself />;
}
