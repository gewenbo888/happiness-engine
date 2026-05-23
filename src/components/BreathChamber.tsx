"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "./lang";

// ---------------------------------------------------------------------------
// Breath patterns
// ---------------------------------------------------------------------------
type Pattern = {
  key: string;
  label: { en: string; zh: string };
  desc: { en: string; zh: string };
  /** inhale / hold / exhale / hold (seconds). 0 = skip that phase. */
  phases: [number, number, number, number];
};

const PATTERNS: Pattern[] = [
  {
    key: "box",
    label: { en: "Box  4-4-4-4", zh: "盒式  4-4-4-4" },
    desc: { en: "Box breathing — equal phases, total clarity.", zh: "盒式呼吸——四相等长，全然清明。" },
    phases: [4, 4, 4, 4],
  },
  {
    key: "478",
    label: { en: "Relax  4-7-8", zh: "放松  4-7-8" },
    desc: { en: "4-7-8 — extended exhale soothes the nervous system.", zh: "4-7-8 放松——延长呼气，安抚神经系统。" },
    phases: [4, 7, 8, 0],
  },
];

type PhaseIdx = 0 | 1 | 2 | 3;

const PHASE_META: { label: { en: string; zh: string }; color: string }[] = [
  { label: { en: "Inhale", zh: "吸气" }, color: "#ffb86b" },
  { label: { en: "Hold",   zh: "屏息" }, color: "#d8c6ff" },
  { label: { en: "Exhale", zh: "呼气" }, color: "#6ee9d4" },
  { label: { en: "Hold",   zh: "屏息" }, color: "#c0a3ff" },
];

// Tonal frequencies per phase: A3 / C4 / F3 / G3
const PHASE_FREQS: [number, number, number, number] = [220, 261, 174, 196];

// ---------------------------------------------------------------------------
// Canvas colour helpers
// ---------------------------------------------------------------------------
type RGBA = [number, number, number, number];

function lerpRGBA(a: RGBA, b: RGBA, t: number): RGBA {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

const INNER_STOPS: RGBA[] = [
  [255, 158,  79, 0.88], // inhale  — dawn amber
  [255, 210, 154, 0.92], // hold1   — pale gold
  [ 61, 214, 189, 0.82], // exhale  — calm teal
  [168, 127, 255, 0.78], // hold2   — mind violet
];
const OUTER_STOPS: RGBA[] = [
  [255, 140, 158, 0.42],
  [168, 127, 255, 0.48],
  [110, 233, 212, 0.38],
  [ 61, 214, 189, 0.32],
];

function orbColors(phase: PhaseIdx, progress: number): { inner: RGBA; outer: RGBA } {
  const next = ((phase + 1) % 4) as PhaseIdx;
  // smooth-step easing
  const t = progress * progress * (3 - 2 * progress);
  return {
    inner: lerpRGBA(INNER_STOPS[phase], INNER_STOPS[next], t),
    outer: lerpRGBA(OUTER_STOPS[phase], OUTER_STOPS[next], t),
  };
}

function orbScale(phase: PhaseIdx, progress: number): number {
  const MIN = 0.42;
  const MAX = 1.0;
  // ease-in-out-quad
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  switch (phase) {
    case 0: return MIN + (MAX - MIN) * ease(progress); // inhale: expand
    case 1: return MAX;                                  // hold: full
    case 2: return MAX - (MAX - MIN) * ease(progress); // exhale: shrink
    case 3: return MIN;                                  // hold: small
  }
}

function toRgba([r, g, b, a]: RGBA): string {
  return `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------
type AudioBundle = { ctx: AudioContext; osc: OscillatorNode; gain: GainNode };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function BreathChamber() {
  const { lang } = useLang();

  const [patternKey, setPatternKey] = useState<string>("box");
  const [playing, setPlaying]       = useState(false);
  const [soundOn, setSoundOn]       = useState(false);
  const [cycles, setCycles]         = useState(0);
  const [phase, setPhase]           = useState<PhaseIdx>(0);
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Stable refs accessed inside rAF
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const patternRef  = useRef<Pattern>(PATTERNS[0]);
  const rafRef      = useRef<number>(0);
  const audioRef    = useRef<AudioBundle | null>(null);
  const soundOnRef  = useRef(false);

  // Mirror state → refs
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);
  useEffect(() => {
    patternRef.current = PATTERNS.find((x) => x.key === patternKey) ?? PATTERNS[0];
  }, [patternKey]);

  // ---- Audio helpers -------------------------------------------------------
  const ensureAudio = useCallback((): AudioBundle | null => {
    if (audioRef.current) return audioRef.current;
    try {
      const ctx  = new AudioContext();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 174;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioRef.current = { ctx, osc, gain };
      return audioRef.current;
    } catch {
      return null;
    }
  }, []);

  const playTone = useCallback((freq: number, targetGain: number, fadeSecs: number) => {
    if (!soundOnRef.current) return;
    const a = ensureAudio();
    if (!a) return;
    try {
      const { ctx, osc, gain } = a;
      osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.3);
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(targetGain, ctx.currentTime, fadeSecs);
    } catch { /* ignore suspended context */ }
  }, [ensureAudio]);

  const stopTone = useCallback((fadeSecs: number) => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const { ctx, gain } = a;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, fadeSecs);
    } catch {}
  }, []);

  // ---- rAF loop ------------------------------------------------------------
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      stopTone(0.5);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = canvas.clientWidth || 260;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx2d.scale(dpr, dpr);

    const CX     = SIZE / 2;
    const CY     = SIZE / 2;
    const BASE_R = SIZE * 0.32;

    let phaseIdx: PhaseIdx    = 0;
    let phaseStart             = performance.now();
    let cycleCount             = 0;
    let lastPhaseIdx: PhaseIdx | null = null;

    setPhase(0);
    setSecondsLeft(patternRef.current.phases[0]);

    const drawFrame = (now: number) => {
      const durs = patternRef.current.phases;

      // Advance phase clock, skipping zero-duration phases
      let elapsed = now - phaseStart;
      let guard = 0;
      while (elapsed >= durs[phaseIdx] * 1000 && guard < 8) {
        guard++;
        // Skip this phase if it is zero-duration
        if (durs[phaseIdx] === 0) {
          elapsed = 0;
          phaseStart = now;
          const prev = phaseIdx;
          phaseIdx = ((phaseIdx + 1) % 4) as PhaseIdx;
          if (phaseIdx === 0 && prev === 3) { cycleCount++; setCycles(cycleCount); }
          continue;
        }
        elapsed -= durs[phaseIdx] * 1000;
        phaseStart = now - elapsed;
        const prev = phaseIdx;
        phaseIdx = ((phaseIdx + 1) % 4) as PhaseIdx;
        if (phaseIdx === 0 && prev === 3) { cycleCount++; setCycles(cycleCount); }
        // If the next phase has zero duration, the while loop will skip it
      }

      const phaseDurMs = durs[phaseIdx] * 1000;
      const progress   = phaseDurMs > 0 ? Math.min(elapsed / phaseDurMs, 1) : 0;

      // React state update only on phase change
      if (phaseIdx !== lastPhaseIdx) {
        lastPhaseIdx = phaseIdx;
        setPhase(phaseIdx);
        playTone(PHASE_FREQS[phaseIdx], phaseIdx === 2 ? 0.045 : 0.06, 0.8);
      }

      // Seconds remaining label
      const secLeft = phaseDurMs > 0
        ? Math.ceil((phaseDurMs - elapsed) / 1000)
        : 0;
      setSecondsLeft(Math.max(1, secLeft));

      // ---- Canvas draw ----
      ctx2d.clearRect(0, 0, SIZE, SIZE);

      const scale = orbScale(phaseIdx, progress);
      const r     = BASE_R * scale;
      const { inner, outer } = orbColors(phaseIdx, progress);

      // Emanating concentric rings
      for (let i = 0; i < 3; i++) {
        const rp   = (progress + i / 3) % 1;
        const ringR = r + SIZE * 0.22 * rp;
        const ringA = (1 - rp) * (phaseIdx === 0 ? 0.22 : phaseIdx === 2 ? 0.18 : 0.12);
        ctx2d.beginPath();
        ctx2d.arc(CX, CY, ringR, 0, Math.PI * 2);
        ctx2d.strokeStyle = toRgba([inner[0], inner[1], inner[2], ringA]);
        ctx2d.lineWidth   = 1.2 + (1 - rp) * 1.4;
        ctx2d.stroke();
      }

      // Soft glow halo
      const glowR = r * 1.55;
      const glow  = ctx2d.createRadialGradient(CX, CY, r * 0.4, CX, CY, glowR);
      glow.addColorStop(0, toRgba([inner[0], inner[1], inner[2], 0]));
      glow.addColorStop(1, toRgba([outer[0], outer[1], outer[2], 0.32 * scale]));
      ctx2d.beginPath();
      ctx2d.arc(CX, CY, glowR, 0, Math.PI * 2);
      ctx2d.fillStyle = glow;
      ctx2d.fill();

      // Main orb body
      const grad = ctx2d.createRadialGradient(
        CX - r * 0.18, CY - r * 0.18, r * 0.02,
        CX,            CY,            r
      );
      grad.addColorStop(0,    toRgba([255, 235, 190, 0.92]));
      grad.addColorStop(0.38, toRgba(inner));
      grad.addColorStop(1,    toRgba(outer));
      ctx2d.beginPath();
      ctx2d.arc(CX, CY, r, 0, Math.PI * 2);
      ctx2d.fillStyle = grad;
      ctx2d.fill();

      // Specular highlight
      const spec = ctx2d.createRadialGradient(
        CX - r * 0.3, CY - r * 0.3, 0,
        CX - r * 0.3, CY - r * 0.3, r * 0.55
      );
      spec.addColorStop(0, "rgba(255,248,240,0.28)");
      spec.addColorStop(1, "rgba(255,248,240,0)");
      ctx2d.beginPath();
      ctx2d.arc(CX, CY, r, 0, Math.PI * 2);
      ctx2d.fillStyle = spec;
      ctx2d.fill();

      rafRef.current = requestAnimationFrame(drawFrame);
    };

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => { cancelAnimationFrame(rafRef.current); };
  // We intentionally re-run this effect only when play state or pattern changes.
  // playTone / stopTone are stable useCallback refs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, patternKey]);

  // ---- Idle canvas (not playing) ------------------------------------------
  useEffect(() => {
    if (playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = canvas.clientWidth || 260;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx2d.scale(dpr, dpr);
    const CX    = SIZE / 2;
    const CY    = SIZE / 2;
    const idleR = SIZE * 0.32 * 0.62;
    ctx2d.clearRect(0, 0, SIZE, SIZE);
    const grad = ctx2d.createRadialGradient(CX - idleR * 0.2, CY - idleR * 0.2, idleR * 0.02, CX, CY, idleR);
    grad.addColorStop(0,   "rgba(255,235,190,0.65)");
    grad.addColorStop(0.5, "rgba(255,158,79,0.42)");
    grad.addColorStop(1,   "rgba(168,127,255,0.18)");
    ctx2d.beginPath();
    ctx2d.arc(CX, CY, idleR, 0, Math.PI * 2);
    ctx2d.fillStyle = grad;
    ctx2d.fill();
  }, [playing]);

  // ---- Cleanup on unmount --------------------------------------------------
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      const a = audioRef.current;
      if (a) {
        try { a.osc.stop(); }  catch {}
        try { a.ctx.close(); } catch {}
        audioRef.current = null;
      }
    };
  }, []);

  // ---- Controls ------------------------------------------------------------
  const togglePlay = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        // stopping
        setPhase(0);
        setSecondsLeft(patternRef.current.phases[0]);
        setCycles(0);
      }
      return !prev;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      soundOnRef.current = next;
      if (next) {
        ensureAudio();
        // playTone checks soundOnRef internally, but we just set it so call directly
        const a = audioRef.current;
        if (a) {
          try {
            const { ctx, osc, gain } = a;
            osc.frequency.setTargetAtTime(PHASE_FREQS[0], ctx.currentTime, 0.3);
            gain.gain.cancelScheduledValues(ctx.currentTime);
            gain.gain.setTargetAtTime(0.055, ctx.currentTime, 0.8);
          } catch {}
        }
      } else {
        stopTone(0.4);
      }
      return next;
    });
  }, [ensureAudio, stopTone]);

  const switchPattern = useCallback((key: string) => {
    setPatternKey(key);
    if (playing) {
      // Brief restart so the new pattern phase durations take effect cleanly
      setPlaying(false);
      setCycles(0);
      setTimeout(() => setPlaying(true), 80);
    }
  }, [playing]);

  // ---- Derived values for rendering ---------------------------------------
  const currentPattern = PATTERNS.find((x) => x.key === patternKey) ?? PATTERNS[0];
  const phaseMeta      = PHASE_META[phase];

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-2" style={{ userSelect: "none" }}>

      {/* ---- Orb --------------------------------------------------------- */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: "min(300px, 80vw)", height: "min(300px, 80vw)" }}
      >
        {/* Ambient halo */}
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, transparent 44%, rgba(168,127,255,0.06) 70%, transparent 100%)",
            opacity: playing ? 1 : 0.35,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />

        {/* Phase label — always synced to rAF state */}
        {playing ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span
              className="display text-2xl tracking-wide"
              style={{ color: phaseMeta.color, textShadow: `0 0 24px ${phaseMeta.color}99` }}
            >
              {phaseMeta.label.en}
            </span>
            <span
              className="zh text-[1rem] leading-tight"
              style={{ color: phaseMeta.color, opacity: 0.7 }}
            >
              {phaseMeta.label.zh}
            </span>
            <span
              className="label-mono mt-1"
              style={{ color: phaseMeta.color, opacity: 0.55, letterSpacing: "0.12em", fontSize: "0.72rem" }}
            >
              {secondsLeft}s
            </span>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="label-mono text-[0.65rem] opacity-40" style={{ color: "#a08a82" }}>
              {lang === "zh" ? <span className="zh">准备好了吗</span> : "ready"}
            </span>
          </div>
        )}
      </div>

      {/* ---- Phase duration bar (active only) ----------------------------- */}
      {playing && (
        <div className="flex gap-5">
          {currentPattern.phases.map((d, i) => {
            if (d === 0) return null;
            const m = PHASE_META[i as PhaseIdx];
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span
                  className="display text-lg font-semibold transition-opacity duration-500"
                  style={{ color: m.color, opacity: phase === i ? 1 : 0.28 }}
                >
                  {d}
                </span>
                <span
                  className={`font-mono uppercase tracking-widest transition-opacity duration-500 ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: m.color, opacity: phase === i ? 0.65 : 0.22, fontSize: "0.58rem" }}
                >
                  {lang === "zh" ? m.label.zh : m.label.en}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Pattern selector --------------------------------------------- */}
      <div className="flex flex-wrap justify-center gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.key}
            onClick={() => switchPattern(p.key)}
            className={`rounded-full border px-4 py-1.5 font-mono transition-all duration-300 ${
              patternKey === p.key
                ? "border-transparent bg-dawn-400/20 text-dawn-300"
                : "border-dawn-500/20 text-bone-500 hover:border-dawn-500/40 hover:text-bone-300"
            }`}
            style={{ fontSize: "0.68rem" }}
          >
            <span className={lang === "zh" ? "zh" : ""}>{p.label[lang]}</span>
          </button>
        ))}
      </div>

      {/* ---- Pattern description ------------------------------------------ */}
      <p
        className={`max-w-xs text-center leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}
        style={{ fontSize: "0.72rem" }}
      >
        {currentPattern.desc[lang]}
      </p>

      {/* ---- Controls row ------------------------------------------------- */}
      <div className="flex items-center gap-5">

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "pause" : "play"}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-dawn-500/30 bg-void-900/60 text-dawn-300 transition-all duration-300 hover:border-dawn-400/60 hover:bg-void-800/80 hover:shadow-[0_0_18px_rgba(255,158,79,0.2)]"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
              <rect x="3.5" y="3" width="4"   height="12" rx="1.2" />
              <rect x="10.5" y="3" width="4" height="12" rx="1.2" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
              <path d="M5 3.5l10 5.5-10 5.5V3.5z" />
            </svg>
          )}
        </button>

        {/* Cycle counter */}
        <div className="flex flex-col items-center min-w-[2rem]">
          <span className="display text-xl text-dawn-300 leading-none">{cycles}</span>
          <span
            className={`label-mono text-bone-500 ${lang === "zh" ? "zh" : ""}`}
            style={{ fontSize: "0.54rem" }}
          >
            {lang === "zh" ? "循环" : "cycles"}
          </span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "mute" : "enable sound"}
          title={soundOn
            ? (lang === "zh" ? "关闭音效" : "Mute tone")
            : (lang === "zh" ? "开启音效" : "Enable tone")}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            soundOn
              ? "border-calm-500/50 bg-calm-500/10 text-calm-400 hover:bg-calm-500/20"
              : "border-bone-500/20 bg-void-900/40 text-bone-500 hover:border-bone-500/40 hover:text-bone-300"
          }`}
        >
          {soundOn ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5z" opacity=".85" />
              <path d="M10.5 5.5a4 4 0 0 1 0 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M12.3 3.5a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5z" opacity=".55" />
              <line x1="10" y1="6" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ---- Divider ------------------------------------------------------ */}
      <div className="rule-warm w-full max-w-xs" />

      {/* ---- Guidance note ------------------------------------------------ */}
      <p
        className={`max-w-sm text-center leading-loose ${lang === "zh" ? "zh" : ""}`}
        style={{ fontSize: "0.7rem", color: "rgba(160,138,130,0.52)" }}
      >
        {lang === "zh"
          ? "闭上眼睛，随着光球呼吸。不必强求——只需跟随。"
          : "Close your eyes, breathe with the orb. No forcing — just follow."}
      </p>
    </div>
  );
}
