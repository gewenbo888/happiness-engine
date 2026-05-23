"use client";

import { useState, useEffect, useRef } from "react";
import { AI_LENSES, AI_QA } from "./content";
import { useLang } from "./lang";

type ViewMode = "grid" | "single";

// Stagger delays for card reveal (ms)
const STAGGER = [0, 120, 240, 360];
const ANALYSE_DURATION = 750; // ms shimmer before reveal

export default function FlourishingAnalyst() {
  const { lang } = useLang();

  const [activeQKey, setActiveQKey] = useState<string>(AI_QA[0].key);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeLensKey, setActiveLensKey] = useState<string>(AI_LENSES[0].key);
  const [phase, setPhase] = useState<"idle" | "analysing" | "revealed">("idle");
  // revealed[i] = true once the staggered card i is visible
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staggerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    staggerRefs.current.forEach(clearTimeout);
    staggerRefs.current = [];
  };

  const triggerAnalysis = (qKey: string) => {
    clearTimers();
    setActiveQKey(qKey);
    setPhase("analysing");
    setRevealed([false, false, false, false]);

    timerRef.current = setTimeout(() => {
      setPhase("revealed");
      // stagger each card in
      STAGGER.forEach((delay, i) => {
        const t = setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, delay);
        staggerRefs.current.push(t);
      });
    }, ANALYSE_DURATION);
  };

  // Start analysis immediately on mount
  useEffect(() => {
    triggerAnalysis(AI_QA[0].key);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run analysis when question chip is clicked
  const handleSelectQ = (qKey: string) => {
    if (qKey === activeQKey && phase === "revealed") return;
    triggerAnalysis(qKey);
  };

  const activeQA = AI_QA.find((q) => q.key === activeQKey) ?? AI_QA[0];

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">
      {/* ── Header ── */}
      <div className="mb-1 flex items-center gap-3">
        <span className="label-mono">Flourishing Analyst · 繁盛分析</span>
        <span
          className="glow-pulse h-1.5 w-1.5 rounded-full"
          style={{ background: "#ffb86b" }}
          aria-hidden
        />
      </div>
      <p className={`mb-6 text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "从四重视角审视关于幸福的关键问题——神经科学、心理学、哲学，与冥想引导。"
          : "Four lenses on the questions that matter most — neuroscience, psychology, philosophy, and contemplative practice."}
      </p>

      {/* ── Question chips ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {AI_QA.map((qa) => {
          const isActive = qa.key === activeQKey;
          return (
            <button
              key={qa.key}
              onClick={() => handleSelectQ(qa.key)}
              className={`rounded-lg border px-3 py-2 text-left text-[0.72rem] leading-snug transition-all duration-300 ${
                isActive
                  ? "border-dawn-400/60 bg-dawn-400/10 text-dawn-300"
                  : "border-void-600 text-bone-400 hover:border-dawn-500/35 hover:text-bone-200"
              }`}
              aria-pressed={isActive}
            >
              <span className={lang === "zh" ? "zh" : ""}>{qa.q[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* ── View toggle ── */}
      <div className="mb-5 flex items-center gap-1 rounded-full border border-void-600 bg-void-800/60 p-0.5 w-fit">
        <button
          onClick={() => setViewMode("grid")}
          className={`rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-widest uppercase transition-all duration-200 ${
            viewMode === "grid"
              ? "bg-dawn-400/20 text-dawn-300"
              : "text-bone-500 hover:text-bone-300"
          }`}
        >
          {lang === "zh" ? "四重视角" : "All four"}
        </button>
        <button
          onClick={() => setViewMode("single")}
          className={`rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-widest uppercase transition-all duration-200 ${
            viewMode === "single"
              ? "bg-dawn-400/20 text-dawn-300"
              : "text-bone-500 hover:text-bone-300"
          }`}
        >
          {lang === "zh" ? "单一视角" : "One lens"}
        </button>
      </div>

      {/* ── Lens tabs (single-lens mode) ── */}
      {viewMode === "single" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {AI_LENSES.map((lens) => {
            const isActive = lens.key === activeLensKey;
            return (
              <button
                key={lens.key}
                onClick={() => setActiveLensKey(lens.key)}
                className={`rounded-full border px-3 py-1 font-mono text-[0.66rem] uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "border-transparent text-void-950"
                    : "border-void-600 text-bone-400 hover:text-bone-200"
                }`}
                style={
                  isActive
                    ? { background: lens.color, borderColor: lens.color }
                    : {}
                }
              >
                <span className={lang === "zh" ? "zh" : ""}>{lens.name[lang]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Analysis area ── */}
      {phase === "analysing" && (
        <div className="flex flex-col gap-3 py-4" aria-live="polite">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#ffb86b",
                    animation: `nodepulse 1.2s ease-in-out ${i * 0.22}s infinite`,
                  }}
                  aria-hidden
                />
              ))}
            </div>
            <span className="font-mono text-[0.7rem] text-bone-500 tracking-widest uppercase">
              {lang === "zh" ? "分析中…" : "Analysing…"}
            </span>
          </div>
          {/* shimmer skeleton rows */}
          {AI_LENSES.map((lens) => (
            <div
              key={lens.key}
              className="h-24 rounded-lg animate-pulse"
              style={{
                background: `linear-gradient(120deg, rgba(33,23,38,0.6) 0%, rgba(46,32,52,0.8) 50%, rgba(33,23,38,0.6) 100%)`,
                borderLeft: `2px solid ${lens.color}30`,
              }}
            />
          ))}
        </div>
      )}

      {phase === "revealed" && viewMode === "grid" && (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          aria-live="polite"
          aria-label={lang === "zh" ? "四重分析视角" : "Four-lens analysis"}
        >
          {AI_LENSES.map((lens, i) => {
            const answerBi = activeQA.answers[lens.key];
            const isVisible = revealed[i];
            return (
              <div
                key={lens.key}
                className="rounded-lg p-4 transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(16px)",
                  background: `linear-gradient(155deg, ${lens.color}0d, rgba(15,10,14,0.88))`,
                  border: `1px solid ${lens.color}28`,
                  transitionDelay: `${STAGGER[i]}ms`,
                }}
              >
                {/* Lens header */}
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-mono text-[0.67rem] font-semibold uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: lens.color }}
                    >
                      {lens.name[lang]}
                    </p>
                    <p className={`mt-0.5 text-[0.65rem] text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
                      {lens.role[lang]}
                    </p>
                  </div>
                  <span
                    className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full glow-pulse"
                    style={{ background: lens.color }}
                    aria-hidden
                  />
                </div>
                {/* Answer */}
                <p
                  className={`text-[0.83rem] leading-relaxed text-bone-200 ${lang === "zh" ? "zh" : ""}`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.6s ease",
                    transitionDelay: `${STAGGER[i] + 120}ms`,
                  }}
                >
                  {answerBi[lang]}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {phase === "revealed" && viewMode === "single" && (() => {
        const lens = AI_LENSES.find((l) => l.key === activeLensKey) ?? AI_LENSES[0];
        const answerBi = activeQA.answers[lens.key];
        return (
          <div
            key={`${activeQKey}-${activeLensKey}`}
            className="rounded-xl p-5 md:p-7 rise"
            style={{
              background: `linear-gradient(155deg, ${lens.color}0f, rgba(15,10,14,0.9))`,
              border: `1px solid ${lens.color}35`,
            }}
            aria-live="polite"
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full flex-shrink-0 glow-pulse"
                style={{ background: lens.color }}
                aria-hidden
              />
              <div>
                <p
                  className={`font-mono text-[0.72rem] font-semibold uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: lens.color }}
                >
                  {lens.name[lang]}
                </p>
                <p className={`text-[0.68rem] text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
                  {lens.role[lang]}
                </p>
              </div>
            </div>
            <div className="rule-warm mb-5" />
            <p
              className={`text-[0.95rem] leading-loose text-bone-100 ${lang === "zh" ? "zh" : ""}`}
            >
              {answerBi[lang]}
            </p>
          </div>
        );
      })()}

      {/* ── Disclaimer ── */}
      <p
        className={`mt-6 text-[0.65rem] leading-relaxed text-bone-500 ${lang === "zh" ? "zh" : ""}`}
      >
        {lang === "zh"
          ? "以上内容为精心策划的多视角反思，供自我探索之用，不构成实时分析或医疗建议。"
          : "These are curated perspectives for reflection and self-exploration — not live AI analysis or medical advice."}
      </p>
    </div>
  );
}
