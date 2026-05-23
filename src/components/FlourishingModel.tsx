"use client";

import { useState } from "react";
import { FLOURISH_DIMS, FLOURISH_PRESETS } from "./content";
import { useLang } from "./lang";

/**
 * The meta-model: an interactive 8-axis radar of human flourishing.
 * Drag the sliders or load an archetype; the polygon, composite score
 * and interpretation update live. Flourishing rewards balance, not peaks —
 * so the score penalises lopsided profiles.
 */
export default function FlourishingModel() {
  const { lang } = useLang();
  const [vals, setVals] = useState<number[]>(FLOURISH_PRESETS[4].values.slice());
  const [active, setActive] = useState<string>("flourishing");

  const n = FLOURISH_DIMS.length;
  const cx = 210;
  const cy = 210;
  const R = 150;

  const pt = (i: number, val: number) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (val / 100) * R;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  };

  const poly = vals.map((v, i) => pt(i, v).join(",")).join(" ");

  // mean and a balance term — flourishing is coherence, not a single spike
  const mean = vals.reduce((s, v) => s + v, 0) / n;
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const spread = Math.sqrt(variance);
  const score = Math.max(0, Math.round(mean - spread * 0.35));

  const verdict = (() => {
    if (score >= 78) return { en: "Deeply flourishing — coherent across every axis.", zh: "深度繁盛——在每一个轴上都连贯一致。" };
    if (score >= 62) return { en: "Flourishing, with room to balance the weaker axes.", zh: "繁盛，但仍有空间去平衡较弱的轴。" };
    if (score >= 45) return { en: "Getting by — strong somewhere, starved elsewhere.", zh: "勉力维持——某处强健，他处却饥饿。" };
    return { en: "Struggling — the profile is lopsided and thin.", zh: "举步维艰——这幅图谱倾斜而单薄。" };
  })();

  const setOne = (i: number, v: number) => {
    setVals((prev) => {
      const next = prev.slice();
      next[i] = v;
      return next;
    });
    setActive("custom");
  };

  const loadPreset = (key: string) => {
    const p = FLOURISH_PRESETS.find((x) => x.key === key)!;
    setVals(p.values.slice());
    setActive(key);
  };

  const activePreset = FLOURISH_PRESETS.find((x) => x.key === active);

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* presets */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FLOURISH_PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => loadPreset(p.key)}
            className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] transition ${
              active === p.key
                ? "border-transparent bg-dawn-400 text-void-950"
                : "border-dawn-500/25 text-bone-300 hover:text-dawn-300"
            }`}
          >
            <span className={lang === "zh" ? "zh" : ""}>{p.name[lang]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[420px_1fr]">
        {/* radar */}
        <svg viewBox="0 0 420 420" className="block w-full">
          <defs>
            <radialGradient id="flo-fill" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ffd29a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a87fff" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          {/* rings */}
          {[0.25, 0.5, 0.75, 1].map((f, i) => (
            <polygon
              key={i}
              points={FLOURISH_DIMS.map((_, j) => {
                const ang = (j / n) * Math.PI * 2 - Math.PI / 2;
                return [cx + Math.cos(ang) * R * f, cy + Math.sin(ang) * R * f].join(",");
              }).join(" ")}
              fill="none"
              stroke="#2e2034"
              strokeWidth="0.8"
            />
          ))}
          {/* spokes + labels */}
          {FLOURISH_DIMS.map((d, i) => {
            const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
            const ex = cx + Math.cos(ang) * R;
            const ey = cy + Math.sin(ang) * R;
            const lx = cx + Math.cos(ang) * (R + 26);
            const ly = cy + Math.sin(ang) * (R + 26);
            return (
              <g key={i}>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#211726" strokeWidth="0.8" />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={Math.abs(Math.cos(ang)) < 0.3 ? "middle" : Math.cos(ang) > 0 ? "start" : "end"}
                  dominantBaseline="middle"
                  fontFamily="Space Mono"
                  fontSize="8.5"
                  fill={d.color}
                >
                  <tspan className={lang === "zh" ? "zh" : ""}>{d.label[lang]}</tspan>
                </text>
              </g>
            );
          })}
          {/* data polygon */}
          <polygon points={poly} fill="url(#flo-fill)" stroke="#ffb86b" strokeWidth="2" />
          {vals.map((v, i) => {
            const [px, py] = pt(i, v);
            return <circle key={i} cx={px} cy={py} r="3.5" fill={FLOURISH_DIMS[i].color} />;
          })}
          {/* centre score */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="Fraunces" fontSize="40" fill="#ffd29a" fontWeight="600">
            {score}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="Space Mono" fontSize="8" fill="#a08a82" letterSpacing="2">
            FLOURISHING
          </text>
        </svg>

        {/* controls */}
        <div>
          <div className="label-mono">{lang === "zh" ? "繁盛指数 · 平衡胜于尖峰" : "Flourishing index · balance beats peaks"}</div>
          <p className={`mt-2 text-sm leading-relaxed text-bone-200 ${lang === "zh" ? "zh" : ""}`}>
            {verdict[lang]}
          </p>
          {activePreset && active !== "custom" && (
            <p className={`mt-1 text-xs italic leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
              {activePreset.note[lang]}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {FLOURISH_DIMS.map((d, i) => (
              <div key={d.key}>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[0.66rem] ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: d.color }}
                    title={d.desc[lang]}
                  >
                    {d.label[lang]}
                  </span>
                  <span className="font-mono text-[0.66rem] text-bone-500">{vals[i]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={vals[i]}
                  onChange={(e) => setOne(i, Number(e.target.value))}
                  className="mt-1 w-full"
                  style={{ accentColor: d.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
