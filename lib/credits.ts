export type Credit = {
  usedFor: string;
  title: string;
  author: string;
  source: string;
  license: string;
};

export const credits: Credit[] = [
  {
    usedFor: "Track atmosphere",
    title: "Red superbike in a tunnel",
    author: "Photographer via Unsplash",
    source: "https://unsplash.com/photos/photo-1615172282427-9a57ef2d142e",
    license: "Unsplash License",
  },
  {
    usedFor: "Strength atmosphere",
    title: "Barbell on gym flooring",
    author: "Victor Freitas",
    source: "https://unsplash.com/photos/photo-1517838277536-f5f99be501cd",
    license: "Unsplash License",
  },
  {
    usedFor: "Music atmosphere",
    title: "Hands on an acoustic guitar",
    author: "Photographer via Unsplash",
    source: "https://unsplash.com/photos/photo-1510915361894-db8b60106cb1",
    license: "Unsplash License",
  },
  {
    usedFor: "Building atmosphere",
    title: "Printed circuit board",
    author: "Photographer via Unsplash",
    source: "https://unsplash.com/photos/photo-1518770660439-4636190af475",
    license: "Unsplash License",
  },
  {
    usedFor: "Engineering atmosphere",
    title: "Server aisle",
    author: "Photographer via Pexels",
    source: "https://www.pexels.com/photo/325229/",
    license: "Pexels License",
  },
];

export const creditNote =
  "Atmosphere images are openly licensed stock, duotoned in CSS. They stand in until Rahul’s own photos land. Portrait and chapter photo slots are marked TODO — not stock faces pretending to be him. Diagrams (racing line, plate loading, fretboard, waveform, PCB traces) are original SVG.";
