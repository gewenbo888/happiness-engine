"use client";

import { useState, useId } from "react";
import { SUFFER_LENSES, STRESSORS } from "./content";
import { useLang, T } from "./lang";

/**
 * The Second Arrow Lab — interactive contemplative explorer.
 * The first arrow is unavoidable pain; the second is the suffering
 * we add ourselves through resistance and story. Five traditions
 * converge on the same insight: between event and response lives a gap,
 * and freedom lives there. Choose a stressor, then choose a lens —
 * watch the second arrow shrink as the tradition works on it.
 */
export default function SufferingLab() {
  const { lang } = useLang();
  const svgId = useId().replace(/:/g, "");

  const [stressorKey, setStressorKey] = useState<string | null>(null);
  const [lensKey, setLensKey] = useState<string | null>(null);

  const stressor = STRESSORS.find((s) => s.key === stressorKey) ?? null;
  const lens = SUFFER_LENSES.find((l) => l.key === lensKey) ?? null;

  // Second-arrow intensity: 1 = full suffering, 0 = dissolved
  // No stressor selected → neutral. Stressor + no lens → full (1.0). With lens → softened (0.2).
  const arrowIntensity = stressor === null ? 0.7 : lens === null ? 1.0 : 0.2;
  const lensColor = lens?.color ?? "#a08a82";

  // ── SVG geometry ──────────────────────────────────────────────
  const W = 340;
  const H = 220;
  // Target: a calm concentric ring in the centre
  const tx = W / 2;
  const ty = H / 2 + 10;
  // Arrow shaft endpoints — first arrow comes from upper-left, second from upper-right
  const fa = { x1: 40, y1: 20, x2: tx - 18, y2: ty - 16 };
  const sa = { x1: W - 40, y1: 20, x2: tx + 18, y2: ty - 16 };

  // Second arrow shrinks: tip approaches but retreats proportionally
  const saLerped = {
    x1: sa.x1,
    y1: sa.y1,
    x2: sa.x1 + (sa.x2 - sa.x1) * arrowIntensity,
    y2: sa.y1 + (sa.y2 - sa.y1) * arrowIntensity,
  };

  // Arrowhead helper — returns SVG points for a small triangle
  function arrowhead(
    x1: number, y1: number, x2: number, y2: number, size: number
  ): string {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const bx = x2 - ux * size;
    const by = y2 - uy * size;
    return [
      `${x2},${y2}`,
      `${bx + px * size * 0.45},${by + py * size * 0.45}`,
      `${bx - px * size * 0.45},${by - py * size * 0.45}`,
    ].join(" ");
  }

  const faHead = arrowhead(fa.x1, fa.y1, fa.x2, fa.y2, 10);
  const saHead = arrowhead(
    saLerped.x1, saLerped.y1,
    saLerped.x2, saLerped.y2,
    10 * arrowIntensity
  );

  const secondArrowOpacity = 0.25 + arrowIntensity * 0.75;
  const gradId = `sa-grad-${svgId}`;
  const targetGradId = `tgt-grad-${svgId}`;
  const glowId = `sa-glow-${svgId}`;

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">

      {/* ── Header ── */}
      <div className="label-mono mb-1">
        {lang === "zh" ? "第二支箭实验室" : "The second arrow lab"}
      </div>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "The first arrow is the pain life fires at us — unavoidable. The second is the suffering we add: the resistance, the story, the why-me. Every contemplative tradition discovered the same gap between event and response. Choose a wound, then apply a lens.",
            zh: "第一支箭，是生活向我们射来的痛——无可回避。第二支，是我们自己添上的苦：抗拒、故事、「为什么偏偏是我」。每一个修行传统，都发现了同一道缝隙，存在于事件与回应之间。选择一道伤口，再选一副镜片。",
          }}
        />
      </p>

      <div className="rule-warm my-5" />

      {/* ── Step 1: Choose stressor ── */}
      <div className="mb-5">
        <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-dawn-400">
          {lang === "zh" ? "01 · 第一支箭 — 选择一道痛" : "01 · First arrow — choose a wound"}
        </div>
        <div className="flex flex-wrap gap-2">
          {STRESSORS.map((s) => {
            const active = stressorKey === s.key;
            return (
              <button
                key={s.key}
                onClick={() => {
                  setStressorKey(active ? null : s.key);
                  if (active) setLensKey(null);
                }}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 font-mono text-[0.68rem] transition-all duration-300 ${
                  active
                    ? "border-rose-500/60 bg-rose-500/15 text-rose-400 shadow-[0_0_16px_-4px_rgba(255,107,129,0.4)]"
                    : "border-dawn-500/20 text-bone-300 hover:border-dawn-500/45 hover:text-dawn-300"
                }`}
              >
                <span className={lang === "zh" ? "zh" : ""}>{s.label[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SVG visualization ── */}
      <div className="my-6 overflow-hidden rounded-lg border border-void-700/60 bg-void-950/70">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          aria-label={
            lang === "zh"
              ? "两支箭示意图：第一支击中目标，第二支代表我们自添的苦"
              : "Two arrows diagram: the first hits the target, the second is the suffering we add"
          }
        >
          <defs>
            {/* Second arrow gradient — shifts to lens color when a lens is active */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={lensColor} stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ff6b81" stopOpacity={0.7} />
            </linearGradient>
            {/* Target fill gradient */}
            <radialGradient id={targetGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd29a" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a87fff" stopOpacity="0.04" />
            </radialGradient>
            {/* Glow filter for second arrow */}
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow rings around target */}
          {[32, 22, 13].map((r, i) => (
            <circle
              key={i}
              cx={tx}
              cy={ty}
              r={r}
              fill="none"
              stroke="rgba(255,184,107,0.10)"
              strokeWidth={i === 0 ? 0.8 : i === 1 ? 1.2 : 1.6}
            />
          ))}
          <circle cx={tx} cy={ty} r={13} fill={`url(#${targetGradId})`} />
          <circle
            cx={tx}
            cy={ty}
            r={5}
            fill={stressor ? "#ff6b81" : "#a08a82"}
            opacity={stressor ? 0.85 : 0.35}
            style={{ transition: "fill 0.55s ease, opacity 0.55s ease" }}
          />

          {/* Target label */}
          <text
            x={tx}
            y={ty + 42}
            textAnchor="middle"
            fontFamily="Space Mono"
            fontSize="7.5"
            letterSpacing="1.8"
            fill="rgba(160,138,130,0.6)"
            textDecoration="none"
          >
            <tspan className={lang === "zh" ? "zh" : ""}>{lang === "zh" ? "你" : "YOU"}</tspan>
          </text>

          {/* ── First arrow (always present once stressor chosen, static) ── */}
          {stressor && (
            <g>
              <line
                x1={fa.x1}
                y1={fa.y1}
                x2={fa.x2}
                y2={fa.y2}
                stroke="#ff6b81"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.88"
              />
              <polygon
                points={faHead}
                fill="#ff6b81"
                opacity="0.88"
              />
              {/* Label */}
              <text
                x={fa.x1 - 4}
                y={fa.y1 - 8}
                fontFamily="Space Mono"
                fontSize="6.5"
                letterSpacing="1.5"
                fill="#ff8c9e"
                opacity="0.8"
              >
                <tspan className={lang === "zh" ? "zh" : ""}>
                  {lang === "zh" ? "第一支箭" : "FIRST ARROW"}
                </tspan>
              </text>
            </g>
          )}

          {/* ── Second arrow (shrinks with lens application) ── */}
          {stressor && (
            <g
              opacity={secondArrowOpacity}
              filter={`url(#${glowId})`}
              style={{ transition: "opacity 0.7s ease" }}
            >
              <line
                x1={saLerped.x1}
                y1={saLerped.y1}
                x2={saLerped.x2}
                y2={saLerped.y2}
                stroke={`url(#${gradId})`}
                strokeWidth={2.5 * arrowIntensity + 0.5}
                strokeLinecap="round"
                style={{ transition: "stroke-width 0.7s ease" }}
              />
              {arrowIntensity > 0.12 && (
                <polygon
                  points={saHead}
                  fill={lensColor}
                  style={{ transition: "fill 0.6s ease" }}
                />
              )}
              {/* Label */}
              <text
                x={saLerped.x1 + 4}
                y={saLerped.y1 - 8}
                fontFamily="Space Mono"
                fontSize="6.5"
                letterSpacing="1.5"
                fill={lensColor}
                opacity="0.85"
                style={{ transition: "fill 0.6s ease" }}
              >
                <tspan className={lang === "zh" ? "zh" : ""}>
                  {lang === "zh" ? "第二支箭" : "SECOND ARROW"}
                </tspan>
              </text>
            </g>
          )}

          {/* ── Idle state hint ── */}
          {!stressor && (
            <text
              x={W / 2}
              y={H / 2 - 10}
              textAnchor="middle"
              fontFamily="Space Mono"
              fontSize="8"
              letterSpacing="1.8"
              fill="rgba(160,138,130,0.4)"
            >
              <tspan className={lang === "zh" ? "zh" : ""}>
                {lang === "zh" ? "选择一道痛以开始" : "select a wound to begin"}
              </tspan>
            </text>
          )}

          {/* ── Meter bar: suffering added ── */}
          {stressor && (
            <g>
              <text
                x={12}
                y={H - 22}
                fontFamily="Space Mono"
                fontSize="6.5"
                letterSpacing="1.3"
                fill="rgba(160,138,130,0.55)"
              >
                <tspan className={lang === "zh" ? "zh" : ""}>
                  {lang === "zh" ? "添加的苦" : "SUFFERING ADDED"}
                </tspan>
              </text>
              <rect
                x={12}
                y={H - 14}
                width={W - 24}
                height={4}
                rx={2}
                fill="rgba(255,107,129,0.12)"
              />
              <rect
                x={12}
                y={H - 14}
                width={(W - 24) * arrowIntensity}
                height={4}
                rx={2}
                fill={lensColor}
                opacity={0.72}
                style={{ transition: "width 0.75s cubic-bezier(0.34,1.3,0.64,1), fill 0.6s ease" }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* ── First arrow card ── */}
      {stressor && (
        <div className="card mb-5 rounded-lg p-4 rise">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="font-mono text-[0.62rem] uppercase tracking-widest text-rose-400">
              {lang === "zh" ? "第一支箭 · 不可避免的痛" : "First arrow · unavoidable pain"}
            </span>
          </div>
          <p className={`text-sm leading-relaxed text-bone-100 ${lang === "zh" ? "zh" : ""}`}>
            <T v={stressor.firstArrow} />
          </p>
          <p className={`mt-1.5 text-xs italic text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
            <T
              v={{
                en: "This is the first arrow — the raw fact. It hurts because it matters. That is not the problem.",
                zh: "这是第一支箭——赤裸的事实。它之所以痛，是因为它重要。这不是问题所在。",
              }}
            />
          </p>
        </div>
      )}

      {/* ── Step 2: Choose lens ── */}
      {stressor && (
        <div className="mb-5">
          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-calm-500">
            {lang === "zh"
              ? "02 · 选择一副镜片 — 缩小第二支箭"
              : "02 · Apply a lens — shrink the second arrow"}
          </div>
          <div className="flex flex-wrap gap-2">
            {SUFFER_LENSES.map((l) => {
              const active = lensKey === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => setLensKey(active ? null : l.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 font-mono text-[0.68rem] transition-all duration-300 ${
                    active
                      ? "border-transparent text-void-950"
                      : "border-dawn-500/20 text-bone-300 hover:text-dawn-300 hover:border-dawn-500/40"
                  }`}
                  style={
                    active
                      ? { backgroundColor: l.color, boxShadow: `0 0 18px -4px ${l.color}88` }
                      : {}
                  }
                >
                  <span className={lang === "zh" ? "zh" : ""}>{l.name[lang]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Lens reframe card ── */}
      {stressor && lens && (
        <div
          className="rounded-lg border p-5 rise"
          style={{
            borderColor: `${lens.color}30`,
            backgroundColor: `${lens.color}0a`,
          }}
        >
          {/* Tradition + stance */}
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className={`display text-base font-semibold ${lang === "zh" ? "zh" : ""}`}
              style={{ color: lens.color }}
            >
              {lens.name[lang]}
            </span>
            <span
              className={`font-mono text-[0.68rem] uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
              style={{ color: `${lens.color}bb` }}
            >
              {lens.stance[lang]}
            </span>
          </div>

          <div className="rule-warm mb-4" style={{ opacity: 0.5 }} />

          {/* The reframe */}
          <p className={`text-sm leading-[1.85] text-bone-100 ${lang === "zh" ? "zh" : ""}`}>
            <T v={lens.reframe} />
          </p>

          {/* Second arrow shrinkage annotation */}
          <div className="mt-4 flex items-center gap-2.5">
            <div
              className="h-1 w-16 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${lens.color}88, ${lens.color}22)`,
              }}
            />
            <span className={`text-xs text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
              <T
                v={{
                  en: "Second arrow reduced — the event remains; the added suffering softens.",
                  zh: "第二支箭已缩小——事件犹在；自添的苦，已然柔化。",
                }}
              />
            </span>
          </div>
        </div>
      )}

      {/* ── Prompt when stressor chosen but no lens ── */}
      {stressor && !lens && (
        <div className="rounded-lg border border-void-700/50 bg-void-800/40 p-4">
          <p className={`text-sm italic leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
            <T
              v={{
                en: "The second arrow is flying. The traditions above each found a different way to still it — not to deny the wound, but to refuse the extra suffering. Choose one to see how.",
                zh: "第二支箭正在飞行。上面各个传统，各自找到了不同的方式来平息它——不是否认伤口，而是拒绝那额外的苦。选择其中一种，看看它如何做到。",
              }}
            />
          </p>
        </div>
      )}

      {/* ── Closing contemplation ── */}
      <div className="rule-warm mt-6 mb-4" />
      <p className={`max-w-2xl text-xs italic leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom. — Viktor Frankl",
            zh: "在刺激与回应之间，存在一道缝隙。那道缝隙，是我们选择回应的力量所在。而在我们的回应之中，藏着我们的成长与自由。——维克多·弗兰克尔",
          }}
        />
      </p>
    </div>
  );
}
