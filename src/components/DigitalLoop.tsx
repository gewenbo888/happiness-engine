"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, T } from "./lang";
import { DIGITAL_PATTERNS } from "./content";

/* ────────────────────────────────────────────────────────────────────────
   DigitalLoop — variable-reward dopamine-loop simulator
   Section 08: The Digital Happiness Machine

   Mechanics
   ─────────
   • "Pull / Refresh" button fires slot-machine logic: mostly small or
     nothing, occasionally a big dopamine "hit".
   • Two SVG line-chart traces update live per pull:
       (a) Dopamine / Wanting  — spikes on each pull, craving baseline rises.
       (b) Actual Satisfaction / Liking — trends down (tolerance).
   • Counters: pulls, simulated time, wanting−liking gap.
   • After ≥12 pulls, a gentle bilingual reflection surfaces.
   • 4 DIGITAL_PATTERNS concept cards rendered below.
   ──────────────────────────────────────────────────────────────────────── */

const CHART_W = 420;
const CHART_H = 160;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 28;
const INNER_W = CHART_W - PAD_L - PAD_R;
const INNER_H = CHART_H - PAD_T - PAD_B;

// Palette tokens (matching tailwind theme)
const C_WANTING = "#ffb86b";   // dawn-400
const C_LIKING  = "#6ee9d4";   // calm-400
const C_GRID    = "#211726";   // void-700
const C_AXIS    = "#a08a82";   // bone-500

type Pull = {
  wanting: number;  // 0–100
  liking: number;   // 0–100
};

/** Slot-machine: 65% nothing/tiny, 25% medium, 10% big hit */
function generateReward(): { reward: "none" | "small" | "big"; wantingDelta: number } {
  const r = Math.random();
  if (r < 0.65) return { reward: "none",  wantingDelta: 8  + Math.random() * 10 };
  if (r < 0.90) return { reward: "small", wantingDelta: 18 + Math.random() * 14 };
  return           { reward: "big",   wantingDelta: 38 + Math.random() * 22 };
}

/** Map a 0–100 value to SVG y-coord */
function vy(v: number): number {
  return PAD_T + INNER_H - (v / 100) * INNER_H;
}

/** Map pull index to SVG x-coord */
function vx(i: number, total: number): number {
  if (total <= 1) return PAD_L;
  return PAD_L + (i / (total - 1)) * INNER_W;
}

/** Build a smooth SVG polyline path from (x,y) pairs */
function polyline(pts: [number, number][]): string {
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export default function DigitalLoop() {
  const { lang } = useLang();

  const [pulls, setPulls] = useState<Pull[]>([]);
  const [wantingBaseline, setWantingBaseline] = useState(30);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [flashState, setFlashState] = useState<"none" | "small" | "big">("none");
  const [isPulling, setIsPulling] = useState(false);

  // refs for cleanup
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handlePull = useCallback(() => {
    if (isPulling) return;
    setIsPulling(true);

    const { reward, wantingDelta } = generateReward();

    // Liking: starts high, trends down with pulls + tolerance
    const n = pulls.length;
    const baseliking = Math.max(8, 78 - n * 4.2 - Math.random() * 8);
    const likingBoost = reward === "big" ? 18 : reward === "small" ? 7 : 0;
    const newLiking = Math.min(100, Math.max(4, baseliking + likingBoost));

    // Wanting: spikes per pull, craving baseline creeps up
    const newBaseline = Math.min(88, wantingBaseline + (reward === "big" ? 4 : 1.5));
    const spike = reward === "big" ? 28 : reward === "small" ? 15 : 8;
    const newWanting = Math.min(100, newBaseline + spike + Math.random() * 8);

    setWantingBaseline(newBaseline);
    setPulls((prev) => [...prev, { wanting: newWanting, liking: newLiking }]);
    setSecondsSpent((s) => s + 18 + Math.floor(Math.random() * 24));

    // Flash animation
    setFlashState(reward);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setFlashState("none");
      setIsPulling(false);
    }, reward === "big" ? 900 : 480);
  }, [isPulling, pulls.length, wantingBaseline]);

  // Derived stats
  const pullCount = pulls.length;
  const lastWanting = pulls.length > 0 ? pulls[pulls.length - 1].wanting : wantingBaseline;
  const lastLiking  = pulls.length > 0 ? pulls[pulls.length - 1].liking  : 72;
  const gap = Math.max(0, Math.round(lastWanting - lastLiking));

  const timeLabel = (() => {
    if (secondsSpent < 60) return `${secondsSpent}s`;
    const m = Math.floor(secondsSpent / 60);
    const s = secondsSpent % 60;
    return `${m}m ${s}s`;
  })();

  // SVG chart data
  const chartPoints: Pull[] = pulls.length === 0
    ? [{ wanting: wantingBaseline, liking: 72 }]
    : pulls;
  const total = chartPoints.length;

  const wantingPts: [number, number][] = chartPoints.map((p, i) => [vx(i, total), vy(p.wanting)]);
  const likingPts:  [number, number][] = chartPoints.map((p, i) => [vx(i, total), vy(p.liking)]);

  // Y-axis ticks
  const yTicks = [0, 25, 50, 75, 100];

  // Show reflection after 12+ pulls
  const showReflection = pullCount >= 12;

  // Flash overlay colours
  const flashBg =
    flashState === "big"   ? "rgba(255,184,107,0.13)" :
    flashState === "small" ? "rgba(110,233,212,0.07)" :
    "transparent";
  const flashRing =
    flashState === "big"   ? "border-dawn-400/60 shadow-[0_0_32px_4px_rgba(255,184,107,0.35)]" :
    flashState === "small" ? "border-calm-400/30" :
    "border-dawn-500/15";

  return (
    <div className={`rounded-xl border bg-void-900/60 p-5 md:p-7 transition-all duration-500 ${flashRing}`}
         style={{ background: `linear-gradient(135deg, #0f0a0e 80%, ${flashBg})` }}>

      {/* Header */}
      <div className="mb-5">
        <div className="label-mono mb-1">
          {lang === "zh"
            ? "变量奖赏 · 多巴胺循环模拟器"
            : "Variable reward · dopamine loop simulator"}
        </div>
        <p className={`text-sm leading-relaxed text-bone-300/70 max-w-xl ${lang === "zh" ? "zh" : ""}`}>
          {lang === "zh"
            ? "每次下拉都是一次老虎机旋转。「想要」不断攀升，「喜欢」悄然下坠。两者之间的落差，就是循环的捕获机制。"
            : "Every pull is a slot-machine spin. Wanting climbs; liking falls. The widening gap between them is how the loop captures you."}
        </p>
      </div>

      {/* Main layout: button + counters | chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">

        {/* Left: pull button + counters */}
        <div className="flex flex-col items-center gap-5">
          {/* Pull button */}
          <button
            onClick={handlePull}
            disabled={isPulling}
            aria-label={lang === "zh" ? "刷新" : "Pull to refresh"}
            className={`
              relative w-full max-w-[160px] select-none rounded-2xl border px-5 py-6
              font-mono text-sm font-semibold tracking-widest transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-dawn-400/50
              ${isPulling
                ? "scale-95 border-dawn-400/40 text-dawn-300 opacity-70"
                : "border-dawn-500/40 text-bone-100 hover:border-dawn-400/70 hover:text-dawn-300 active:scale-95"
              }
              ${flashState === "big" ? "border-dawn-400/70 text-dawn-300" : ""}
            `}
            style={{
              background:
                flashState === "big"
                  ? "linear-gradient(135deg,#1a120a,#251800)"
                  : "linear-gradient(135deg,#171019,#0f0a0e)",
            }}
          >
            {/* Reward glow ring */}
            {flashState === "big" && (
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ boxShadow: "0 0 28px 4px rgba(255,184,107,0.28)" }}
              />
            )}

            {/* Label */}
            <span className="block text-center leading-tight">
              {flashState === "big" ? (
                <span className="glow-text text-dawn-300">
                  {lang === "zh" ? "✦ 命中！" : "✦ Hit!"}
                </span>
              ) : flashState === "small" ? (
                <span style={{ color: C_LIKING }}>
                  {lang === "zh" ? "· 少许·" : "· small ·"}
                </span>
              ) : (
                <>
                  <span className={lang === "zh" ? "zh block" : "block"}>
                    {lang === "zh" ? "下拉刷新" : "Pull"}
                  </span>
                  <span className={`block text-[0.65rem] text-bone-500 mt-1 ${lang === "zh" ? "zh" : ""}`}>
                    {lang === "zh" ? "Refresh" : "刷新"}
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Counters */}
          <div className="w-full rounded-lg border border-void-700 bg-void-950/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-mono text-[0.62rem] text-bone-500">
                {lang === "zh" ? "拉取次数" : "PULLS"}
              </span>
              <span className="font-mono text-lg font-semibold text-bone-100">{pullCount}</span>
            </div>
            <div className="rule-warm" />
            <div className="flex items-center justify-between">
              <span className="label-mono text-[0.62rem] text-bone-500">
                {lang === "zh" ? "耗时" : "TIME"}
              </span>
              <span className="font-mono text-sm text-bone-300">{timeLabel}</span>
            </div>
            <div className="rule-warm" />
            <div className="flex items-center justify-between">
              <span className="label-mono text-[0.62rem]" style={{ color: "#ff6b81" }}>
                {lang === "zh" ? "落差" : "GAP"}
              </span>
              <span
                className="font-mono text-lg font-semibold"
                style={{ color: gap > 30 ? "#ff6b81" : gap > 15 ? "#ff8c9e" : C_AXIS }}
              >
                {gap}
              </span>
            </div>
            <p className={`text-[0.63rem] leading-snug text-bone-500 pt-1 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "想要 − 喜欢的差值。越大，循环抓得越牢。"
                : "wanting − liking. Bigger = the loop has you tighter."}
            </p>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-8 flex-shrink-0 rounded" style={{ background: C_WANTING }} />
              <span className={`text-xs text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "想要 / Wanting" : "Wanting / 想要"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-8 flex-shrink-0 rounded" style={{ background: C_LIKING }} />
              <span className={`text-xs text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "喜欢 / Liking" : "Liking / 喜欢"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: SVG chart */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="block w-full rounded-lg"
            style={{ background: "#0a0608" }}
            aria-label={lang === "zh" ? "想要与喜欢的差距图" : "Wanting vs liking gap chart"}
          >
            <defs>
              <linearGradient id="dl-want-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C_WANTING} stopOpacity="0.22" />
                <stop offset="100%" stopColor={C_WANTING} stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="dl-like-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C_LIKING} stopOpacity="0.15" />
                <stop offset="100%" stopColor={C_LIKING} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yTicks.map((v) => (
              <line
                key={v}
                x1={PAD_L} y1={vy(v)}
                x2={CHART_W - PAD_R} y2={vy(v)}
                stroke={C_GRID}
                strokeWidth={v === 0 || v === 100 ? 0.5 : 0.4}
                strokeDasharray={v === 0 || v === 100 ? "" : "3 4"}
              />
            ))}

            {/* Y-axis ticks */}
            {yTicks.filter((v) => v > 0 && v < 100).map((v) => (
              <text
                key={v}
                x={PAD_L - 5}
                y={vy(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontFamily="'Space Mono', monospace"
                fontSize="7"
                fill={C_AXIS}
              >
                {v}
              </text>
            ))}

            {/* X-axis label */}
            <text
              x={PAD_L + INNER_W / 2}
              y={CHART_H - 4}
              textAnchor="middle"
              fontFamily="'Space Mono', monospace"
              fontSize="7"
              fill={C_AXIS}
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "← 拉取次数" : "← pulls"}
            </text>

            {/* Gap fill (wanting area minus liking area — approximate with wanting area tinted rose) */}
            {total >= 2 && (
              <path
                d={`${polyline(wantingPts)} L${vx(total - 1, total).toFixed(1)},${vy(0).toFixed(1)} L${vx(0, total).toFixed(1)},${vy(0).toFixed(1)} Z`}
                fill="url(#dl-want-fill)"
              />
            )}

            {/* Wanting line */}
            {total >= 2 && (
              <path
                d={polyline(wantingPts)}
                fill="none"
                stroke={C_WANTING}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Liking line */}
            {total >= 2 && (
              <path
                d={polyline(likingPts)}
                fill="none"
                stroke={C_LIKING}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Wanting dots (last 6 only, to avoid clutter) */}
            {wantingPts.slice(-6).map(([x, y], i) => (
              <circle
                key={`w${i}`}
                cx={x} cy={y}
                r={i === wantingPts.slice(-6).length - 1 ? 3.5 : 2}
                fill={C_WANTING}
                opacity={i === wantingPts.slice(-6).length - 1 ? 1 : 0.45}
              />
            ))}

            {/* Liking dots */}
            {likingPts.slice(-6).map(([x, y], i) => (
              <circle
                key={`l${i}`}
                cx={x} cy={y}
                r={i === likingPts.slice(-6).length - 1 ? 3.5 : 2}
                fill={C_LIKING}
                opacity={i === likingPts.slice(-6).length - 1 ? 1 : 0.45}
              />
            ))}

            {/* Current gap annotation (if enough pulls) */}
            {pullCount >= 3 && (
              <>
                <line
                  x1={vx(total - 1, total)}
                  y1={vy(lastWanting)}
                  x2={vx(total - 1, total)}
                  y2={vy(lastLiking)}
                  stroke="#ff6b81"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.7"
                />
                <text
                  x={vx(total - 1, total) + 5}
                  y={(vy(lastWanting) + vy(lastLiking)) / 2}
                  dominantBaseline="middle"
                  fontFamily="'Space Mono', monospace"
                  fontSize="7"
                  fill="#ff6b81"
                >
                  {gap}
                </text>
              </>
            )}

            {/* Empty-state hint */}
            {pullCount === 0 && (
              <text
                x={CHART_W / 2}
                y={CHART_H / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="'Space Mono', monospace"
                fontSize="9"
                fill={C_AXIS}
                className={lang === "zh" ? "zh" : ""}
              >
                {lang === "zh" ? "↑ 按下拉取，观察落差" : "↑ pull to begin · watch the gap"}
              </text>
            )}
          </svg>

          {/* Dopamine spike flash overlay on chart */}
          {flashState === "big" && (
            <div
              className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300"
              style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(255,184,107,0.18) 0%, transparent 70%)" }}
            />
          )}
        </div>
      </div>

      {/* Wanting vs liking explainer */}
      <div className="mt-5 rounded-lg border border-void-700 bg-void-950/40 p-4">
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 min-w-[160px]">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-4 rounded" style={{ background: C_WANTING }} />
              <span className="label-mono text-[0.65rem]" style={{ color: C_WANTING }}>
                {lang === "zh" ? "想要 / WANTING" : "WANTING / 想要"}
              </span>
            </div>
            <p className={`text-xs leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "多巴胺驱动的渴求回路。每次拉取都触发预期，并使下一次的渴求门槛升高。"
                : "The dopamine-driven craving circuit. Each pull triggers anticipation and raises the threshold for the next."}
            </p>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-4 rounded" style={{ background: C_LIKING }} />
              <span className="label-mono text-[0.65rem]" style={{ color: C_LIKING }}>
                {lang === "zh" ? "喜欢 / LIKING" : "LIKING / 喜欢"}
              </span>
            </div>
            <p className={`text-xs leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "阿片肽介导的实际满足感。随着耐受性积累，每次回报带来的真实愉悦持续递减。"
                : "The opioid-mediated satisfaction of actual reward. Tolerance builds; each payoff delivers less real pleasure."}
            </p>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-4 rounded" style={{ background: "#ff6b81" }} />
              <span className="label-mono text-[0.65rem] rose-text">
                {lang === "zh" ? "落差 / GAP" : "GAP / 落差"}
              </span>
            </div>
            <p className={`text-xs leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "两线之间的空间，就是循环捕获你的机制——不断驱动追逐，同时悄然降低真实满足。"
                : "The space between the two lines is how the loop captures you — driving pursuit while quietly starving satisfaction."}
            </p>
          </div>
        </div>
      </div>

      {/* Reflection — surfaces after 12 pulls */}
      {showReflection && (
        <div
          className="mt-5 rounded-lg border border-rose-500/25 bg-void-950/60 p-4 lang-fade"
          style={{ borderColor: "rgba(255,107,129,0.22)" }}
        >
          <p className={`text-sm leading-relaxed text-bone-200 ${lang === "zh" ? "zh" : ""}`}>
            {lang === "zh" ? (
              <>
                <span className="rose-text font-semibold">还在刷吗？</span>{" "}
                那种感觉——明明什么都没得到，却停不下来——就是这道落差。想要的回路还在运转，喜欢的回路已经空了。
              </>
            ) : (
              <>
                <span className="rose-text font-semibold">Still pulling?</span>{" "}
                That feeling — nothing quite landing, yet the hand keeps moving — is the gap made physical. The wanting circuit is still running. The liking circuit has gone quiet.
              </>
            )}
          </p>
          <p className={`mt-2 text-xs leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
            {lang === "zh"
              ? "这不是意志力的问题。是工程设计的问题。信息流对「想要」的优化，远比对「喜欢」的优化精细得多。"
              : "This is not a willpower problem. It is an engineering problem. The feed has been optimised far more precisely for wanting than for liking."}
          </p>
        </div>
      )}

      {/* DIGITAL_PATTERNS concept cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DIGITAL_PATTERNS.map((p, i) => (
          <div
            key={i}
            className="rounded-lg border border-void-700 bg-void-950/50 p-4 transition-colors hover:border-dawn-500/20"
          >
            <div className={`mb-1 font-mono text-xs font-semibold text-dawn-300 ${lang === "zh" ? "zh" : ""}`}>
              {p.t[lang]}
            </div>
            <p className={`text-xs leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}>
              {p.d[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
