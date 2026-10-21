// Quiet generative ambience for the studio: slow, warm chords that swell in and fade out,
// a soft bell now and then, all through a long synthetic room reverb. Built from oscillators,
// so there is nothing to download and nothing licensed. Browsers only allow audio after a
// gesture, so it starts on the visitor's first click into the studio.

const CHORDS = [
  [50, 57, 61, 64, 66], // Dmaj9
  [47, 54, 57, 61, 62], // Bm9
  [43, 50, 54, 59, 62], // Gmaj7
  [45, 52, 59, 61, 64], // Aadd9
];
const BELLS = [74, 76, 78, 81, 83, 86]; // D major pentatonic, two octaves up
const BAR = 9; // seconds per chord
const LEVEL = 0.05; // master level: present if you listen for it, never in the way

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private bar = 0;
  private next = 0;
  private muted = false;

  start(muted: boolean) {
    this.muted = muted;
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    // a long, dark room tail; the dry signal stays low so the chords feel far away
    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(ctx, 5.5);
    const wet = ctx.createGain();
    wet.gain.value = 0.75;
    this.bus = ctx.createGain();
    this.bus.gain.value = 0.35;
    this.bus.connect(this.master);
    this.bus.connect(reverb);
    reverb.connect(wet);
    wet.connect(this.master);
    this.next = ctx.currentTime + 0.2;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 1000);
    this.applyLevel(4);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.applyLevel(0.6);
  }

  /** dip under a foreground sound (the guitar strum), then come back */
  duck(seconds: number) {
    if (!this.ctx || !this.master || this.muted) return;
    const g = this.master.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(LEVEL * 0.15, t, 0.08);
    g.setTargetAtTime(LEVEL, t + seconds, 1.2);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    void this.ctx?.close();
    this.ctx = null;
  }

  private applyLevel(fade: number) {
    if (!this.ctx || !this.master) return;
    const g = this.master.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(this.muted ? 0 : LEVEL, t, fade / 3);
    // a suspended context costs nothing while muted
    if (this.muted) setTimeout(() => this.muted && this.ctx?.suspend(), fade * 1000 + 200);
    else void this.ctx.resume();
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.bus) return;
    // keep two bars queued ahead of the clock
    while (this.next < ctx.currentTime + BAR * 2) {
      const chord = CHORDS[this.bar % CHORDS.length];
      chord.forEach((note, i) => this.pad(hz(note), this.next + i * 0.18, BAR * 1.35));
      // a bell or two per bar, at loose, unhurried moments
      const bells = Math.random() < 0.6 ? 1 : 2;
      for (let b = 0; b < bells; b++) {
        if (Math.random() < 0.75)
          this.bell(hz(BELLS[Math.floor(Math.random() * BELLS.length)]), this.next + 1.5 + Math.random() * (BAR - 3));
      }
      this.next += BAR;
      this.bar++;
    }
  }

  /** a soft, slightly detuned pad voice that swells in and fades out */
  private pad(freq: number, at: number, length: number) {
    const ctx = this.ctx!, out = this.bus!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(0.07, at + length * 0.35);
    env.gain.linearRampToValueAtTime(0, at + length);
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 700 + Math.random() * 300;
    tone.Q.value = 0.4;
    tone.connect(env);
    env.connect(out);
    for (const detune of [-6, 5]) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(tone);
      osc.start(at);
      osc.stop(at + length + 0.1);
    }
  }

  /** a quiet struck tone with a long, glassy decay */
  private bell(freq: number, at: number) {
    const ctx = this.ctx!, out = this.bus!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(0.03, at + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 4.5);
    env.connect(out);
    for (const [ratio, level] of [[1, 1], [2.76, 0.25]] as const) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      g.gain.value = level;
      osc.connect(g);
      g.connect(env);
      osc.start(at);
      osc.stop(at + 4.6);
    }
  }

  /** stereo noise with an exponential decay: a cheap, smooth plate reverb */
  private impulse(ctx: AudioContext, seconds: number) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
    return buffer;
  }
}
