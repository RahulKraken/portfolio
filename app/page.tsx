import { Hud } from "@/components/Hud";
import { Quote } from "@/components/Quote";
import { Craft } from "@/components/sections/Craft";
import { Hero } from "@/components/sections/Hero";
import { Learning } from "@/components/sections/Learning";
import { SelfBuilt } from "@/components/sections/SelfBuilt";
import { Systems } from "@/components/sections/Systems";
import { Track } from "@/components/sections/Track";
import { Trajectory } from "@/components/sections/Trajectory";
import { quotes } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <a className="skip" href="#pattern">
        Skip to content
      </a>
      <Hud />
      <main>
        <Hero />
        <Quote>{quotes.stopwatch}</Quote>
        <Learning />
        <Quote>{quotes.ear}</Quote>
        <Track />
        <Quote>{quotes.pipeline}</Quote>
        <Craft />
        <Quote>{quotes.partner}</Quote>
        <Systems />
        <Quote>{quotes.barbell}</Quote>
        <SelfBuilt />
        <Quote>{quotes.privacy}</Quote>
        <Trajectory />
      </main>
    </>
  );
}
