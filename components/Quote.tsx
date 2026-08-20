import { Reveal } from "@/components/Reveal";

export function Quote({ children }: { children: string }) {
  return (
    <figure className="quote">
      <div className="shell">
        <Reveal>
          <blockquote>{children}</blockquote>
        </Reveal>
      </div>
    </figure>
  );
}
