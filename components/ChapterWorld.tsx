import { Atmosphere } from "@/components/Atmosphere";
import { Fretboard } from "@/components/diagrams/Fretboard";
import { Gauge } from "@/components/diagrams/Gauge";
import { PcbTraces } from "@/components/diagrams/PcbTraces";
import { PlateLoading } from "@/components/diagrams/PlateLoading";
import { RacingLine } from "@/components/diagrams/RacingLine";
import { Waveform } from "@/components/diagrams/Waveform";
import type { Chapter } from "@/lib/chapters";
import {
  buildingCopy,
  engineeringCopy,
  musicCopy,
  strengthCopy,
  trackCopy,
} from "@/lib/chapters";

const art = {
  track: <RacingLine />,
  strength: <PlateLoading />,
  music: (
    <>
      <Fretboard />
      <Waveform />
    </>
  ),
  building: <PcbTraces />,
  engineering: <PcbTraces />,
};

const stats: Record<
  Chapter["id"],
  { now: string; meta: string; target: string }
> = {
  track: { now: trackCopy.now, meta: trackCopy.nowMeta, target: trackCopy.target },
  strength: {
    now: strengthCopy.now,
    meta: strengthCopy.nowMeta,
    target: strengthCopy.target,
  },
  music: { now: musicCopy.now, meta: musicCopy.nowMeta, target: musicCopy.target },
  building: {
    now: buildingCopy.now,
    meta: buildingCopy.nowMeta,
    target: buildingCopy.target,
  },
  engineering: {
    now: engineeringCopy.now,
    meta: engineeringCopy.nowMeta,
    target: engineeringCopy.target,
  },
};

const alts: Record<Chapter["id"], string> = {
  track: "Duotoned atmosphere: red superbike",
  strength: "Duotoned atmosphere: barbell on gym floor",
  music: "Duotoned atmosphere: hands on a guitar",
  building: "Duotoned atmosphere: circuit board",
  engineering: "Duotoned atmosphere: server aisle",
};

export function ChapterWorld({ chapter }: { chapter: Chapter }) {
  const stat = stats[chapter.id];

  return (
    <section
      id={chapter.id}
      className="world"
      data-world
      data-theme={chapter.theme}
    >
      <Atmosphere src={`/atmosphere/${chapter.id}.jpg`} alt={alts[chapter.id]} />
      <div className="world-giant" aria-hidden>
        {chapter.n}
      </div>
      <div className="world-inner">
        <header className="world-head">
          <div className="eyebrow">
            {chapter.n} {chapter.kicker}
          </div>
          <h2>{chapter.title}</h2>
          <p className="world-sub">{chapter.subtitle}</p>
        </header>
        <div className="world-mid">
          <div>
            <div className="world-stat">{stat.now}</div>
            <div className="world-meta">{stat.meta}</div>
          </div>
          <Gauge label={stat.target} />
        </div>
        <div className="world-art">{art[chapter.id]}</div>
      </div>
    </section>
  );
}
