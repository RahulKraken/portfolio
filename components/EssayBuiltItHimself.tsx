import { CopyEmail } from "@/components/CopyEmail";
import { Reading } from "@/components/Reading";
import { site } from "@/lib/site";
import Link from "next/link";

export function EssayBuiltItHimself() {
  return (
    <div className="essay-wrap">
      <article className="essay">
        <p>
          <Link className="back" href="/notes">
            ← Notes
          </Link>
        </p>
        <section className="lead">
          <h1>He doesn’t trust an instrument until he’s built it himself.</h1>
          <p>
            Every other trait is downstream of that. Rider, engineer, musician,
            self-built — same procedure, different room.
          </p>
        </section>

        <section className="case" id="lap">
          <Reading label="Fix interval at 120 km/h" value="6.6 m → 3.3 m" />
          <p>
            A commercial GPS lap timer costs more than the entire DIY rig will
            ever cost in parts, twice over. AiM Solo 2 DL runs $800+. Garmin
            Catalyst sits between $900 and $1,300. Both are built for cars
            first — CAN bus, dashboard mounting, ECU hooks — and bolted onto
            a motorcycle as an afterthought. Neither gives you lean angle out
            of the box, which is the one number that actually tells you
            something about a track bike that lap time alone doesn’t.
          </p>
          <table className="compare">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Cost</th>
                <th>What you get</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AiM Solo 2 DL</td>
                <td>$800+</td>
                <td>Car dashboard. No lean.</td>
              </tr>
              <tr>
                <td>Garmin Catalyst</td>
                <td>$900–1,300</td>
                <td>Car first. Motorcycle later.</td>
              </tr>
              <tr className="mine">
                <td>ESP32 + MPU6050 + NEO-M8N</td>
                <td>₹1,900–2,700 / &lt;$35</td>
                <td>Splits, overlay, lean, raw CSV.</td>
              </tr>
            </tbody>
          </table>
          <p>
            What has to be measured: lap splits, corner speed, a GPS overlay,
            lean angle. Logged every session at MMRT and Aruani Grid. The rest
            of a commercial unit — leaderboard, cloud, in-dash coaching — is
            UI wrapped around four numbers that can be computed after the
            session.
          </p>
          <p>
            Every cheap-GPS tutorial defaults to the NEO-6M because it is a few
            hundred rupees less. It tops out at 5 Hz. The M8N does 10 Hz. At
            MMRT corner speeds — call it 120 km/h, roughly 33 m/s — a 5 Hz fix
            is a new position every 200 ms, or about 6.6 metres of blind travel
            between updates. Halve the interval and you halve the distance the
            bike moves before the log catches up. On a track where the
            difference between a good line and a wide one is measured in feet,
            that is not a rounding error. It is the resolution of the dataset.
          </p>
          <p>
            IMU and GPS write CSV on the bike — dumb, fast, no processing in
            the session. Afterward a script reconstructs the line, computes
            lean from the quaternion, geofences the splits. The question that
            week decides the query. A $900 box would have decided it for him.
          </p>
        </section>

        <section className="case" id="guitar">
          <Reading label="Let It Be solo" value="notes ≠ recording" />
          <p>
            He doesn’t read the tab and call it done. He reverse-engineers the
            recording, phrase by phrase — Gilmour, Pink Floyd, then Dylan —
            because the published notes are someone else’s instrument.
          </p>
          <p>
            The Let It Be solo was learned with every note correct. It didn’t
            sound like the recording. The gap isn’t “technique” in the way
            that word usually gets used. It’s finger speed that isn’t there
            yet, independence that acoustic chord-playing never built, and the
            stuff that doesn’t show up in a tab at all — bends, vibrato, the
            exact timing of an attack relative to the beat. None of that is
            written in the notes. All of it is the actual solo.
          </p>
          <p>
            Knockin’ on Heaven’s Door is doing the same thing now. Getting the
            shapes right takes an evening. Getting it to sound like Dylan is a
            different project with a different timeline. The ear is ahead of
            the hands: it can hear the bend that’s too fast, the vibrato that
            isn’t there, the note that lands a fraction early. The standard
            is specific, which means the correct-notes-empty-sound stretch is
            a checkpoint, not a plateau. Squats went this way. Track riding
            went this way. Guitar doesn’t get to skip the line. The ear gets
            there for free. The hands bill you for every rep.
          </p>
        </section>

        <section className="case" id="lifting">
          <Reading label="Program" value="template → own log" />
          <p>
            He doesn’t run a standard lifting program. A template is an
            inherited instrument: it tells you what someone else’s week was
            supposed to look like. The log is the one he built — stalled load,
            sleep against session, what this week actually said — and the
            next session is calibrated against those numbers, not against the
            plan’s reputation.
          </p>
          <p>
            Same shape as the guitar and the bike. A long stretch where
            deliberate work produces correct-but-lifeless output. Then a
            click. Then the slope. Knowing the shape doesn’t shorten the wait.
            It just means he isn’t confused about which phase he’s in.
          </p>
        </section>

        <section className="case" id="tracker">
          <Reading label="Decision instrument" value="516 companies" />
          <p>
            A recruiter’s read is someone else’s dashboard. The 516-company
            tracker is the same move as the lap timer: build a measuring
            instrument for the decision instead of consuming a summary. The
            point isn’t the spreadsheet. The point is owning the resolution
            of the dataset.
          </p>
        </section>

        <section className="case" id="pillar">
          <Reading label="Currently under construction" value="Pillar" />
          <p>
            <a href={site.pillar} rel="noreferrer" target="_blank">
              Pillar
            </a>{" "}
            is a fitness app on one idea: everyone is an athlete. Not a form —
            a conversation that quietly becomes structured data. Honeycomb-style
            markers applied to a person instead of a service: a change in fuel
            or training logged between two snapshots of a life. The same
            instinct as the CSV on the bike, pointed at training, fuel, and
            recovery.
          </p>
        </section>

        <section className="close">
          <CopyEmail />
        </section>
      </article>
    </div>
  );
}
