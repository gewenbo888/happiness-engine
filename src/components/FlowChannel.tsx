"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useLang } from "./lang";
import type { Bi } from "./lang";

/* ============================================================
   FlowChannel — Csíkszentmihályi's challenge × skill plane.
   Draggable dot; the active psychological state updates live.
   The Flow band breathes when the dot enters it.
   Canvas-2D + SVG only. No external packages.
   ============================================================ */

type Zone = {
  key: string;
  name: Bi;
  desc: Bi;
  tip: Bi;
  color: string;         // fill for region
  textColor: string;
  /** Returns true if (nx, ny) in [0,1] × [0,1] belongs to this zone.
   *  Coordinates: nx = skill (left→right), ny = challenge (bottom→top). */
  test: (nx: number, ny: number) => boolean;
};

/* — Zone geometry —
   The plane is unit square: nx ∈ [0,1] = skill, ny ∈ [0,1] = challenge.
   Flow diagonal: skill ≈ challenge (within ±0.13 band) & both > 0.38.
   Regions are tested in priority order (first match wins).                */

const ZONES: Zone[] = [
  {
    key: "flow",
    name: { en: "Flow", zh: "心流" },
    desc: {
      en: "Challenge matches skill. The self quiets, time bends, and attention narrows to a single luminous thread. This is the diagonal of joy.",
      zh: "挑战与技能匹配。自我安静，时间弯折，注意力收束成一根明亮的线。这是喜悦的对角线。",
    },
    tip: {
      en: "You are in flow. Stay here. Stretch slowly — let the challenge grow just ahead of the skill.",
      zh: "你正处于心流。留在这里。缓缓延伸——让挑战始终比技能稍稍领先一步。",
    },
    color: "rgba(61,214,189,0.18)",
    textColor: "#6ee9d4",
    test: (nx, ny) => {
      const diff = Math.abs(nx - ny);
      return diff < 0.145 && nx > 0.35 && ny > 0.35;
    },
  },
  {
    key: "anxiety",
    name: { en: "Anxiety", zh: "焦虑" },
    desc: {
      en: "The challenge dwarfs the skill. The nervous system is on alert — heart rate up, focus narrows to threat, errors compound.",
      zh: "挑战远超技能。神经系统进入警戒——心率加速，注意力收窄于威胁，错误不断叠加。",
    },
    tip: {
      en: "Lower the stakes, break the task smaller, or build skill deliberately. Every expert was once here.",
      zh: "降低风险，把任务切得更小，或有意识地提升技能。每一位高手，都曾在这里待过。",
    },
    color: "rgba(255,107,129,0.14)",
    textColor: "#ff8c9e",
    test: (nx, ny) => ny - nx > 0.22,
  },
  {
    key: "arousal",
    name: { en: "Arousal", zh: "亢奋" },
    desc: {
      en: "High challenge, moderate skill — the edge of capability. Exciting but draining; flow is close if you push into it.",
      zh: "高挑战，中等技能——能力的边缘。令人兴奋却也消耗精力；若向内推进，心流近在咫尺。",
    },
    tip: {
      en: "You're on the edge. Focus deeply, accept mistakes as data, and let the skill catch up to the challenge.",
      zh: "你在边缘。全神贯注，把错误视为数据，让技能追上挑战的步伐。",
    },
    color: "rgba(255,158,79,0.16)",
    textColor: "#ffb86b",
    test: (nx, ny) => ny > 0.62 && nx > 0.32 && nx <= 0.62,
  },
  {
    key: "worry",
    name: { en: "Worry", zh: "担忧" },
    desc: {
      en: "Low skill, moderate challenge — a nagging sense that the task might exceed you, without the acute alarm of full anxiety.",
      zh: "低技能，中等挑战——一种任务可能超出自己的隐隐感觉，没有完全焦虑时那种急迫的警报。",
    },
    tip: {
      en: "Find a smaller version of the challenge you can reliably succeed at. Stack wins until confidence builds.",
      zh: "找到一个更小的、你能可靠完成的挑战版本。持续积累成功，直到自信建立起来。",
    },
    color: "rgba(255,158,79,0.10)",
    textColor: "#ffd29a",
    test: (nx, ny) => nx < 0.38 && ny > 0.35 && ny <= 0.68,
  },
  {
    key: "apathy",
    name: { en: "Apathy", zh: "冷漠" },
    desc: {
      en: "Low skill, low challenge. Nothing asks anything of you — and nothing rewards. The world goes grey; motivation evaporates.",
      zh: "低技能，低挑战。没有任何事物对你有所要求——也没有任何事物给予回报。世界褪成灰色，动力蒸发殆尽。",
    },
    tip: {
      en: "Find something that actually matters to you — even a tiny, genuine interest. Meaning precedes motivation.",
      zh: "找到某件真正重要的事——哪怕只是一点微小的、真实的兴趣。意义先于动力。",
    },
    color: "rgba(160,138,130,0.12)",
    textColor: "#a08a82",
    test: (nx, ny) => nx < 0.42 && ny < 0.42,
  },
  {
    key: "boredom",
    name: { en: "Boredom", zh: "厌倦" },
    desc: {
      en: "High skill, low challenge. The mind knows it can do more — restlessness rises, focus drifts, effort feels pointless.",
      zh: "高技能，低挑战。心智知道自己能做更多——躁动升起，注意力飘散，努力显得毫无意义。",
    },
    tip: {
      en: "Raise the difficulty. Add a constraint, a tighter deadline, a harder target. Skill without challenge is a sail in dead air.",
      zh: "提高难度。加一条限制、更紧的截止、更高的目标。没有挑战的技能，是无风中的帆。",
    },
    color: "rgba(168,127,255,0.12)",
    textColor: "#c0a3ff",
    test: (nx, ny) => nx > 0.58 && ny < 0.42,
  },
  {
    key: "relaxation",
    name: { en: "Relaxation", zh: "放松" },
    desc: {
      en: "High skill, gently low challenge. The pressure is off; you move through the task with ease. Restorative, but flow is dormant.",
      zh: "高技能，挑战略低。压力消散，你轻松地穿过任务。这是一种恢复性的状态，但心流处于沉睡。",
    },
    tip: {
      en: "Rest here when you need to recover. When ready, nudge the challenge up — flow is just above this.",
      zh: "需要恢复时，在这里休息。准备好时，把挑战稍稍上推——心流就在这之上。",
    },
    color: "rgba(110,233,212,0.10)",
    textColor: "#9af2e3",
    test: (nx, ny) => nx > 0.52 && ny >= 0.32 && ny <= 0.62,
  },
  {
    key: "control",
    name: { en: "Control", zh: "掌控" },
    desc: {
      en: "High skill meets moderate challenge. Competence is effortless; you are on top of the task. Close to flow — raise the bar.",
      zh: "高技能遇上中等挑战。能力游刃有余，你驾驭着任务。接近心流——把标准再提高一些。",
    },
    tip: {
      en: "You have the skill. Now seek more challenge — a harder problem, a higher standard, a creative constraint.",
      zh: "你已具备技能。现在去寻求更多挑战——更难的问题，更高的标准，一个创造性的约束。",
    },
    color: "rgba(61,214,189,0.09)",
    textColor: "#6ee9d4",
    test: () => true, // fallback
  },
];

function classify(nx: number, ny: number): Zone {
  for (const z of ZONES) {
    if (z.test(nx, ny)) return z;
  }
  return ZONES[ZONES.length - 1];
}

/* SVG viewport */
const VP = 400;
const PAD = 42; // room for axis labels
const PLOT = VP - PAD * 2; // 316px of plot area

function toSvg(nx: number, ny: number) {
  return {
    cx: PAD + nx * PLOT,
    cy: PAD + (1 - ny) * PLOT,
  };
}

function toNorm(svgX: number, svgY: number) {
  return {
    nx: Math.max(0, Math.min(1, (svgX - PAD) / PLOT)),
    ny: Math.max(0, Math.min(1, 1 - (svgY - PAD) / PLOT)),
  };
}

/* Region polygon helpers */
type Pt = [number, number]; // [svgX, svgY]

function pts(pairs: Pt[]): string {
  return pairs.map(([nx, ny]) => {
    const { cx, cy } = toSvg(nx, ny);
    return `${cx},${cy}`;
  }).join(" ");
}

// Produce a clipped flow-band polygon (parallelogram along diagonal)
const BAND = 0.145;
const flowPoly: Pt[] = [
  [0.35, 0.35 + BAND],
  [1 - BAND, 1],
  [1, 1],
  [1, 1 - BAND],
  [0.35 + BAND, 0.35],
  [0.35, 0.35],
];

export default function FlowChannel() {
  const { lang } = useLang();
  const svgRef = useRef<SVGSVGElement>(null);

  const [dot, setDot] = useState({ nx: 0.72, ny: 0.75 }); // start in flow
  const [dragging, setDragging] = useState(false);
  const [flowPulse, setFlowPulse] = useState(0); // 0–1 intensity

  const zone = classify(dot.nx, dot.ny);
  const inFlow = zone.key === "flow";

  /* pulse animation when in flow */
  const pulseRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.025;
      pulseRef.current = t;
      if (inFlow) {
        setFlowPulse(0.55 + 0.45 * Math.sin(t * 1.4));
      } else {
        setFlowPulse((p) => Math.max(0, p - 0.04));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inFlow]);

  /* pointer → normalised coords */
  const getSvgNorm = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = VP / rect.width;
    const scaleY = VP / rect.height;
    const svgX = (clientX - rect.left) * scaleX;
    const svgY = (clientY - rect.top) * scaleY;
    return toNorm(svgX, svgY);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const n = getSvgNorm(e.clientX, e.clientY);
    if (n) setDot(n);
  }, [getSvgNorm]);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const n = getSvgNorm(e.clientX, e.clientY);
    if (n) setDot(n);
  }, [dragging, getSvgNorm]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const { cx: dotX, cy: dotY } = toSvg(dot.nx, dot.ny);

  /* grid lines at 25% intervals */
  const gridLines = [0.25, 0.5, 0.75];

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* header */}
      <div className="mb-1 label-mono">
        {lang === "zh" ? "04 · 心流通道 · 拖动圆点，探索心理状态" : "04 · Flow Channel · drag the dot to explore psychological states"}
      </div>
      <p className={`mb-6 text-sm leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "契克森米哈伊的挑战 × 技能模型。技能高、挑战匹配，则心流降临。"
          : "Csíkszentmihályi's challenge × skill model. When skill meets matched challenge, flow arrives."}
      </p>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
        {/* ── SVG plane ── */}
        <div className="relative w-full">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VP} ${VP}`}
            className="block w-full touch-none select-none"
            style={{ cursor: dragging ? "grabbing" : "grab", maxHeight: 520 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              {/* Flow band gradient */}
              <linearGradient id="fc-flow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3dd6bd" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#6ee9d4" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#ffd29a" stopOpacity="0.22" />
              </linearGradient>
              {/* Flow glow filter */}
              <filter id="fc-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Dot glow filter */}
              <filter id="fc-dot-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation={inFlow ? 5 + flowPulse * 6 : 3} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Subtle vignette for the plot area */}
              <radialGradient id="fc-vignette" cx="50%" cy="50%" r="70%">
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(10,6,8,0.45)" />
              </radialGradient>
            </defs>

            {/* ── Plot background ── */}
            <rect
              x={PAD} y={PAD}
              width={PLOT} height={PLOT}
              fill="rgba(33,23,38,0.55)"
              rx="4"
            />

            {/* ── Grid ── */}
            {gridLines.map((f) => {
              const { cx: gx } = toSvg(f, 0);
              const { cy: gy } = toSvg(0, f);
              return (
                <g key={f}>
                  <line x1={gx} y1={PAD} x2={gx} y2={PAD + PLOT} stroke="#2e2034" strokeWidth="0.8" />
                  <line x1={PAD} y1={gy} x2={PAD + PLOT} y2={gy} stroke="#2e2034" strokeWidth="0.8" />
                </g>
              );
            })}

            {/* ── Region fills ── */}
            {/* Apathy — low/low */}
            <polygon
              points={pts([[0, 0], [0.42, 0], [0.42, 0.42], [0, 0.42]])}
              fill="rgba(160,138,130,0.09)"
            />
            {/* Worry — low skill, mid challenge */}
            <polygon
              points={pts([[0, 0.38], [0.38, 0.38], [0.38, 0.68], [0, 0.68]])}
              fill="rgba(255,158,79,0.07)"
            />
            {/* Anxiety — low skill, high challenge */}
            <polygon
              points={pts([[0, 0.62], [0, 1], [0.78, 1], [0.78, 0.78 + 0.12]])}
              fill="rgba(255,107,129,0.10)"
            />
            {/* Arousal — mid skill, high challenge */}
            <polygon
              points={pts([[0.32, 0.62], [0.62, 0.62], [0.62, 1], [0.32, 1]])}
              fill="rgba(255,158,79,0.10)"
            />
            {/* Boredom — high skill, low challenge */}
            <polygon
              points={pts([[0.58, 0], [1, 0], [1, 0.42], [0.58, 0.42]])}
              fill="rgba(168,127,255,0.09)"
            />
            {/* Relaxation — high skill, mid challenge */}
            <polygon
              points={pts([[0.52, 0.32], [1, 0.32], [1, 0.62], [0.52, 0.62]])}
              fill="rgba(110,233,212,0.07)"
            />
            {/* Control — high skill, mod challenge (below flow band) */}
            <polygon
              points={pts([[0.52, 0.42], [1, 0.42], [1, 0.68], [0.52 + 0.16, 0.52]])}
              fill="rgba(61,214,189,0.06)"
            />

            {/* ── Flow band ── */}
            <polygon
              points={pts(flowPoly)}
              fill="url(#fc-flow-grad)"
              filter="url(#fc-glow)"
            />
            {/* Flow band bright center stroke */}
            <line
              x1={toSvg(0.35, 0.35).cx} y1={toSvg(0.35, 0.35).cy}
              x2={toSvg(1, 1).cx} y2={toSvg(1, 1).cy}
              stroke={`rgba(110,233,212,${0.18 + flowPulse * 0.22})`}
              strokeWidth="2.5"
              strokeDasharray="6 5"
            />

            {/* ── Vignette overlay ── */}
            <rect x={PAD} y={PAD} width={PLOT} height={PLOT} fill="url(#fc-vignette)" rx="4" />

            {/* ── Axes ── */}
            {/* X axis — Skill */}
            <line x1={PAD} y1={PAD + PLOT} x2={PAD + PLOT} y2={PAD + PLOT} stroke="#3c2c44" strokeWidth="1.5" />
            {/* Y axis — Challenge */}
            <line x1={PAD} y1={PAD} x2={PAD} y2={PAD + PLOT} stroke="#3c2c44" strokeWidth="1.5" />

            {/* Axis arrow heads */}
            <polygon points={`${PAD + PLOT + 2},${PAD + PLOT} ${PAD + PLOT - 7},${PAD + PLOT - 4} ${PAD + PLOT - 7},${PAD + PLOT + 4}`} fill="#3c2c44" />
            <polygon points={`${PAD},${PAD - 2} ${PAD - 4},${PAD + 8} ${PAD + 4},${PAD + 8}`} fill="#3c2c44" />

            {/* Axis labels */}
            <text
              x={PAD + PLOT / 2}
              y={VP - 7}
              textAnchor="middle"
              fontFamily="Space Mono"
              fontSize="9.5"
              letterSpacing="2"
              fill="#a08a82"
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "技能 →" : "SKILL →"}
            </text>
            <text
              x={11}
              y={PAD + PLOT / 2}
              textAnchor="middle"
              fontFamily="Space Mono"
              fontSize="9.5"
              letterSpacing="2"
              fill="#a08a82"
              transform={`rotate(-90, 11, ${PAD + PLOT / 2})`}
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "↑ 挑战" : "↑ CHALLENGE"}
            </text>

            {/* Axis tick labels */}
            {[
              { val: lang === "zh" ? "低" : "Low", f: 0.08 },
              { val: lang === "zh" ? "高" : "High", f: 0.92 },
            ].map(({ val, f }) => {
              const { cx: tx } = toSvg(f, 0);
              const { cy: ty } = toSvg(0, f);
              return (
                <g key={val + f}>
                  <text x={tx} y={PAD + PLOT + 17} textAnchor="middle" fontFamily="Space Mono" fontSize="7.5" fill="#a08a82" className={lang === "zh" ? "zh" : ""}>{val}</text>
                  <text x={PAD - 6} y={ty + 3} textAnchor="end" fontFamily="Space Mono" fontSize="7.5" fill="#a08a82" className={lang === "zh" ? "zh" : ""}>{val}</text>
                </g>
              );
            })}

            {/* ── Region labels (bilingual) ── */}
            {[
              { key: "apathy",      nx: 0.18, ny: 0.18, name: { en: "Apathy",      zh: "冷漠" } },
              { key: "worry",       nx: 0.16, ny: 0.52, name: { en: "Worry",       zh: "担忧" } },
              { key: "anxiety",     nx: 0.14, ny: 0.87, name: { en: "Anxiety",     zh: "焦虑" } },
              { key: "arousal",     nx: 0.47, ny: 0.88, name: { en: "Arousal",     zh: "亢奋" } },
              { key: "boredom",     nx: 0.79, ny: 0.18, name: { en: "Boredom",     zh: "厌倦" } },
              { key: "relaxation",  nx: 0.78, ny: 0.45, name: { en: "Relaxation",  zh: "放松" } },
              { key: "control",     nx: 0.83, ny: 0.60, name: { en: "Control",     zh: "掌控" } },
            ].map(({ key, nx, ny, name }) => {
              const active = zone.key === key;
              const { cx: lx, cy: ly } = toSvg(nx, ny);
              const z = ZONES.find((z) => z.key === key)!;
              return (
                <text
                  key={key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
                  fontSize={lang === "zh" ? "9" : "7.5"}
                  letterSpacing={lang === "zh" ? "0" : "1.2"}
                  fill={z.textColor}
                  opacity={active ? 1 : 0.48}
                  style={{ transition: "opacity 0.4s" }}
                  className={lang === "zh" ? "zh" : ""}
                >
                  {name[lang]}
                </text>
              );
            })}

            {/* Flow label (inside band) */}
            {(() => {
              const { cx: flx, cy: fly } = toSvg(0.68, 0.72);
              return (
                <g>
                  <text
                    x={flx}
                    y={fly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Fraunces, ui-serif, serif"}
                    fontSize={lang === "zh" ? "13" : "11"}
                    fill={`rgba(110,233,212,${0.7 + flowPulse * 0.3})`}
                    fontWeight="600"
                    style={{ transition: "opacity 0.3s" }}
                    className={lang === "zh" ? "zh" : ""}
                  >
                    {lang === "zh" ? "心流" : "Flow"}
                  </text>
                  {/* subtle glow ring on flow label when active */}
                  {inFlow && (
                    <ellipse
                      cx={flx}
                      cy={fly}
                      rx={lang === "zh" ? 28 : 25}
                      ry={10}
                      fill="none"
                      stroke={`rgba(61,214,189,${0.12 + flowPulse * 0.18})`}
                      strokeWidth="6"
                      filter="url(#fc-glow)"
                    />
                  )}
                </g>
              );
            })()}

            {/* ── Flow ring ── when dot is in flow, an outer breathing ring */}
            {inFlow && (
              <circle
                cx={dotX}
                cy={dotY}
                r={14 + flowPulse * 9}
                fill="none"
                stroke={`rgba(61,214,189,${0.22 + flowPulse * 0.28})`}
                strokeWidth="2"
                filter="url(#fc-glow)"
              />
            )}
            {/* secondary softer ring always in flow */}
            {inFlow && (
              <circle
                cx={dotX}
                cy={dotY}
                r={22 + flowPulse * 14}
                fill="none"
                stroke={`rgba(110,233,212,${0.10 + flowPulse * 0.14})`}
                strokeWidth="3"
                filter="url(#fc-glow)"
              />
            )}

            {/* ── Draggable dot ── */}
            <circle
              cx={dotX}
              cy={dotY}
              r="9"
              fill={zone.color.replace("0.1", "0.4").replace("0.09", "0.4").replace("0.12", "0.4").replace("0.14", "0.4").replace("0.07", "0.4").replace("0.18", "0.4")}
              stroke={zone.textColor}
              strokeWidth={inFlow ? 2 + flowPulse : 1.5}
              filter="url(#fc-dot-glow)"
              style={{ transition: "stroke-width 0.3s" }}
            />
            <circle
              cx={dotX}
              cy={dotY}
              r="4"
              fill={zone.textColor}
              opacity={inFlow ? 0.7 + flowPulse * 0.3 : 0.85}
            />

            {/* crosshair guides (subtle) */}
            <line
              x1={dotX} y1={PAD}
              x2={dotX} y2={PAD + PLOT}
              stroke={zone.textColor}
              strokeWidth="0.5"
              opacity="0.15"
            />
            <line
              x1={PAD} y1={dotY}
              x2={PAD + PLOT} y2={dotY}
              stroke={zone.textColor}
              strokeWidth="0.5"
              opacity="0.15"
            />
          </svg>
        </div>

        {/* ── State panel ── */}
        <div className="flex flex-col gap-5">
          {/* Zone name + coords */}
          <div>
            <div className="label-mono" style={{ color: zone.textColor }}>
              {lang === "zh" ? "当前状态" : "Current state"}
            </div>
            <div
              className={`display mt-2 text-4xl leading-none ${lang === "zh" ? "zh" : ""}`}
              key={zone.key + lang}
              style={{
                color: zone.textColor,
                textShadow: inFlow
                  ? `0 0 18px ${zone.textColor}99, 0 0 54px ${zone.textColor}44`
                  : "none",
                transition: "text-shadow 0.6s",
              }}
            >
              {zone.name[lang]}
            </div>
            <div className="mt-2 flex gap-4 font-mono text-[0.6rem] text-bone-500">
              <span>{lang === "zh" ? "技能" : "Skill"} {Math.round(dot.nx * 100)}%</span>
              <span>{lang === "zh" ? "挑战" : "Challenge"} {Math.round(dot.ny * 100)}%</span>
            </div>
          </div>

          {/* Description */}
          <div className="card rounded-xl p-4">
            <div className="label-mono" style={{ color: zone.textColor }}>
              {lang === "zh" ? "状态特征" : "State quality"}
            </div>
            <p
              key={zone.key + "desc" + lang}
              className={`mt-3 text-sm leading-relaxed text-bone-200 lang-fade ${lang === "zh" ? "zh" : ""}`}
            >
              {zone.desc[lang]}
            </p>
          </div>

          {/* Tip */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: `${zone.textColor}28`, background: `${zone.textColor}09` }}
          >
            <div className="label-mono" style={{ color: zone.textColor }}>
              {lang === "zh" ? "通往心流" : "Path to flow"}
            </div>
            <p
              key={zone.key + "tip" + lang}
              className={`mt-3 text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}
            >
              {zone.tip[lang]}
            </p>
          </div>

          {/* Flow indicator bar */}
          <div>
            <div className="flex items-center justify-between">
              <span className="label-mono" style={{ color: inFlow ? "#6ee9d4" : "#a08a82" }}>
                {lang === "zh" ? "心流接近度" : "Flow proximity"}
              </span>
              <span className="font-mono text-[0.6rem] text-bone-500">
                {inFlow ? (lang === "zh" ? "✦ 心流" : "✦ in flow") : `${Math.round(Math.max(0, 1 - Math.abs(dot.nx - dot.ny) / 0.6 - Math.max(0, 0.35 - Math.min(dot.nx, dot.ny)) * 2) * 100)}%`}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-void-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${inFlow
                    ? Math.round(80 + flowPulse * 20)
                    : Math.round(Math.max(0, 1 - Math.abs(dot.nx - dot.ny) / 0.6 - Math.max(0, 0.35 - Math.min(dot.nx, dot.ny)) * 2) * 80)}%`,
                  background: inFlow
                    ? `linear-gradient(90deg, #3dd6bd, #6ee9d4, #ffd29a)`
                    : `linear-gradient(90deg, ${zone.textColor}66, ${zone.textColor})`,
                  boxShadow: inFlow ? `0 0 10px rgba(61,214,189,${0.4 + flowPulse * 0.4})` : "none",
                }}
              />
            </div>
          </div>

          {/* Hint for drag */}
          <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-500/60">
            {lang === "zh" ? "← 拖动左侧圆点以探索状态" : "← drag the dot on the left to explore states"}
          </p>
        </div>
      </div>
    </div>
  );
}
