"use client";

import { useState, useCallback } from "react";
import { TRADITIONS, WELLBEING_AXES } from "./content";
import { useLang } from "./lang";

/* ================================================================
   CivilizationsModel — Section 07 · Happiness Across Civilizations
   7-axis radar comparing wellbeing traditions.
   Primary (filled) + optional secondary overlay (outlined).
   ================================================================ */

const N = WELLBEING_AXES.length; // 7
const CX = 200;
const CY = 200;
const R = 138;

/** Cartesian coords on the radar for axis i at value v (0–100). */
function pt(i: number, v: number): [number, number] {
  const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
  const r = (v / 100) * R;
  return [CX + Math.cos(ang) * r, CY + Math.sin(ang) * r];
}

/** Build SVG points string for a tradition's scores. */
function buildPoly(scores: Record<string, number>): string {
  return WELLBEING_AXES.map((ax, i) => pt(i, scores[ax.key] ?? 0).join(",")).join(" ");
}

/** Hex color → rgba string. */
function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* Ring fractions */
const RINGS = [0.25, 0.5, 0.75, 1];

/** Polygon points for a ring on the N-gon radar. */
function ringPoints(f: number): string {
  return WELLBEING_AXES.map((_, i) => {
    const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [CX + Math.cos(ang) * R * f, CY + Math.sin(ang) * R * f].join(",");
  }).join(" ");
}

export default function CivilizationsModel() {
  const { lang } = useLang();

  const [primaryKey, setPrimaryKey] = useState<string>(TRADITIONS[0].key);
  const [secondaryKey, setSecondaryKey] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const primary = TRADITIONS.find((t) => t.key === primaryKey)!;
  const secondary = secondaryKey ? TRADITIONS.find((t) => t.key === secondaryKey) ?? null : null;

  /* Clicking a chip in normal mode → set primary.
     In compare mode → set secondary (unless same as primary → deselect). */
  const handleChipClick = useCallback(
    (key: string) => {
      if (!compareMode) {
        setPrimaryKey(key);
        setSecondaryKey(null);
      } else {
        if (key === primaryKey) return; // can't compare to itself
        setSecondaryKey((prev) => (prev === key ? null : key));
      }
    },
    [compareMode, primaryKey],
  );

  const toggleCompare = () => {
    setCompareMode((v) => {
      if (v) setSecondaryKey(null); // clear comparison when turning off
      return !v;
    });
  };

  const primaryPoly = buildPoly(primary.scores);
  const secondaryPoly = secondary ? buildPoly(secondary.scores) : null;

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* Section header */}
      <div className="mb-1 font-mono text-[0.65rem] tracking-widest text-bone-500 uppercase">
        {lang === "zh" ? (
          <span className="zh">07 · 文明中的幸福</span>
        ) : (
          "07 · Happiness Across Civilizations"
        )}
      </div>
      <h2 className="display mb-1 text-xl font-semibold text-bone-50 md:text-2xl">
        {lang === "zh" ? (
          <span className="zh">五千年里彼此竞争的答案</span>
        ) : (
          "Five thousand years of competing answers"
        )}
      </h2>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-bone-300">
        {lang === "zh" ? (
          <span className="zh">
            每一个传统，都为「美好生活」造了一台不同的机器。选择两种传统，在七轴雷达图上并排比较。
          </span>
        ) : (
          "Every great tradition built a different machine for the good life. Select traditions to compare them across seven axes of wellbeing."
        )}
      </p>

      {/* Tradition selector chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TRADITIONS.map((trad) => {
          const isPrimary = trad.key === primaryKey;
          const isSecondary = trad.key === secondaryKey;
          const active = isPrimary || isSecondary;
          return (
            <button
              key={trad.key}
              onClick={() => handleChipClick(trad.key)}
              style={
                active
                  ? {
                      borderColor: trad.color,
                      backgroundColor: hexAlpha(trad.color, isPrimary ? 0.22 : 0.1),
                      color: trad.color,
                    }
                  : {}
              }
              className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] transition-all duration-200 ${
                active
                  ? "shadow-sm"
                  : "border-dawn-500/20 text-bone-400 hover:border-dawn-400/40 hover:text-bone-200"
              }`}
            >
              <span className={lang === "zh" ? "zh" : ""}>{trad.name[lang]}</span>
              {isPrimary && (
                <span className="ml-1.5 text-[0.58rem] opacity-70">
                  {lang === "zh" ? "主" : "A"}
                </span>
              )}
              {isSecondary && (
                <span className="ml-1.5 text-[0.58rem] opacity-70">
                  {lang === "zh" ? "辅" : "B"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compare toggle */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={toggleCompare}
          className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.68rem] transition-all duration-200 ${
            compareMode
              ? "border-calm-400/50 bg-calm-400/12 text-calm-400"
              : "border-bone-500/25 text-bone-500 hover:border-bone-400/40 hover:text-bone-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full transition-all duration-200 ${compareMode ? "bg-calm-400" : "bg-bone-600"}`}
          />
          <span className={lang === "zh" ? "zh" : ""}>
            {lang === "zh" ? "对比模式" : "Compare mode"}
          </span>
        </button>
        {compareMode && (
          <span className="font-mono text-[0.63rem] text-bone-500">
            {lang === "zh" ? (
              <span className="zh">点击另一传统以叠加对比</span>
            ) : (
              "Click a second tradition to overlay it"
            )}
          </span>
        )}
      </div>

      {/* Main layout: radar left, detail right */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[420px_1fr]">
        {/* ---- Radar ---- */}
        <svg viewBox="0 0 400 400" className="block w-full max-w-[420px]">
          <defs>
            <radialGradient id="civ-bg-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#211726" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0a0608" stopOpacity="0" />
            </radialGradient>
            {/* Primary fill gradient uses primary tradition color */}
            <radialGradient id="civ-primary-fill" cx="50%" cy="50%" r="65%">
              <stop
                offset="0%"
                stopColor={primary.color}
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor={primary.color}
                stopOpacity="0.06"
              />
            </radialGradient>
          </defs>

          {/* Background glow */}
          <circle cx={CX} cy={CY} r={R + 20} fill="url(#civ-bg-glow)" />

          {/* Ring grid */}
          {RINGS.map((f, ri) => (
            <polygon
              key={ri}
              points={ringPoints(f)}
              fill="none"
              stroke="#2e2034"
              strokeWidth={ri === RINGS.length - 1 ? "1" : "0.7"}
              strokeDasharray={ri === RINGS.length - 1 ? undefined : "3 3"}
            />
          ))}

          {/* Ring value labels (25 / 50 / 75) */}
          {[0.25, 0.5, 0.75].map((f) => (
            <text
              key={f}
              x={CX + 3}
              y={CY - R * f - 2}
              textAnchor="start"
              fontSize="7"
              fill="#2e2034"
              fontFamily="Space Mono, monospace"
            >
              {Math.round(f * 100)}
            </text>
          ))}

          {/* Spokes + axis labels */}
          {WELLBEING_AXES.map((ax, i) => {
            const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
            const ex = CX + Math.cos(ang) * R;
            const ey = CY + Math.sin(ang) * R;
            const labelR = R + 24;
            const lx = CX + Math.cos(ang) * labelR;
            const ly = CY + Math.sin(ang) * labelR;
            const cosA = Math.cos(ang);
            const anchor =
              Math.abs(cosA) < 0.25 ? "middle" : cosA > 0 ? "start" : "end";
            return (
              <g key={ax.key}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={ex}
                  y2={ey}
                  stroke="#211726"
                  strokeWidth="0.9"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={lang === "zh" ? "9.5" : "8.5"}
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
                  fill="#a08a82"
                  className={lang === "zh" ? "zh" : ""}
                >
                  {ax.label[lang]}
                </text>
              </g>
            );
          })}

          {/* Secondary overlay (outlined, dashed, behind primary) */}
          {secondaryPoly && secondary && (
            <>
              <polygon
                points={secondaryPoly}
                fill={hexAlpha(secondary.color, 0.08)}
                stroke={secondary.color}
                strokeWidth="1.8"
                strokeDasharray="5 3"
                strokeOpacity="0.75"
                style={{ transition: "all 0.35s ease" }}
              />
              {WELLBEING_AXES.map((ax, i) => {
                const [px, py] = pt(i, secondary.scores[ax.key] ?? 0);
                return (
                  <circle
                    key={ax.key}
                    cx={px}
                    cy={py}
                    r="3"
                    fill={secondary.color}
                    fillOpacity="0.55"
                    stroke={secondary.color}
                    strokeWidth="1"
                  />
                );
              })}
            </>
          )}

          {/* Primary polygon (filled, solid) */}
          <polygon
            points={primaryPoly}
            fill="url(#civ-primary-fill)"
            stroke={primary.color}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ transition: "all 0.35s ease" }}
          />
          {WELLBEING_AXES.map((ax, i) => {
            const [px, py] = pt(i, primary.scores[ax.key] ?? 0);
            return (
              <circle
                key={ax.key}
                cx={px}
                cy={py}
                r="3.5"
                fill={primary.color}
                style={{ transition: "all 0.35s ease" }}
              />
            );
          })}

          {/* Centre label */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize="11.5"
            fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
            fill={primary.color}
            fontWeight="600"
            className={lang === "zh" ? "zh" : ""}
            style={{ transition: "fill 0.35s ease" }}
          >
            {primary.name[lang]}
          </text>
          {secondary && (
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="9"
              fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
              fill={secondary.color}
              fillOpacity="0.75"
              className={lang === "zh" ? "zh" : ""}
              style={{ transition: "fill 0.35s ease" }}
            >
              {lang === "zh" ? "对比：" : "vs "}
              {secondary.name[lang]}
            </text>
          )}
        </svg>

        {/* ---- Tradition detail panel ---- */}
        <div className="flex flex-col gap-6">
          {/* Primary detail */}
          <TraditionCard tradition={primary} lang={lang} badge="A" />

          {/* Secondary detail (when comparing) */}
          {secondary && (
            <>
              <div className="rule-warm" />
              <TraditionCard tradition={secondary} lang={lang} badge="B" />
            </>
          )}

          {/* Axis score table — primary vs secondary */}
          <div>
            <div className="label-mono mb-3">
              {lang === "zh" ? (
                <span className="zh">七轴对照</span>
              ) : (
                "Seven-axis breakdown"
              )}
            </div>
            <div className="space-y-2">
              {WELLBEING_AXES.map((ax) => {
                const scoreA = primary.scores[ax.key] ?? 0;
                const scoreB = secondary ? (secondary.scores[ax.key] ?? 0) : null;
                return (
                  <div key={ax.key}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span
                        className={`font-mono text-[0.64rem] text-bone-400 ${lang === "zh" ? "zh" : ""}`}
                      >
                        {ax.label[lang]}
                      </span>
                      <span className="font-mono text-[0.64rem] text-bone-500">
                        {scoreA}
                        {scoreB !== null && (
                          <span style={{ color: secondary!.color }}>
                            {" "}/ {scoreB}
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-void-700">
                      {/* Primary bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                          width: `${scoreA}%`,
                          backgroundColor: primary.color,
                          opacity: 0.75,
                        }}
                      />
                      {/* Secondary bar (overlay, slightly thinner) */}
                      {scoreB !== null && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                          style={{
                            width: `${scoreB}%`,
                            backgroundColor: secondary!.color,
                            opacity: 0.45,
                            height: "50%",
                            top: "25%",
                          }}
                        />
                      )}
                    </div>
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

/* ---- Internal: Tradition detail card ---- */
type TraditionCardProps = {
  tradition: (typeof TRADITIONS)[number];
  lang: "en" | "zh";
  badge: "A" | "B";
};

function TraditionCard({ tradition, lang, badge }: TraditionCardProps) {
  return (
    <div className="card relative pl-4" style={{ borderLeftColor: tradition.color }}>
      {/* Badge */}
      <span
        className="absolute -left-3 top-0 flex h-5 w-5 items-center justify-center rounded-full font-mono text-[0.6rem] font-bold"
        style={{ backgroundColor: tradition.color, color: "#0a0608" }}
      >
        {badge}
      </span>

      {/* Name + era */}
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={`font-semibold text-base ${lang === "zh" ? "zh" : ""}`}
          style={{ color: tradition.color }}
        >
          {tradition.name[lang]}
        </span>
        <span className={`font-mono text-[0.64rem] text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
          {tradition.era[lang]}
        </span>
      </div>

      {/* Aim */}
      <div className="mt-2">
        <span className="label-mono mr-2">
          {lang === "zh" ? <span className="zh">目标</span> : "Aim"}
        </span>
        <span
          className={`text-sm font-medium text-bone-200 ${lang === "zh" ? "zh" : ""}`}
        >
          {tradition.aim[lang]}
        </span>
      </div>

      {/* Path */}
      <div className="mt-1.5">
        <span className="label-mono mr-2">
          {lang === "zh" ? <span className="zh">路径</span> : "Path"}
        </span>
        <span
          className={`text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}
        >
          {tradition.path[lang]}
        </span>
      </div>

      {/* Idea */}
      <p
        className={`mt-2 border-l border-bone-500/20 pl-3 text-sm italic leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}
      >
        {tradition.idea[lang]}
      </p>
    </div>
  );
}
