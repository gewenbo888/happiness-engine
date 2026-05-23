"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { NEUROCHEMICALS } from "./content";
import { useLang, T, t } from "./lang";
import type { Bi } from "./lang";

/* ============================================================
   NeuroLab — interactive neurochemistry lab
   Section 03: "The Neurochemistry Engine"
   Six sliders (DA / 5-HT / OT / β-EP / CORT / GABA), a live
   emotional-state verdict, a "what would help" tip, and a small
   animated SVG synapse whose dot density + colour tracks the
   dominant chemical.
   ============================================================ */

/* ---------- Verdict engine ---------- */
type Verdict = { headline: Bi; detail: Bi };

function computeVerdict(vals: number[]): Verdict {
  const [da, ht, ot, ep, cort, gaba] = vals;

  const hiDA = da >= 65;
  const loDA = da <= 35;
  const hiHT = ht >= 65;
  const loHT = ht <= 35;
  const hiOT = ot >= 65;
  const loOT = ot <= 35;
  const hiEP = ep >= 65;
  const loEP = ep <= 35;
  const hiCORT = cort >= 65;
  const loCORT = cort <= 35;
  const hiGABA = gaba >= 65;
  const loGABA = gaba <= 35;

  // High cortisol × low GABA → anxious and wired
  if (hiCORT && loGABA) {
    return {
      headline: { en: "Anxious and wired", zh: "焦虑而紧绷" },
      detail: {
        en: "Stress is high and the brain's brakes are faint. The body is mobilised but the off-switch is missing.",
        zh: "应激高涨，大脑的刹车却几近失效。身体处于动员状态，而关闭开关已无处寻找。",
      },
    };
  }

  // High cortisol alone
  if (hiCORT && !loGABA) {
    return {
      headline: { en: "Stressed and vigilant", zh: "压力在线，高度警觉" },
      detail: {
        en: "Cortisol is running high — useful in a crisis, corrosive if sustained. The nervous system hasn't had a chance to exhale.",
        zh: "皮质醇居高——危机中有用，持续时则具腐蚀性。神经系统还没有机会呼出那口气。",
      },
    };
  }

  // High dopamine × low serotonin → driven but restless
  if (hiDA && loHT) {
    return {
      headline: { en: "Driven but restless", zh: "有动力却躁动" },
      detail: {
        en: "The engine is running hot on pursuit, but without serotonin's floor of contentment, the chase never satisfies.",
        zh: "追逐的引擎以高温运转，但没有血清素那层知足的底线，这场追逐始终无法令人满足。",
      },
    };
  }

  // High serotonin × high oxytocin × low cortisol → calm connected contentment
  if (hiHT && hiOT && loCORT) {
    return {
      headline: { en: "Calm, connected contentment", zh: "平静、联结的知足" },
      detail: {
        en: "The rarest combination: mood-floor high, bonds warm, and stress quiet. This is what a flourishing ordinary day feels like.",
        zh: "最罕见的组合：情绪底线高，联结温暖，压力寂静。这就是繁盛的普通一日所该有的感受。",
      },
    };
  }

  // High endorphin × high dopamine → elated and energised
  if (hiEP && hiDA) {
    return {
      headline: { en: "Elated and energised", zh: "振奋、充满能量" },
      detail: {
        en: "Both wanting and liking are singing. The body is moving, the reward is real, and the world feels generous.",
        zh: "「想要」与「喜欢」同时在唱。身体在运动，奖赏是真实的，世界感觉慷慨。",
      },
    };
  }

  // Low dopamine × low endorphin → flat and joyless
  if (loDA && loEP) {
    return {
      headline: { en: "Flat and joyless", zh: "平淡、无乐" },
      detail: {
        en: "Neither pursuit nor pleasure is online. The world has lost its pull and effort feels entirely pointless.",
        zh: "追逐与愉悦都已下线。世界失去了它的引力，努力感觉全然徒劳。",
      },
    };
  }

  // Low dopamine alone
  if (loDA && !loEP) {
    return {
      headline: { en: "Unmotivated, drifting", zh: "缺乏动力，随波漂流" },
      detail: {
        en: "Dopamine is low — the appetite for pursuit has dimmed. Goals sit on the page, unstarted.",
        zh: "多巴胺低落——追逐的胃口已经暗淡。目标停留在纸上，无从开始。",
      },
    };
  }

  // High GABA × high serotonin → deep ease
  if (hiGABA && hiHT) {
    return {
      headline: { en: "Deep ease and quiet confidence", zh: "深度自在，静默的自信" },
      detail: {
        en: "The brakes are gentle and the floor is solid. Not excitement — something better: the body at peace with itself.",
        zh: "刹车温和，底线稳固。不是兴奋——是更好的东西：身体与自身和解。",
      },
    };
  }

  // High oxytocin alone
  if (hiOT && !hiCORT) {
    return {
      headline: { en: "Warm and well-connected", zh: "温暖、连结良好" },
      detail: {
        en: "Oxytocin is flowing — other minds matter, trust is easy, and there is a glow in simple togetherness.",
        zh: "催产素在流动——他者之心重要，信任来得轻松，简单的相聚中有一份暖光。",
      },
    };
  }

  // Low oxytocin × low serotonin
  if (loOT && loHT) {
    return {
      headline: { en: "Isolated and irritable", zh: "孤立而易怒" },
      detail: {
        en: "Disconnection and low mood are compounding. The world feels both empty and abrasive.",
        zh: "失联与低落情绪相互叠加。世界感觉既空洞又令人抓狂。",
      },
    };
  }

  // Compute overall mean to give a blended reading
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  if (mean >= 70) {
    return {
      headline: { en: "Broadly balanced and buoyant", zh: "总体均衡，情绪浮扬" },
      detail: {
        en: "No single system dominates. Most chemicals are above their resting line — a composite of well-being.",
        zh: "没有单一系统主导。多数化学物质都高于其静息线——一种综合的良好状态。",
      },
    };
  }
  if (mean >= 45) {
    return {
      headline: { en: "Middling — neither flourishing nor struggling", zh: "中等——不繁盛，也不挣扎" },
      detail: {
        en: "The neurochemical orchestra is playing, but no section is really singing. Small shifts in a few chemicals would change the texture.",
        zh: "神经化学的乐团在演奏，但没有哪个声部真正在唱。几个化学物质的微小变化，就能改变整体质感。",
      },
    };
  }
  return {
    headline: { en: "Running low across the board", zh: "全面低落" },
    detail: {
      en: "Most systems are below their resting threshold. Rest, connection and small wins are the priority.",
      zh: "多数系统都低于其静息阈值。休息、联结，与小小的成就，是当务之急。",
    },
  };
}

/* ---------- Lift tip engine ---------- */
function computeTip(vals: number[]): { tips: string[]; zh: string[] } {
  const indices = [0, 1, 2, 3, 4, 5];
  const low = indices.filter((i) => vals[i] <= 38);
  if (low.length === 0) return { tips: [], zh: [] };
  return {
    tips: low.slice(0, 2).map((i) => NEUROCHEMICALS[i].lift.en),
    zh: low.slice(0, 2).map((i) => NEUROCHEMICALS[i].lift.zh),
  };
}

/* ---------- Synapse SVG (animated) ---------- */
function SynapseViz({ dominantIdx }: { dominantIdx: number }) {
  const chem = NEUROCHEMICALS[dominantIdx];

  // We render 7 dots with staggered CSS animations
  const DOT_COUNT = 7;
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 260 120"
      aria-hidden
      className="w-full max-w-[260px]"
    >
      <defs>
        <radialGradient id="nlpre" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={chem.color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={chem.color} stopOpacity="0.08" />
        </radialGradient>
        <radialGradient id="nlpost" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={chem.color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={chem.color} stopOpacity="0.06" />
        </radialGradient>
        {/* Glow filter for dots */}
        <filter id="nlglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes nl-dot {
            0%   { transform: translateX(0px);   opacity: 0; }
            10%  { opacity: 1; }
            80%  { opacity: 1; }
            100% { transform: translateX(90px);  opacity: 0; }
          }
        `}</style>
      </defs>

      {/* Presynaptic terminal */}
      <ellipse cx="68" cy="60" rx="52" ry="34" fill="url(#nlpre)" stroke={chem.color} strokeWidth="1" strokeOpacity="0.4" />
      <text x="68" y="63" textAnchor="middle" fontSize="9" fill={chem.color} fillOpacity="0.7" fontFamily="Space Mono" letterSpacing="1">
        {chem.symbol}
      </text>
      {/* vesicle hint */}
      <circle cx="90" cy="50" r="5" fill={chem.color} fillOpacity="0.25" stroke={chem.color} strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="80" cy="64" r="4" fill={chem.color} fillOpacity="0.2" stroke={chem.color} strokeWidth="0.8" strokeOpacity="0.4" />
      <circle cx="94" cy="67" r="4.5" fill={chem.color} fillOpacity="0.22" stroke={chem.color} strokeWidth="0.8" strokeOpacity="0.45" />

      {/* Synaptic gap label */}
      <text x="130" y="20" textAnchor="middle" fontSize="7.5" fill="#a08a82" fontFamily="Space Mono" letterSpacing="1">
        SYNAPTIC GAP
      </text>

      {/* Gap bracket lines */}
      <line x1="118" y1="24" x2="118" y2="96" stroke="#2e2034" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="142" y1="24" x2="142" y2="96" stroke="#2e2034" strokeWidth="1" strokeDasharray="3 3" />

      {/* Travelling neurotransmitter dots */}
      {dots.map((i) => (
        <circle
          key={i}
          cx="118"
          cy={44 + i * 6}
          r="3.4"
          fill={chem.color}
          filter="url(#nlglow)"
          style={{
            animation: `nl-dot ${1.4 + i * 0.07}s ease-in-out ${i * 0.19}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Postsynaptic membrane */}
      <ellipse cx="192" cy="60" rx="52" ry="34" fill="url(#nlpost)" stroke={chem.color} strokeWidth="1" strokeOpacity="0.35" />
      {/* receptor notch */}
      <path
        d="M 142 50 Q 148 46 154 50 L 154 70 Q 148 74 142 70 Z"
        fill={chem.color}
        fillOpacity="0.18"
        stroke={chem.color}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <text x="198" y="63" textAnchor="middle" fontSize="7.5" fill={chem.color} fillOpacity="0.65" fontFamily="Space Mono" letterSpacing="1">
        RECEPTOR
      </text>
    </svg>
  );
}

/* ============================================================
   Main component
   ============================================================ */
export default function NeuroLab() {
  const { lang } = useLang();

  // One slider value per chemical (0–100)
  const [vals, setVals] = useState<number[]>(() =>
    NEUROCHEMICALS.map((c) => (c.key === "cortisol" ? 35 : 58))
  );
  // Which chemical is focused in the detail panel
  const [focused, setFocused] = useState<number>(0);

  const setVal = useCallback((idx: number, v: number) => {
    setVals((prev) => {
      const next = prev.slice();
      next[idx] = v;
      return next;
    });
  }, []);

  const verdict = computeVerdict(vals);
  const tip = computeTip(vals);

  // Dominant chemical = highest slider value (use for synapse color)
  const dominantIdx = vals.indexOf(Math.max(...vals));

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* Section header */}
      <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-bone-500 uppercase">
        03
      </div>
      <h2 className="display text-xl font-semibold text-bone-50 md:text-2xl">
        <T v={{ en: "The Neurochemistry Engine", zh: "神经化学引擎" }} />
      </h2>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-bone-300">
        <T
          v={{
            en: "Adjust the levels and watch the emotional verdict shift. Six chemicals, one mood. Dominant molecule drives the synapse.",
            zh: "调节各项水平，看情绪判定如何变化。六种化学物质，一种情绪。主导分子驱动突触。",
          }}
        />
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* ---- Left: sliders + detail panel ---- */}
        <div>
          {/* Sliders */}
          <div className="space-y-3">
            {NEUROCHEMICALS.map((chem, i) => (
              <div key={chem.key}>
                <button
                  className="w-full text-left focus:outline-none"
                  onClick={() => setFocused(focused === i ? -1 : i)}
                  aria-expanded={focused === i}
                >
                  <div className="flex items-center gap-2">
                    {/* Symbol badge */}
                    <span
                      className="inline-block w-14 shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[0.6rem] tracking-wide"
                      style={{
                        color: chem.color,
                        borderColor: `${chem.color}40`,
                        backgroundColor: `${chem.color}10`,
                      }}
                    >
                      {chem.symbol}
                    </span>
                    {/* Name */}
                    <span
                      className={`font-mono text-[0.72rem] ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: chem.color }}
                    >
                      {chem.name[lang]}
                    </span>
                    {/* Value */}
                    <span className="ml-auto font-mono text-[0.66rem] text-bone-500">
                      {vals[i]}
                    </span>
                  </div>
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={vals[i]}
                  onChange={(e) => {
                    setVal(i, Number(e.target.value));
                    setFocused(i);
                  }}
                  onFocus={() => setFocused(i)}
                  className="mt-1.5 w-full"
                  aria-label={chem.name[lang]}
                  style={{ accentColor: chem.color }}
                />

                {/* Detail panel (expands inline) */}
                {focused === i && (
                  <div
                    className="mt-2 mb-1 rounded-lg border p-3 text-xs leading-relaxed"
                    style={{
                      borderColor: `${chem.color}30`,
                      backgroundColor: `${chem.color}08`,
                    }}
                  >
                    <p className={`mb-1.5 text-bone-100 ${lang === "zh" ? "zh" : ""}`}>
                      <span className="text-bone-500">
                        {lang === "en" ? "Role · " : "作用 · "}
                      </span>
                      {chem.role[lang]}
                    </p>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                      <p className={`text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                        <span className="text-bone-500 font-mono text-[0.6rem] uppercase mr-1">
                          {lang === "en" ? "High" : "高时"}
                        </span>
                        {chem.high[lang]}
                      </p>
                      <p className={`text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                        <span className="text-bone-500 font-mono text-[0.6rem] uppercase mr-1">
                          {lang === "en" ? "Low" : "低时"}
                        </span>
                        {chem.low[lang]}
                      </p>
                      <p className={`text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                        <span className="text-bone-500 font-mono text-[0.6rem] uppercase mr-1">
                          {lang === "en" ? "Lift" : "提升"}
                        </span>
                        {chem.lift[lang]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ---- Verdict card ---- */}
          <div className="mt-6 rounded-xl border border-dawn-500/20 bg-void-800/70 p-4">
            <div className="label-mono mb-2 text-bone-500">
              {lang === "en" ? "Emotional state · live reading" : "情绪状态 · 实时读取"}
            </div>
            <p
              className={`text-base font-semibold text-dawn-300 ${lang === "zh" ? "zh" : ""}`}
            >
              {verdict.headline[lang]}
            </p>
            <p className={`mt-1.5 text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
              {verdict.detail[lang]}
            </p>

            {/* Tip */}
            {tip.tips.length > 0 && (
              <div className="mt-3 border-t border-dawn-500/10 pt-3">
                <p className="label-mono mb-1.5 text-bone-500">
                  {lang === "en" ? "What would help" : "可以尝试"}
                </p>
                <ul className="space-y-1">
                  {(lang === "en" ? tip.tips : tip.zh).map((s, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-1.5 text-xs leading-relaxed text-bone-400 ${lang === "zh" ? "zh" : ""}`}
                    >
                      <span className="mt-0.5 text-dawn-400 shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ---- Right: chemical mini-bars + synapse ---- */}
        <div className="flex flex-col gap-6">
          {/* Mini bar chart */}
          <div className="rounded-xl border border-dawn-500/10 bg-void-800/50 p-4">
            <div className="label-mono mb-3 text-bone-500">
              {lang === "en" ? "Chemical balance" : "化学物质平衡"}
            </div>
            <div className="space-y-2">
              {NEUROCHEMICALS.map((chem, i) => (
                <div key={chem.key} className="flex items-center gap-2">
                  <span
                    className="w-12 shrink-0 text-right font-mono text-[0.6rem]"
                    style={{ color: chem.color }}
                  >
                    {chem.symbol}
                  </span>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-void-700">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                      style={{
                        width: `${vals[i]}%`,
                        backgroundColor: chem.color,
                        opacity: 0.75 + 0.25 * (vals[i] / 100),
                        boxShadow: `0 0 6px ${chem.color}60`,
                      }}
                    />
                  </div>
                  <span className="w-7 shrink-0 font-mono text-[0.6rem] text-bone-500 text-right">
                    {vals[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Synapse visualisation */}
          <div className="rounded-xl border border-dawn-500/10 bg-void-800/50 p-4">
            <div className="label-mono mb-1 text-bone-500">
              {lang === "en" ? "Synapse · dominant molecule" : "突触 · 主导分子"}
            </div>
            <p className="mb-3 text-[0.7rem] text-bone-500">
              <span className={lang === "zh" ? "zh" : ""}>
                {lang === "en"
                  ? "Dot colour & density track the highest-level chemical."
                  : "点的颜色与密度追踪水平最高的化学物质。"}
              </span>
            </p>
            <div className="flex justify-center">
              <SynapseViz dominantIdx={dominantIdx} />
            </div>
            {/* Dominant label */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NEUROCHEMICALS[dominantIdx].color }}
              />
              <span
                className={`font-mono text-[0.7rem] ${lang === "zh" ? "zh" : ""}`}
                style={{ color: NEUROCHEMICALS[dominantIdx].color }}
              >
                {NEUROCHEMICALS[dominantIdx].name[lang]}
              </span>
              <span className="font-mono text-[0.6rem] text-bone-500">
                ({NEUROCHEMICALS[dominantIdx].symbol})
              </span>
            </div>
          </div>

          {/* Quick-load presets */}
          <div className="rounded-xl border border-dawn-500/10 bg-void-800/50 p-4">
            <div className="label-mono mb-3 text-bone-500">
              {lang === "en" ? "Quick states" : "快速状态"}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setVals(p.vals.slice())}
                  className="rounded-full border border-dawn-500/20 px-2.5 py-1 font-mono text-[0.65rem] text-bone-300 transition hover:border-dawn-400/40 hover:text-dawn-300"
                >
                  <span className={lang === "zh" ? "zh" : ""}>{p.name[lang]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Quick-load presets ---------- */
// vals order: [DA, 5-HT, OT, β-EP, CORT, GABA]
const PRESETS: { key: string; name: Bi; vals: number[] }[] = [
  {
    key: "flow",
    name: { en: "Flow state", zh: "心流" },
    vals: [80, 60, 45, 70, 30, 65],
  },
  {
    key: "burnout",
    name: { en: "Burnout", zh: "倦怠" },
    vals: [25, 28, 30, 22, 72, 32],
  },
  {
    key: "love",
    name: { en: "In love", zh: "坠入爱河" },
    vals: [78, 55, 85, 65, 40, 60],
  },
  {
    key: "anxiety",
    name: { en: "Anxious", zh: "焦虑" },
    vals: [50, 30, 35, 40, 80, 22],
  },
  {
    key: "serenity",
    name: { en: "Serene", zh: "宁静" },
    vals: [50, 78, 68, 60, 22, 80],
  },
  {
    key: "grief",
    name: { en: "Grief", zh: "悲伤" },
    vals: [25, 32, 45, 30, 65, 48],
  },
  {
    key: "runner",
    name: { en: "Runner's high", zh: "跑者愉悦" },
    vals: [75, 62, 50, 88, 28, 68],
  },
  {
    key: "depression",
    name: { en: "Low mood", zh: "低落" },
    vals: [20, 22, 28, 20, 55, 38],
  },
];
