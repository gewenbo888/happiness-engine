"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { EMOTIONS } from "./content";
import type { Emotion } from "./content";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ============================================================
   EmotionMap — Russell's Valence–Arousal Circumplex
   Interactive draggable indicator; live state readout.
   Canvas-2D / SVG only, no Three.js, no new packages.
   ============================================================ */

// ── Quadrant config ──────────────────────────────────────────
type QuadrantKey = "ha-hp" | "la-hp" | "ha-up" | "la-up";

interface Quadrant {
  key: QuadrantKey;
  fill: string;
  neuro: Bi;
}

const QUADRANTS: Quadrant[] = [
  {
    key: "ha-hp",
    fill: "rgba(255,158,79,0.07)",
    neuro: {
      en: "Dopamine + endorphins — the chemistry of pursuit and reward.",
      zh: "多巴胺 + 内啡肽——追逐与奖赏的化学。",
    },
  },
  {
    key: "la-hp",
    fill: "rgba(61,214,189,0.07)",
    neuro: {
      en: "Serotonin + oxytocin — safety, contentment, and bonding.",
      zh: "血清素 + 催产素——安全感、知足与联结。",
    },
  },
  {
    key: "ha-up",
    fill: "rgba(255,107,129,0.07)",
    neuro: {
      en: "Cortisol + adrenaline — the stress response activated.",
      zh: "皮质醇 + 肾上腺素——应激反应被激活。",
    },
  },
  {
    key: "la-up",
    fill: "rgba(168,127,255,0.07)",
    neuro: {
      en: "Low dopamine, low energy — the body conserving and withdrawing.",
      zh: "低多巴胺、低能量——身体在收缩与保存。",
    },
  },
];

// ── SVG layout constants ─────────────────────────────────────
const VB = 480; // viewBox size (square)
const PAD = 52; // padding from edge to axis endpoint
const PLOT_MIN = PAD;
const PLOT_MAX = VB - PAD;
const PLOT_SIZE = PLOT_MAX - PLOT_MIN;
const CX = VB / 2;
const CY = VB / 2;

// map valence/arousal (-100..100) → SVG coordinates
function toSvg(valence: number, arousal: number): [number, number] {
  const x = PLOT_MIN + ((valence + 100) / 200) * PLOT_SIZE;
  const y = PLOT_MAX - ((arousal + 100) / 200) * PLOT_SIZE; // invert Y
  return [x, y];
}

// map SVG coords → valence/arousal
function fromSvg(x: number, y: number): [number, number] {
  const valence = ((x - PLOT_MIN) / PLOT_SIZE) * 200 - 100;
  const arousal = ((PLOT_MAX - y) / PLOT_SIZE) * 200 - 100;
  return [valence, arousal];
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// Euclidean distance in valence–arousal space
function dist(e: Emotion, valence: number, arousal: number): number {
  return Math.hypot(e.valence - valence, e.arousal - arousal);
}

// Derive quadrant key from valence + arousal
function quadrantOf(valence: number, arousal: number): QuadrantKey {
  if (arousal >= 0 && valence >= 0) return "ha-hp";
  if (arousal < 0 && valence >= 0) return "la-hp";
  if (arousal >= 0 && valence < 0) return "ha-up";
  return "la-up";
}

// Labels for each quadrant corner (inside the plane)
const Q_LABELS: Record<QuadrantKey, Bi> = {
  "ha-hp": { en: "Active joy", zh: "活跃喜悦" },
  "la-hp": { en: "Peaceful ease", zh: "宁静自在" },
  "ha-up": { en: "Stressed alert", zh: "压力警觉" },
  "la-up": { en: "Withdrawn low", zh: "退缩低落" },
};

// ── Glow filter id unique to this component ──────────────────
const FILTER_ID = "em-glow";
const DRAG_FILTER_ID = "em-drag-glow";

// ── Component ────────────────────────────────────────────────
export default function EmotionMap() {
  const { lang } = useLang();

  // Draggable indicator position in valence–arousal space (start at calm centre-right)
  const [indicator, setIndicator] = useState<[number, number]>([30, -20]);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  // Convert pointer event → SVG user-space coordinate
  const pointerToSvg = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const scaleX = VB / rect.width;
      const scaleY = VB / rect.height;
      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;
      return [
        clamp(svgX, PLOT_MIN, PLOT_MAX),
        clamp(svgY, PLOT_MIN, PLOT_MAX),
      ];
    },
    []
  );

  const updateIndicator = useCallback(
    (clientX: number, clientY: number) => {
      const pt = pointerToSvg(clientX, clientY);
      if (!pt) return;
      const [valence, arousal] = fromSvg(pt[0], pt[1]);
      setIndicator([
        clamp(valence, -100, 100),
        clamp(arousal, -100, 100),
      ]);
    },
    [pointerToSvg]
  );

  // Mouse / pointer handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      isDragging.current = true;
      setDragging(true);
      (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
      updateIndicator(e.clientX, e.clientY);
    },
    [updateIndicator]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging.current) return;
      updateIndicator(e.clientX, e.clientY);
    },
    [updateIndicator]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  // Touch fallback (for browsers that don't support pointer events on SVG well)
  const onTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      updateIndicator(touch.clientX, touch.clientY);
    },
    [updateIndicator]
  );

  // Breathing animation for the indicator ring
  const [breathScale, setBreathScale] = useState(1);
  useEffect(() => {
    let raf: number;
    let t = 0;
    const tick = () => {
      t += 0.03;
      setBreathScale(0.92 + 0.08 * Math.sin(t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Derived state
  const [indValence, indArousal] = indicator;
  const [indX, indY] = toSvg(indValence, indArousal);

  // Nearest emotions (top 2)
  const sorted = [...EMOTIONS].sort(
    (a, b) => dist(a, indValence, indArousal) - dist(b, indValence, indArousal)
  );
  const nearest = sorted[0];
  const second = sorted[1];

  const currentQuadrant = quadrantOf(indValence, indArousal);
  const quadrantData = QUADRANTS.find((q) => q.key === currentQuadrant)!;

  // ── Axis label positions
  const axisLabels = {
    left: [PLOT_MIN - 6, CY],
    right: [PLOT_MAX + 6, CY],
    top: [CX, PLOT_MIN - 8],
    bottom: [CX, PLOT_MAX + 8],
  };

  // ── Label offset so text doesn't overlap the dot
  function labelOffset(e: Emotion): [number, number] {
    const [ex, ey] = toSvg(e.valence, e.arousal);
    const dx = ex - CX;
    const dy = ey - CY;
    const len = Math.hypot(dx, dy) || 1;
    return [(dx / len) * 18, (dy / len) * 14];
  }

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* Section header */}
      <div className="mb-1 label-mono">
        {lang === "zh" ? "情绪地图 · 效价–唤起圆形模型" : "Emotion Map · Valence–Arousal Circumplex"}
      </div>
      <p className="mb-6 text-xs text-bone-500 leading-relaxed">
        {lang === "zh"
          ? "拖动指示器，在效价（愉悦↔不悦）与唤起（高能↔低能）的平面上定位你当下的感受。"
          : "Drag the indicator to locate your current state on the valence (pleasant↔unpleasant) × arousal (high↔low energy) plane."}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── SVG Map ─────────────────────────────────────────── */}
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB} ${VB}`}
            className={`block w-full touch-none select-none rounded-lg ${
              dragging ? "cursor-grabbing" : "cursor-crosshair"
            }`}
            style={{ background: "rgba(15,10,14,0.85)" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchMove={onTouchMove}
          >
            <defs>
              {/* Glow filter for emotion dots */}
              <filter id={FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Stronger glow for draggable indicator */}
              <filter id={DRAG_FILTER_ID} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Radial gradient for the whole pane */}
              <radialGradient id="em-bg" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#211726" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0a0608" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background fill */}
            <rect x={PLOT_MIN} y={PLOT_MIN} width={PLOT_SIZE} height={PLOT_SIZE} fill="url(#em-bg)" rx="4" />

            {/* Quadrant tints */}
            {/* top-right: pleasant/high-arousal → dawn */}
            <rect x={CX} y={PLOT_MIN} width={PLOT_SIZE / 2} height={PLOT_SIZE / 2} fill={QUADRANTS[0].fill} />
            {/* bottom-right: pleasant/low-arousal → calm */}
            <rect x={CX} y={CY} width={PLOT_SIZE / 2} height={PLOT_SIZE / 2} fill={QUADRANTS[1].fill} />
            {/* top-left: unpleasant/high-arousal → rose */}
            <rect x={PLOT_MIN} y={PLOT_MIN} width={PLOT_SIZE / 2} height={PLOT_SIZE / 2} fill={QUADRANTS[2].fill} />
            {/* bottom-left: unpleasant/low-arousal → mind */}
            <rect x={PLOT_MIN} y={CY} width={PLOT_SIZE / 2} height={PLOT_SIZE / 2} fill={QUADRANTS[3].fill} />

            {/* Quadrant corner labels */}
            {(
              [
                ["ha-hp", PLOT_MAX - 4, PLOT_MIN + 12, "end"],
                ["la-hp", PLOT_MAX - 4, PLOT_MAX - 8, "end"],
                ["ha-up", PLOT_MIN + 4, PLOT_MIN + 12, "start"],
                ["la-up", PLOT_MIN + 4, PLOT_MAX - 8, "start"],
              ] as [QuadrantKey, number, number, "start" | "middle" | "end"][]
            ).map(([key, x, y, anchor]) => (
              <text
                key={key}
                x={x}
                y={y}
                textAnchor={anchor}
                fontSize="9"
                fill="#a08a82"
                opacity="0.6"
                fontFamily="Space Mono"
                className={lang === "zh" ? "zh" : ""}
              >
                {Q_LABELS[key][lang]}
              </text>
            ))}

            {/* Grid lines (fine, very subtle) */}
            {[-50, 0, 50].map((v) => {
              const [gx] = toSvg(v, 0);
              const [, gy] = toSvg(0, v);
              return (
                <g key={v}>
                  <line
                    x1={gx}
                    y1={PLOT_MIN}
                    x2={gx}
                    y2={PLOT_MAX}
                    stroke="#2e2034"
                    strokeWidth={v === 0 ? "1.2" : "0.5"}
                    strokeDasharray={v === 0 ? "none" : "3,5"}
                  />
                  <line
                    x1={PLOT_MIN}
                    y1={gy}
                    x2={PLOT_MAX}
                    y2={gy}
                    stroke="#2e2034"
                    strokeWidth={v === 0 ? "1.2" : "0.5"}
                    strokeDasharray={v === 0 ? "none" : "3,5"}
                  />
                </g>
              );
            })}

            {/* Crosshair centre dot */}
            <circle cx={CX} cy={CY} r="2" fill="#2e2034" />

            {/* Axis arrows */}
            {/* X arrow (valence) */}
            <line
              x1={PLOT_MIN - 10}
              y1={CY}
              x2={PLOT_MAX + 10}
              y2={CY}
              stroke="#3a2d44"
              strokeWidth="1"
            />
            <polygon
              points={`${PLOT_MAX + 10},${CY - 4} ${PLOT_MAX + 18},${CY} ${PLOT_MAX + 10},${CY + 4}`}
              fill="#3a2d44"
            />
            {/* Y arrow (arousal) */}
            <line
              x1={CX}
              y1={PLOT_MAX + 10}
              x2={CX}
              y2={PLOT_MIN - 10}
              stroke="#3a2d44"
              strokeWidth="1"
            />
            <polygon
              points={`${CX - 4},${PLOT_MIN - 10} ${CX},${PLOT_MIN - 18} ${CX + 4},${PLOT_MIN - 10}`}
              fill="#3a2d44"
            />

            {/* Axis labels */}
            <text
              x={axisLabels.left[0]}
              y={axisLabels.left[1]}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="9.5"
              fill="#a08a82"
              fontFamily="Space Mono"
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "不悦" : "Unpleasant"}
            </text>
            <text
              x={axisLabels.right[0]}
              y={axisLabels.right[1]}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize="9.5"
              fill="#a08a82"
              fontFamily="Space Mono"
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "愉悦" : "Pleasant"}
            </text>
            <text
              x={axisLabels.top[0]}
              y={axisLabels.top[1]}
              textAnchor="middle"
              dominantBaseline="auto"
              fontSize="9.5"
              fill="#a08a82"
              fontFamily="Space Mono"
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "高唤起" : "High energy"}
            </text>
            <text
              x={axisLabels.bottom[0]}
              y={axisLabels.bottom[1]}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="9.5"
              fill="#a08a82"
              fontFamily="Space Mono"
              className={lang === "zh" ? "zh" : ""}
            >
              {lang === "zh" ? "低唤起" : "Low energy"}
            </text>

            {/* ── Emotion dots ──────────────────────────────── */}
            {EMOTIONS.map((e) => {
              const [ex, ey] = toSvg(e.valence, e.arousal);
              const [lox, loy] = labelOffset(e);
              const isNearest = nearest?.key === e.key;
              const isHovered = hovered === e.key;
              const r = isNearest || isHovered ? 8 : 5.5;

              return (
                <g
                  key={e.key}
                  onPointerEnter={() => setHovered(e.key)}
                  onPointerLeave={() => setHovered(null)}
                  style={{ cursor: "default" }}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={ex}
                    cy={ey}
                    r={r + 6}
                    fill={e.color}
                    opacity={isNearest ? 0.22 : isHovered ? 0.18 : 0.1}
                  />
                  {/* Main dot */}
                  <circle
                    cx={ex}
                    cy={ey}
                    r={r}
                    fill={e.color}
                    opacity={isNearest || isHovered ? 1 : 0.75}
                    filter={`url(#${FILTER_ID})`}
                  />
                  {/* Label */}
                  <text
                    x={ex + lox}
                    y={ey + loy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isNearest || isHovered ? "10.5" : "8.5"}
                    fill={isNearest || isHovered ? e.color : "#a08a82"}
                    fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
                    fontWeight={isNearest ? "600" : "400"}
                    className={lang === "zh" ? "zh" : ""}
                    style={{ pointerEvents: "none" }}
                  >
                    {e.name[lang]}
                  </text>
                </g>
              );
            })}

            {/* ── Draggable indicator ──────────────────────── */}
            {/* Outer breathing ring */}
            <circle
              cx={indX}
              cy={indY}
              r={18 * breathScale}
              fill="none"
              stroke="#ffd29a"
              strokeWidth="1"
              opacity="0.3"
              style={{ pointerEvents: "none" }}
            />
            {/* Mid ring */}
            <circle
              cx={indX}
              cy={indY}
              r={13}
              fill="none"
              stroke="#ffd29a"
              strokeWidth="1.5"
              opacity="0.6"
              style={{ pointerEvents: "none" }}
            />
            {/* Core dot */}
            <circle
              cx={indX}
              cy={indY}
              r={6}
              fill="#ffd29a"
              filter={`url(#${DRAG_FILTER_ID})`}
              style={{ pointerEvents: "none" }}
            />
            {/* Crosshair lines */}
            <line
              x1={indX - 10}
              y1={indY}
              x2={indX + 10}
              y2={indY}
              stroke="#ffd29a"
              strokeWidth="1"
              opacity="0.5"
              style={{ pointerEvents: "none" }}
            />
            <line
              x1={indX}
              y1={indY - 10}
              x2={indX}
              y2={indY + 10}
              stroke="#ffd29a"
              strokeWidth="1"
              opacity="0.5"
              style={{ pointerEvents: "none" }}
            />

            {/* "YOU" label near indicator */}
            <text
              x={indX}
              y={indY - 20}
              textAnchor="middle"
              fontSize="8"
              fill="#ffd29a"
              fontFamily="Space Mono"
              letterSpacing="1.5"
              opacity="0.8"
              style={{ pointerEvents: "none" }}
            >
              {lang === "zh" ? "你" : "YOU"}
            </text>
          </svg>

          {/* Drag hint */}
          <p className="mt-2 text-center text-[0.65rem] text-bone-500/60 font-mono tracking-wide">
            {lang === "zh" ? "点击或拖动 ↕↔ 来定位" : "click or drag ↕↔ to locate yourself"}
          </p>
        </div>

        {/* ── State Readout Panel ──────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Nearest emotion */}
          <div
            className="rounded-xl border p-4 transition-all"
            style={{
              borderColor: nearest ? nearest.color + "44" : "#2e2034",
              background: nearest ? nearest.color + "0d" : "transparent",
            }}
          >
            <div className="label-mono mb-2">
              {lang === "zh" ? "最近情绪" : "Nearest state"}
            </div>
            {nearest && (
              <>
                <div
                  className="display text-2xl font-semibold mb-1"
                  style={{ color: nearest.color }}
                >
                  <span className={lang === "zh" ? "zh" : ""}>{nearest.name[lang]}</span>
                </div>
                <p className={`text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                  {nearest.note[lang]}
                </p>
                {second && second.key !== nearest.key && (
                  <div className="mt-2 pt-2 border-t border-void-700">
                    <span className="text-xs text-bone-500 font-mono">
                      {lang === "zh" ? "次近 · " : "Also near · "}
                    </span>
                    <span
                      className={`text-xs font-semibold ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: second.color }}
                    >
                      {second.name[lang]}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Neurochemistry hint */}
          <div className="rounded-xl border border-mind-500/20 bg-mind-500/5 p-4">
            <div className="label-mono mb-2">
              {lang === "zh" ? "神经化学提示" : "Neurochemistry"}
            </div>
            <p className={`text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
              {quadrantData.neuro[lang]}
            </p>
          </div>

          {/* Coordinate readout */}
          <div className="rounded-xl border border-void-700 bg-void-800/40 p-4">
            <div className="label-mono mb-3">
              {lang === "zh" ? "当前坐标" : "Current coordinates"}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[0.62rem] font-mono text-bone-500 mb-1">
                  {lang === "zh" ? "效价 VALENCE" : "VALENCE"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-void-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${((indValence + 100) / 200) * 100}%`,
                        background:
                          indValence >= 0
                            ? "linear-gradient(90deg,#3dd6bd,#ffb86b)"
                            : "linear-gradient(90deg,#a87fff,#ff6b81)",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[0.7rem] text-bone-300 w-10 text-right">
                    {indValence > 0 ? "+" : ""}{Math.round(indValence)}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[0.62rem] font-mono text-bone-500 mb-1">
                  {lang === "zh" ? "唤起 AROUSAL" : "AROUSAL"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-void-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${((indArousal + 100) / 200) * 100}%`,
                        background:
                          indArousal >= 0
                            ? "linear-gradient(90deg,#ffb86b,#ff6b81)"
                            : "linear-gradient(90deg,#a87fff,#3dd6bd)",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[0.7rem] text-bone-300 w-10 text-right">
                    {indArousal > 0 ? "+" : ""}{Math.round(indArousal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* All emotions mini-list for reference */}
          <div className="rounded-xl border border-void-700 bg-void-800/30 p-4">
            <div className="label-mono mb-3">
              {lang === "zh" ? "情绪索引" : "Emotion index"}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {EMOTIONS.map((e) => {
                const d = dist(e, indValence, indArousal);
                const proximity = Math.max(0, 1 - d / 220);
                return (
                  <div key={e.key} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: e.color,
                        opacity: 0.4 + proximity * 0.6,
                        boxShadow:
                          proximity > 0.6 ? `0 0 6px ${e.color}88` : "none",
                      }}
                    />
                    <span
                      className={`text-[0.68rem] font-mono transition-colors ${
                        lang === "zh" ? "zh" : ""
                      }`}
                      style={{
                        color:
                          proximity > 0.55
                            ? e.color
                            : proximity > 0.3
                            ? "#d9c4b8"
                            : "#a08a82",
                      }}
                    >
                      {e.name[lang]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
