"use client";

import { useState, useId } from "react";
import { FUTURE_SCENARIOS, FLOURISH_DIMS } from "./content";
import { useLang } from "./lang";

const BASELINE = 65;
const N_DIMS = FLOURISH_DIMS.length;

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/** Hex color string -> "r g g" for rgba() usage */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/** Animated horizontal bar for one flourishing dimension */
function DimBar({
  label,
  desc,
  color,
  baseline,
  value,
  lang,
}: {
  label: string;
  desc: string;
  color: string;
  baseline: number;
  value: number;
  lang: "en" | "zh";
}) {
  const delta = value - baseline;
  const pct = value; // 0..100 maps to 0%..100% width

  return (
    <div className="group relative">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span
          className={`truncate font-mono text-[0.63rem] tracking-wide ${lang === "zh" ? "zh" : ""}`}
          style={{ color }}
          title={desc}
        >
          {label}
        </span>
        <span className="shrink-0 font-mono text-[0.63rem]" style={{ color }}>
          {value}
          {delta !== 0 && (
            <span
              className="ml-1 text-[0.58rem]"
              style={{ color: delta > 0 ? "#6ee9d4" : "#ff8c9e" }}
            >
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
        </span>
      </div>
      {/* track */}
      <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-void-700">
        {/* baseline ghost */}
        <div
          className="absolute left-0 top-0 h-full rounded-full opacity-20"
          style={{ width: `${baseline}%`, background: color }}
        />
        {/* live bar */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}bb, ${color})`,
            boxShadow: `0 0 8px 0 ${color}66`,
          }}
        />
        {/* baseline tick */}
        <div
          className="absolute top-0 h-full w-px opacity-50"
          style={{ left: `${baseline}%`, background: color }}
        />
      </div>
    </div>
  );
}

/** Scenario toggle card */
function ScenarioToggle({
  scenario,
  active,
  onToggle,
  lang,
}: {
  scenario: (typeof FUTURE_SCENARIOS)[number];
  active: boolean;
  onToggle: () => void;
  lang: "en" | "zh";
}) {
  const rgb = hexToRgb(scenario.color);
  return (
    <button
      onClick={onToggle}
      className="group w-full rounded-lg border px-3 py-2.5 text-left transition-all duration-300"
      style={{
        borderColor: active ? `${scenario.color}55` : "rgba(255,184,107,0.12)",
        background: active
          ? `rgba(${rgb}, 0.10)`
          : "rgba(33,23,38,0.55)",
        boxShadow: active ? `0 0 18px -6px rgba(${rgb}, 0.35)` : "none",
      }}
      aria-pressed={active}
    >
      <div className="flex items-start gap-2.5">
        {/* toggle orb */}
        <div
          className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: scenario.color,
            background: active ? scenario.color : "transparent",
            boxShadow: active ? `0 0 8px 0 ${scenario.color}99` : "none",
          }}
        />
        <div className="min-w-0 flex-1">
          <div
            className={`font-mono text-[0.65rem] tracking-wider ${lang === "zh" ? "zh" : ""}`}
            style={{ color: scenario.color }}
          >
            {scenario.name[lang]}
          </div>
          <div
            className={`mt-0.5 text-xs leading-snug text-bone-300 ${lang === "zh" ? "zh" : ""}`}
          >
            {scenario.desc[lang]}
          </div>
        </div>
      </div>
    </button>
  );
}

/** Expanded card for active scenario — promise + peril */
function ScenarioDetail({
  scenario,
  lang,
  effects,
}: {
  scenario: (typeof FUTURE_SCENARIOS)[number];
  lang: "en" | "zh";
  effects: Partial<Record<string, number>>;
}) {
  const rgb = hexToRgb(scenario.color);
  return (
    <div
      className="rounded-xl border p-4 rise"
      style={{
        borderColor: `rgba(${rgb}, 0.22)`,
        background: `linear-gradient(145deg, rgba(${rgb}, 0.08), rgba(${rgb}, 0.04) 60%, transparent)`,
      }}
    >
      <div
        className={`display text-base ${lang === "zh" ? "zh" : ""}`}
        style={{ color: scenario.color }}
      >
        {scenario.name[lang]}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* promise */}
        <div>
          <div className="label-mono mb-1" style={{ color: "#6ee9d4" }}>
            {lang === "zh" ? "允诺" : "Promise"}
          </div>
          <p className={`text-xs leading-relaxed text-bone-100 ${lang === "zh" ? "zh" : ""}`}>
            {scenario.promise[lang]}
          </p>
        </div>
        {/* peril */}
        <div>
          <div className="label-mono mb-1" style={{ color: "#ff8c9e" }}>
            {lang === "zh" ? "阴影" : "Shadow"}
          </div>
          <p className={`text-xs leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
            {scenario.peril[lang]}
          </p>
        </div>
      </div>

      {/* dim effect chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(effects)
          .filter(([, v]) => v !== 0)
          .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
          .map(([key, delta]) => {
            const dim = FLOURISH_DIMS.find((d) => d.key === key);
            if (!dim) return null;
            const pos = (delta ?? 0) > 0;
            return (
              <span
                key={key}
                className={`rounded-full border px-2 py-0.5 font-mono text-[0.58rem] tracking-wide ${lang === "zh" ? "zh" : ""}`}
                style={{
                  borderColor: pos ? "#6ee9d480" : "#ff8c9e80",
                  color: pos ? "#6ee9d4" : "#ff8c9e",
                  background: pos ? "rgba(61,214,189,0.08)" : "rgba(255,107,129,0.08)",
                }}
              >
                {pos ? "+" : ""}
                {delta} {dim.label[lang]}
              </span>
            );
          })}
      </div>
    </div>
  );
}

/** 8-axis SVG radar */
function FutureRadar({
  values,
  score,
  lang,
}: {
  values: number[];
  score: number;
  lang: "en" | "zh";
}) {
  const cx = 180;
  const cy = 180;
  const R = 130;
  const n = N_DIMS;
  const gradId = useId();

  const pt = (i: number, val: number): [number, number] => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (val / 100) * R;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  };

  const poly = values.map((v, i) => pt(i, v).join(",")).join(" ");
  const baseline = FLOURISH_DIMS.map((_, i) => pt(i, BASELINE).join(",")).join(" ");

  return (
    <svg viewBox="0 0 360 360" className="block w-full max-w-[340px] mx-auto">
      <defs>
        <radialGradient id={`${gradId}-fill`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd29a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#a87fff" stopOpacity="0.10" />
        </radialGradient>
        <radialGradient id={`${gradId}-base`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd29a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a87fff" stopOpacity="0.03" />
        </radialGradient>
      </defs>

      {/* rings */}
      {[0.25, 0.5, 0.75, 1].map((f, ri) => (
        <polygon
          key={ri}
          points={FLOURISH_DIMS.map((_, j) => {
            const ang = (j / n) * Math.PI * 2 - Math.PI / 2;
            return [cx + Math.cos(ang) * R * f, cy + Math.sin(ang) * R * f].join(",");
          }).join(" ")}
          fill="none"
          stroke={ri === 3 ? "#2e2034" : "#211726"}
          strokeWidth="0.7"
        />
      ))}

      {/* spokes + labels */}
      {FLOURISH_DIMS.map((d, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const ex = cx + Math.cos(ang) * R;
        const ey = cy + Math.sin(ang) * R;
        const lx = cx + Math.cos(ang) * (R + 24);
        const ly = cy + Math.sin(ang) * (R + 24);
        const anchor =
          Math.abs(Math.cos(ang)) < 0.25
            ? "middle"
            : Math.cos(ang) > 0
            ? "start"
            : "end";
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#211726" strokeWidth="0.7" />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
              fontSize={lang === "zh" ? "8" : "7.5"}
              className={lang === "zh" ? "zh" : ""}
              fill={d.color}
            >
              {d.label[lang]}
            </text>
          </g>
        );
      })}

      {/* baseline ghost polygon */}
      <polygon
        points={baseline}
        fill={`url(#${gradId}-base)`}
        stroke="#ffd29a"
        strokeWidth="0.8"
        strokeDasharray="3 4"
        opacity="0.5"
      />

      {/* live polygon */}
      <polygon
        points={poly}
        fill={`url(#${gradId}-fill)`}
        stroke="#ffb86b"
        strokeWidth="1.8"
        style={{ transition: "points 0.5s ease" }}
      />

      {/* dim dots */}
      {values.map((v, i) => {
        const [px, py] = pt(i, v);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r="3"
            fill={FLOURISH_DIMS[i].color}
            style={{ transition: "cx 0.5s ease, cy 0.5s ease" }}
          />
        );
      })}

      {/* centre score */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="38"
        fill="#ffd29a"
        fontWeight="600"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontFamily="Space Mono, monospace"
        fontSize="6.5"
        fill="#a08a82"
        letterSpacing="2"
      >
        {lang === "zh" ? "繁盛指数" : "FLOURISHING"}
      </text>
    </svg>
  );
}

export default function FutureFlourishing() {
  const { lang } = useLang();
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Build effective values
  const values = FLOURISH_DIMS.map((dim) => {
    let v = BASELINE;
    for (const key of active) {
      const s = FUTURE_SCENARIOS.find((x) => x.key === key);
      if (s && s.effects[dim.key] !== undefined) {
        v += s.effects[dim.key] as number;
      }
    }
    return clamp(v);
  });

  // Composite: mean minus imbalance penalty (same formula as FlourishingModel)
  const mean = values.reduce((s, v) => s + v, 0) / N_DIMS;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / N_DIMS;
  const spread = Math.sqrt(variance);
  const score = Math.max(0, Math.round(mean - spread * 0.35));

  const activeScenarios = FUTURE_SCENARIOS.filter((s) => active.has(s.key));

  const verdict = (() => {
    if (active.size === 0)
      return {
        en: "Baseline — the unaugmented human condition.",
        zh: "基线——未经增强的人类处境。",
      };
    if (score >= 78)
      return {
        en: "A coherent flourishing — these scenarios compound well.",
        zh: "一种连贯的繁盛——这些情景相互增益。",
      };
    if (score >= 62)
      return {
        en: "Flourishing, but with hidden shadows worth watching.",
        zh: "繁盛，但隐藏的阴影值得留意。",
      };
    if (score >= 45)
      return {
        en: "Some gains, some cracks — the promise is partial.",
        zh: "有所得，亦有裂缝——允诺是不完整的。",
      };
    return {
      en: "Capability without coherence — raw power, fractured flourishing.",
      zh: "能力有余，连贯不足——原始的力量，破碎的繁盛。",
    };
  })();

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* header */}
      <div className="mb-1 label-mono text-calm-400">
        {lang === "zh" ? "09 — 未来的繁盛" : "09 — Future Flourishing"}
      </div>
      <h2 className={`display text-xl text-dawn-300 mb-1 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "工程化幸福：每份允诺的阴影"
          : "Engineering wellbeing — every promise casts a shadow"}
      </h2>
      <p className={`text-xs text-bone-500 leading-relaxed mb-5 max-w-2xl ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "每个未来技术情景都会改变繁盛图谱。勾选情景——观察允诺如何提升某些维度，阴影如何悄悄侵蚀另一些。繁盛，或许恰恰需要我们正想抹去的那份摩擦。"
          : "Each scenario shifts the flourishing profile. Toggle them on — watch how each promise lifts some dimensions while its shadow quietly drains others. Flourishing may require the very friction we are tempted to remove."}
      </p>

      <div className="rule-warm mb-6" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* left: controls + active detail cards */}
        <div className="space-y-6">
          {/* scenario toggles */}
          <div>
            <div className="label-mono mb-3 text-bone-500">
              {lang === "zh" ? "情景选择" : "Scenario toggles"}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FUTURE_SCENARIOS.map((s) => (
                <ScenarioToggle
                  key={s.key}
                  scenario={s}
                  active={active.has(s.key)}
                  onToggle={() => toggle(s.key)}
                  lang={lang}
                />
              ))}
            </div>
          </div>

          {/* active scenario detail cards */}
          {activeScenarios.length > 0 && (
            <div className="space-y-3">
              <div className="label-mono text-bone-500">
                {lang === "zh" ? "活跃情景详情" : "Active scenarios"}
              </div>
              {activeScenarios.map((s) => (
                <ScenarioDetail
                  key={s.key}
                  scenario={s}
                  lang={lang}
                  effects={s.effects}
                />
              ))}
            </div>
          )}

          {activeScenarios.length === 0 && (
            <div className="rounded-lg border border-dawn-500/10 p-4 text-xs text-bone-500 italic">
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "zh"
                  ? "勾选上方情景，观察繁盛图谱如何随允诺与阴影而变化。"
                  : "Toggle a scenario above to see how its promise and shadow reshape the flourishing profile."}
              </span>
            </div>
          )}

          {/* dim bars */}
          <div>
            <div className="label-mono mb-3 text-bone-500">
              {lang === "zh" ? "繁盛维度 · 平衡胜于尖峰" : "Flourishing dimensions · balance beats peaks"}
            </div>
            <div className="space-y-3">
              {FLOURISH_DIMS.map((dim, i) => (
                <DimBar
                  key={dim.key}
                  label={dim.label[lang]}
                  desc={dim.desc[lang]}
                  color={dim.color}
                  baseline={BASELINE}
                  value={values[i]}
                  lang={lang}
                />
              ))}
            </div>
            {/* legend */}
            <div className="mt-3 flex items-center gap-4 text-[0.6rem] font-mono text-bone-500">
              <span className="flex items-center gap-1.5">
                <span className="block h-px w-5 border-t border-dashed opacity-50" style={{ borderColor: "#ffd29a" }} />
                {lang === "zh" ? "基线 65" : "Baseline 65"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#6ee9d4" }} />
                {lang === "zh" ? "增益" : "Gain"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#ff8c9e" }} />
                {lang === "zh" ? "消耗" : "Drain"}
              </span>
            </div>
          </div>
        </div>

        {/* right: radar + verdict */}
        <div className="flex flex-col items-center gap-4">
          <FutureRadar values={values} score={score} lang={lang} />

          {/* verdict */}
          <div
            className="w-full rounded-lg border border-dawn-500/15 bg-void-800/60 px-4 py-3 text-center"
          >
            <div className="display text-3xl text-dawn-300 mb-1">{score}</div>
            <div className="label-mono text-xs text-calm-400 mb-2">
              {lang === "zh" ? "繁盛指数" : "Flourishing index"}
            </div>
            <p className={`text-xs leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
              {verdict[lang]}
            </p>
          </div>

          {/* note on balance */}
          <div className="w-full rounded-lg border border-mind-500/20 bg-void-800/40 px-4 py-3">
            <div className="label-mono mb-1.5 text-mind-400">
              {lang === "zh" ? "诊断逻辑" : "Scoring note"}
            </div>
            <p className={`text-[0.68rem] leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "指数 = 均值 − 不平衡惩罚（标准差 × 0.35）。繁盛奖励连贯，而非峰值——一个在所有维度均衡的人，胜过在一个维度超群却在他处饥贫的人。"
                : "Score = mean − imbalance penalty (std dev × 0.35). Flourishing rewards coherence, not peaks — a balanced profile outscores a high spike with compensating hollows."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
