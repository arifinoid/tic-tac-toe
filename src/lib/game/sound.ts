export type SoundKind = "place-x" | "place-o" | "win" | "draw" | "invalid" | "ui";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

/** Call from a user gesture so the AudioContext may start (autoplay policy). */
export function resumeAudio(): void {
  const audio = getContext();
  if (audio && audio.state === "suspended") void audio.resume();
}

interface ToneOptions {
  type?: OscillatorType;
  start?: number;
  duration?: number;
  peak?: number;
  endFreq?: number;
}

function tone(freq: number, options: ToneOptions = {}): void {
  const audio = getContext();
  if (!audio || !master) return;
  try {
    const { type = "sine", start = 0, duration = 0.12, peak = 0.05, endFreq } = options;
    const at = audio.currentTime + start;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, at + duration);

    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(peak, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    osc.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  } catch {
    /* audio is a nicety; never let it break the game */
  }
}

export function playSound(kind: SoundKind, muted = false): void {
  if (muted) return;
  switch (kind) {
    case "place-x":
      tone(190, { type: "triangle", duration: 0.09, peak: 0.05, endFreq: 150 });
      break;
    case "place-o":
      tone(300, { duration: 0.11, peak: 0.045, endFreq: 240 });
      break;
    case "win":
      tone(523.25, { duration: 0.22, peak: 0.06 });
      tone(659.25, { start: 0.09, duration: 0.22, peak: 0.06 });
      tone(783.99, { start: 0.18, duration: 0.26, peak: 0.06 });
      break;
    case "draw":
      tone(392, { duration: 0.18, peak: 0.05 });
      tone(330, { start: 0.14, duration: 0.22, peak: 0.05 });
      break;
    case "invalid":
      tone(110, { type: "square", duration: 0.06, peak: 0.03 });
      break;
    case "ui":
      tone(600, { duration: 0.03, peak: 0.025 });
      break;
  }
}
