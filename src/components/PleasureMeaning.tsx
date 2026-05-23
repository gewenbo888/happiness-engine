"use client";

import { useEffect, useRef, useState } from "react";
import { PURSUITS } from "./content";
import { useLang, T } from "./lang";

/* ─── geometry ─────────────────────────────────────────────── */
const W = 640;
const H = 280;
const PAD = { top: 24, right: 24, bottom: 44, left: 48 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const STEPS = 200; // x-axis samples

/* ─── curve math ────────────────────────────────────────────── */
/** Hedonic: spike → exponential decay to a low baseline */
function hedonia(t: number, hedonic: number, decay: number): number {
  // t in [0,1]
  const baseline = 0.06;
  const peak = hedonic / 100;
  // spike at t ≈ 0.05, then decay
  const tPeak = 0.05;
  if (t <= tPeak) {
    // rapid rise
    return baseline + (peak - baseline) * (t / tPeak);
  }
  const elapsed = t - tPeak;
  const halfLife = 0.08 + (1 - decay) * 0.55; // fast decay → short half-life
  const lambda = Math.log(2) / halfLife;
  return baseline + (peak - baseline) * Math.exp(-lambda * elapsed);
}

/** Eudaimonic: slow saturating growth toward ceiling ∝ eudaimonic */
function eudaimonia(t: number, eudaimonic: number): number {
  const ceil = eudaimonic / 100;
  const k = 3.8; // growth rate
  return ceil * (1 - Math.exp(-k * t));
}

function buildPoints(
  fn: (t: number) => number
): Array<{ x: number; y: number }> {
  return Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = i / STEPS;
    const v = fn(t);
    return {
      x: PAD.left + t * CHART_W,
      y: PAD.top + CHART_H - v * CHART_H,
    };
  });
}

function toPolyline(pts: Array<{ x: number; y: number }>): string {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

function toArea(
  pts: Array<{ x: number; y: number }>,
  baseline: number
): string {
  const base = PAD.top + CHART_H - baseline * CHART_H;
  const first = pts[0];
  const last = pts[pts.length - 1];
  return (
    `M ${first.x.toFixed(2)},${base.toFixed(2)} ` +
    pts.map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    ` L ${last.x.toFixed(2)},${base.toFixed(2)} Z`
  );
}

/* ─── component ─────────────────────────────────────────────── */
export default function PleasureMeaning() {
  const { lang } = useLang();
  const [selectedKey, setSelectedKey] = useState<string>(PURSUITS[0].key);
  const [animProgress, setAnimProgress] = useState<number>(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const ANIM_MS = 900;

  const pursuit = PURSUITS.find((p) => p.key === selectedKey)!;

  /* animate draw-in whenever selection changes */
  useEffect(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setAnimProgress(0);

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const prog = Math.min(elapsed / ANIM_MS, 1);
      // ease-in-out cubic
      const eased =
        prog < 0.5 ? 4 * prog * prog * prog : 1 - Math.pow(-2 * prog + 2, 3) / 2;
      setAnimProgress(eased);
      if (prog < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [selectedKey]);

  /* build full-resolution curve points, then clip to animProgress */
  const hedoniaFull = buildPoints((t) =>
    hedonia(t, pursuit.hedonic, pursuit.decay)
  );
  const eudaimoniaFull = buildPoints((t) => eudaimonia(t, pursuit.eudaimonic));

  const clipIdx = Math.round(animProgress * STEPS);
  const hedoniaVisible = hedoniaFull.slice(0, clipIdx + 1);
  const eudaimoniaVisible = eudaimoniaFull.slice(0, clipIdx + 1);

  /* end-of-life readouts (t=1) */
  const pleasureEnd = hedonia(1, pursuit.hedonic, pursuit.decay);
  const meaningEnd = eudaimonia(1, pursuit.eudaimonic);
  const pleasurePct = Math.round(pleasureEnd * 100);
  const meaningPct = Math.round(meaningEnd * 100);

  /* axis ticks */
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const xLabels = [
    { t: 0, label: { en: "start 起点", zh: "起点" } },
    { t: 0.5, label: { en: "mid 中途", zh: "中途" } },
    { t: 1, label: { en: "end 终点", zh: "终点" } },
  ];

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* header */}
      <div className="mb-1 label-mono">
        {lang === "zh" ? "02 · 快乐 vs 意义" : "02 · Pleasure vs Meaning"}
      </div>
      <h2 className="display text-2xl md:text-3xl glow-text mb-1">
        <T v={{ en: "Two curves, one life", zh: "两条曲线，一段人生" }} />
      </h2>
      <p className="text-sm text-bone-500 mb-5 max-w-xl leading-relaxed">
        <T
          v={{
            en: "Pleasure spikes then adapts away. Meaning accumulates. Choose a pursuit to see both play out across a lifetime.",
            zh: "快乐急升后适应消退。意义则持续累积。选择一种追求，看两者如何在一生中展开。",
          }}
        />
      </p>

      {/* pursuit selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PURSUITS.map((p) => {
          const active = p.key === selectedKey;
          return (
            <button
              key={p.key}
              onClick={() => setSelectedKey(p.key)}
              className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] transition-all duration-200 ${
                active
                  ? "border-transparent text-void-950"
                  : "border-dawn-500/25 text-bone-300 hover:text-dawn-300 hover:border-dawn-500/50"
              }`}
              style={
                active
                  ? { backgroundColor: p.color, boxShadow: `0 0 18px -4px ${p.color}88` }
                  : {}
              }
            >
              <span className={lang === "zh" ? "zh" : ""}>{p.name[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* chart + sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_240px]">
        {/* SVG chart */}
        <div className="relative w-full overflow-hidden rounded-lg border border-void-600/60 bg-void-950/70 p-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block w-full"
            aria-label={lang === "zh" ? "快乐与意义曲线图" : "Pleasure and meaning curves"}
          >
            <defs>
              {/* hedonia gradient fill */}
              <linearGradient id="hed-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb86b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff6b81" stopOpacity="0.04" />
              </linearGradient>
              {/* eudaimonia gradient fill */}
              <linearGradient id="eud-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3dd6bd" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#a87fff" stopOpacity="0.04" />
              </linearGradient>
              {/* hedonia stroke gradient */}
              <linearGradient id="hed-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff9e4f" />
                <stop offset="100%" stopColor="#ff6b81" />
              </linearGradient>
              {/* eudaimonia stroke gradient */}
              <linearGradient id="eud-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3dd6bd" />
                <stop offset="100%" stopColor="#a87fff" />
              </linearGradient>
              <clipPath id="chart-clip">
                <rect
                  x={PAD.left}
                  y={PAD.top}
                  width={CHART_W}
                  height={CHART_H}
                />
              </clipPath>
            </defs>

            {/* grid lines */}
            {yTicks.map((v) => {
              const y = PAD.top + CHART_H - v * CHART_H;
              return (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    y1={y}
                    x2={PAD.left + CHART_W}
                    y2={y}
                    stroke="#2e2034"
                    strokeWidth={v === 0 ? 1.2 : 0.6}
                    strokeDasharray={v > 0 && v < 1 ? "3 5" : undefined}
                  />
                  {v > 0 && (
                    <text
                      x={PAD.left - 6}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontFamily="Space Mono"
                      fill="#a08a82"
                    >
                      {Math.round(v * 100)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* x-axis labels */}
            {xLabels.map(({ t, label }) => {
              const x = PAD.left + t * CHART_W;
              return (
                <text
                  key={t}
                  x={x}
                  y={PAD.top + CHART_H + 18}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="Space Mono"
                  fill="#a08a82"
                  className={lang === "zh" ? "zh" : ""}
                >
                  {label[lang]}
                </text>
              );
            })}

            {/* x-axis title */}
            <text
              x={PAD.left + CHART_W / 2}
              y={H - 4}
              textAnchor="middle"
              fontSize="7"
              fontFamily="Space Mono"
              fill="#3c2c44"
              letterSpacing="1"
            >
              {lang === "zh" ? "时间 / 一生" : "TIME / A LIFE"}
            </text>

            {/* clipped area fills */}
            {hedoniaVisible.length > 1 && (
              <path
                d={toArea(hedoniaVisible, 0.06)}
                fill="url(#hed-fill)"
                clipPath="url(#chart-clip)"
              />
            )}
            {eudaimoniaVisible.length > 1 && (
              <path
                d={toArea(eudaimoniaVisible, 0)}
                fill="url(#eud-fill)"
                clipPath="url(#chart-clip)"
              />
            )}

            {/* eudaimonia line (below hedonia for z-order) */}
            {eudaimoniaVisible.length > 1 && (
              <polyline
                points={toPolyline(eudaimoniaVisible)}
                fill="none"
                stroke="url(#eud-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chart-clip)"
              />
            )}

            {/* hedonia line */}
            {hedoniaVisible.length > 1 && (
              <polyline
                points={toPolyline(hedoniaVisible)}
                fill="none"
                stroke="url(#hed-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chart-clip)"
              />
            )}

            {/* animated leading dots */}
            {hedoniaVisible.length > 0 && (
              <circle
                cx={hedoniaVisible[hedoniaVisible.length - 1].x}
                cy={hedoniaVisible[hedoniaVisible.length - 1].y}
                r="3"
                fill="#ffb86b"
                opacity={animProgress < 1 ? 0.9 : 0}
              />
            )}
            {eudaimoniaVisible.length > 0 && (
              <circle
                cx={eudaimoniaVisible[eudaimoniaVisible.length - 1].x}
                cy={eudaimoniaVisible[eudaimoniaVisible.length - 1].y}
                r="3"
                fill="#3dd6bd"
                opacity={animProgress < 1 ? 0.9 : 0}
              />
            )}

            {/* end-of-life markers (shown when animation complete) */}
            {animProgress >= 0.98 && (
              <>
                {/* pleasure end marker */}
                <circle
                  cx={PAD.left + CHART_W}
                  cy={hedoniaFull[STEPS].y}
                  r="4"
                  fill="#ff6b81"
                  opacity="0.9"
                />
                {/* meaning end marker */}
                <circle
                  cx={PAD.left + CHART_W}
                  cy={eudaimoniaFull[STEPS].y}
                  r="4"
                  fill="#a87fff"
                  opacity="0.9"
                />
              </>
            )}

            {/* axis border */}
            <line
              x1={PAD.left}
              y1={PAD.top}
              x2={PAD.left}
              y2={PAD.top + CHART_H}
              stroke="#3c2c44"
              strokeWidth="1"
            />
            <line
              x1={PAD.left}
              y1={PAD.top + CHART_H}
              x2={PAD.left + CHART_W}
              y2={PAD.top + CHART_H}
              stroke="#3c2c44"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-4">
          {/* legend */}
          <div className="rounded-lg border border-void-600/50 bg-void-800/50 p-4 space-y-3">
            <p className="label-mono mb-2">
              {lang === "zh" ? "图例" : "Legend"}
            </p>
            <div className="flex items-start gap-2">
              <div
                className="mt-0.5 h-2 w-8 flex-shrink-0 rounded-full"
                style={{ background: "linear-gradient(to right, #ff9e4f, #ff6b81)" }}
              />
              <div>
                <p className="font-mono text-[0.65rem] text-dawn-300">
                  {lang === "zh" ? "快乐 · 享乐" : "Pleasure · Hedonia"}
                </p>
                <p className={`text-[0.62rem] text-bone-500 leading-tight mt-0.5 ${lang === "zh" ? "zh" : ""}`}>
                  {lang === "zh" ? "急升后消退" : "spikes and fades"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="mt-0.5 h-2 w-8 flex-shrink-0 rounded-full"
                style={{ background: "linear-gradient(to right, #3dd6bd, #a87fff)" }}
              />
              <div>
                <p className="font-mono text-[0.65rem] text-calm-400">
                  {lang === "zh" ? "意义 · 幸福繁盛" : "Meaning · Eudaimonia"}
                </p>
                <p className={`text-[0.62rem] text-bone-500 leading-tight mt-0.5 ${lang === "zh" ? "zh" : ""}`}>
                  {lang === "zh" ? "复利累积" : "compounds and lasts"}
                </p>
              </div>
            </div>
          </div>

          {/* selected pursuit note */}
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: `${pursuit.color}30`, backgroundColor: `${pursuit.color}08` }}
          >
            <p
              className="font-mono text-[0.65rem] mb-1"
              style={{ color: pursuit.color }}
            >
              <span className={lang === "zh" ? "zh" : ""}>{pursuit.name[lang]}</span>
            </p>
            <p className={`text-xs text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""}`}>
              {pursuit.note[lang]}
            </p>
          </div>

          {/* end-of-life readout */}
          <div className="rounded-lg border border-void-600/50 bg-void-800/40 p-4">
            <p className="label-mono mb-3">
              {lang === "zh" ? "人生终点 · 残余" : "End of life · remaining"}
            </p>
            <div className="space-y-3">
              {/* pleasure remaining */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.62rem] text-dawn-400">
                    {lang === "zh" ? "快乐残余" : "Pleasure left"}
                  </span>
                  <span className="font-mono text-[0.68rem] text-dawn-300">
                    {pleasurePct}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-void-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${animProgress * pleasurePct}%`,
                      background: "linear-gradient(to right, #ff9e4f, #ff6b81)",
                    }}
                  />
                </div>
              </div>
              {/* meaning accumulated */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.62rem] text-calm-400">
                    {lang === "zh" ? "意义累积" : "Meaning built"}
                  </span>
                  <span className="font-mono text-[0.68rem] text-calm-300">
                    {meaningPct}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-void-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${animProgress * meaningPct}%`,
                      background: "linear-gradient(to right, #3dd6bd, #a87fff)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* lesson verdict */}
            <p className={`mt-3 text-[0.65rem] leading-relaxed text-bone-500 italic ${lang === "zh" ? "zh" : ""}`}>
              {meaningPct > pleasurePct * 2
                ? lang === "zh"
                  ? "意义远超快乐的残余——这条路历久弥新。"
                  : "Meaning far outlasts pleasure here — this path ages well."
                : meaningPct > pleasurePct
                ? lang === "zh"
                  ? "意义领先——享乐跑步机已几近停歇。"
                  : "Meaning leads — the treadmill has mostly wound down."
                : lang === "zh"
                ? "快乐暂时领先，但基线低而意义薄——典型的跑步机效应。"
                : "Pleasure edges ahead, but near baseline — the classic treadmill effect."}
            </p>
          </div>
        </div>
      </div>

      {/* rule */}
      <div className="rule-warm mt-6" />

      {/* bottom insight */}
      <p className={`mt-4 text-xs text-bone-500 max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "享乐适应（快感跑步机）使几乎所有快乐在数周至数月内回归基线。意义则不然：它在记忆、叙事与身份中持续累积，且通常能在困难中存活。选择追求时的关键问题不是「这能带给我多少快乐？」而是「一年后，它还剩下什么？」"
          : "Hedonic adaptation — the treadmill — returns almost any pleasure to baseline within weeks or months. Meaning does not adapt away: it accumulates in memory, narrative and identity, and often survives difficulty. The key question when choosing a pursuit is not \"how much pleasure does this give?\" but \"what does it leave behind a year from now?\""}
      </p>
    </div>
  );
}
