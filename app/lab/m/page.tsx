import type { Metadata } from "next";
import { Kinetic } from "@/app/lab/m/Kinetic";
import { Nav } from "@/app/lab/m/Nav";
import { Rail } from "@/app/lab/m/Rail";

export const metadata: Metadata = {
  title: "M · Speed",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="home" />
      <main className="m-home">
        <Kinetic />
        <Rail />
      </main>
    </>
  );
}
