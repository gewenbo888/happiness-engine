"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, CONCEPTS } from "./content";

import EmotionField from "./EmotionField";
import EmotionMap from "./EmotionMap";
import PleasureMeaning from "./PleasureMeaning";
import NeuroLab from "./NeuroLab";
import FlowChannel from "./FlowChannel";
import RelationshipWeb from "./RelationshipWeb";
import SufferingLab from "./SufferingLab";
import CivilizationsModel from "./CivilizationsModel";
import DigitalLoop from "./DigitalLoop";
import FutureFlourishing from "./FutureFlourishing";
import FlourishingModel from "./FlourishingModel";
import BreathChamber from "./BreathChamber";
import FlourishingAnalyst from "./FlourishingAnalyst";

const VIS: Record<string, ReactNode> = {
  origin: <EmotionMap />,
  pleasure: <PleasureMeaning />,
  brain: <NeuroLab />,
  flow: <FlowChannel />,
  love: <RelationshipWeb />,
  suffering: <SufferingLab />,
  civilizations: <CivilizationsModel />,
  digital: <DigitalLoop />,
  future: <FutureFlourishing />,
};

const NAV: { id: string; en: string; zh: string }[] = [
  { id: "origin", en: "Feeling", zh: "感受" },
  { id: "brain", en: "Brain", zh: "大脑" },
  { id: "flow", en: "Flow", zh: "心流" },
  { id: "love", en: "Love", zh: "爱" },
  { id: "civilizations", en: "Civilizations", zh: "文明" },
  { id: "model", en: "Model", zh: "模型" },
  { id: "analyst", en: "Analyst", zh: "分析" },
];

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <radialGradient id="logo-g" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffd29a" />
          <stop offset="45%" stopColor="#ff9e4f" />
          <stop offset="100%" stopColor="#ff6b81" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="15" r="8.5" fill="none" stroke="url(#logo-g)" strokeWidth="2" />
      <circle cx="16" cy="15" r="3" fill="url(#logo-g)" />
      <path d="M9 22 Q16 27 23 22" fill="none" stroke="#a87fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Header() {
  const { lang } = useLang();
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-dawn-500/12 bg-void-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-dawn-500/25 bg-void-800">
          <Logo />
        </div>
        <div className="leading-tight">
          <div className="display text-base text-bone-50">Happiness Engine</div>
          <div className="zh text-[0.6rem] text-bone-500">幸福引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-500 lg:flex">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="hover:text-dawn-300">
            {lang === "zh" ? n.zh : n.en}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a
          href="https://psyverse.fun"
          className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-calm-400 hover:text-dawn-300 sm:block"
        >
          ← Psyverse
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <EmotionField />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/20 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · the architecture of a flourishing life</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone-500">
          EN · 中文 · emotion × neuroscience × philosophy × love × suffering × meaning × consciousness
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.92] text-bone-50 md:text-8xl">
          Happiness <span className="glow-text">Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-bone-200 md:text-5xl">幸福引擎</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-bone-100 md:text-xl">
          <T
            v={{
              en: "Humans do not merely seek survival. We seek joy, meaning, beauty, love, peace, growth and transcendence. This is a civilisation-scale atlas of how a mind comes to flourish — and why happiness may be less a sensation than an alignment.",
              zh: "人类追寻的，不只是生存。我们追寻喜悦、意义、美、爱、平静、成长与超越。这是一部文明尺度的图志，关于一个心智如何走向繁盛——以及为何，幸福或许不是一种感觉，而是一种对齐。",
            }}
          />
        </p>

        <div className="mt-10 max-w-2xl rounded-lg border border-dawn-500/15 bg-void-900/70 p-6 backdrop-blur">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-bone-50 md:text-2xl">
            <T
              v={{
                en: "Happiness emerges when consciousness aligns with reality, purpose, relationships, and the unfolding structure of life itself.",
                zh: "当意识与现实、目的、关系，以及生命本身正在展开的结构相对齐时，幸福便浮现出来。",
              }}
            />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-500">
          <span>10 systems · 十大系统</span>
          <span>1 unified model · 一个统一模型</span>
          <span>pleasure is weather ☍ meaning is climate</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({
  num,
  id,
  title,
  sub,
  body,
  vis,
  concepts,
}: {
  num: string;
  id: string;
  title: any;
  sub: any;
  body: any;
  vis?: ReactNode;
  concepts?: { t: any; d: any }[];
}) {
  const { lang } = useLang();
  return (
    <section id={id} className="relative border-t border-dawn-500/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl text-dawn-500/30">{num}</span>
          <div>
            <h2 className="display text-4xl text-bone-50 md:text-5xl">
              <T v={title} />
            </h2>
            <h3 className="mt-1 text-lg text-calm-400">
              <T v={sub} />
            </h3>
          </div>
        </div>
        <div className="mt-5 rule-warm opacity-60" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
          <T v={body} />
        </p>
        {vis && <div className="mt-12">{vis}</div>}
        {concepts && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((c, i) => (
              <div key={i} className="card rounded-xl p-5">
                <div key={`t-${lang}`} className={`display text-lg text-dawn-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.t[lang]}
                </div>
                <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.d[lang]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  const unified = SECTIONS.find((s) => s.id === "unified")!;
  return (
    <main className="relative bg-void-950 text-bone-100">
      <Header />
      <Hero />

      {/* marquee */}
      <div className="overflow-hidden border-y border-dawn-500/12 bg-void-900/60 py-2.5">
        <div className="whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.3em] text-calm-400/80">
          {(lang === "zh"
            ? "喜悦 · 意义 · 心流 · 爱 · 宁静 · 敬畏 · 苦难 · 超越 · 多巴胺是想要，血清素是知足，催产素是联结 · 快乐是天气，意义是气候 · "
            : "JOY · MEANING · FLOW · LOVE · SERENITY · AWE · SUFFERING · TRANSCENDENCE · DOPAMINE IS WANTING, SEROTONIN IS ENOUGH, OXYTOCIN IS BONDING · PLEASURE IS WEATHER, MEANING IS CLIMATE · ").repeat(2)}
        </div>
      </div>

      {/* sections 01–09 */}
      {SECTIONS.filter((s) => s.id !== "unified").map((s) => (
        <SectionBlock
          key={s.id}
          num={s.num}
          id={s.id}
          title={s.title}
          sub={s.sub}
          body={s.body}
          vis={VIS[s.id]}
          concepts={CONCEPTS[s.id]}
        />
      ))}

      {/* meditation interlude */}
      <section id="breathe" className="relative border-t border-dawn-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="label-mono">Interlude · 间奏 · a place to stop reading</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "Breathe", zh: "呼吸" }} />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-lg leading-relaxed text-bone-300">
            <T
              v={{
                en: "Every model on this page agrees on one thing: states can be practised. The slow exhale is the one lever on the nervous system you can pull at will. Follow the circle for a minute.",
                zh: "本页的每一个模型都同意一件事：状态，是可以练习的。缓慢的呼气，是你能随意拉动的、作用于神经系统的唯一一根杠杆。跟随这个圆，用一分钟。",
              }}
            />
          </p>
        </div>
        <div className="mt-12">
          <BreathChamber />
        </div>
      </section>

      {/* unified meta-model */}
      <section id="model" className="relative border-t border-dawn-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-5xl text-dawn-500/30">{unified.num}</span>
            <div>
              <h2 className="display text-4xl text-bone-50 md:text-5xl">
                <T v={unified.title} />
              </h2>
              <h3 className="mt-1 text-lg text-calm-400">
                <T v={unified.sub} />
              </h3>
            </div>
          </div>
          <div className="mt-5 rule-warm opacity-60" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T v={unified.body} />
          </p>
          <div className="mt-8 max-w-3xl rounded-lg border border-mind-500/20 bg-void-900/60 p-5">
            <div className="label-mono" style={{ color: "#d8c6ff" }}>Meta-model · 元模型</div>
            <p className="mt-2 font-mono text-sm leading-relaxed text-bone-200">
              {lang === "zh"
                ? "人类繁盛 = 情绪稳定 + 意义 + 社会连接 + 好奇 + 目的 + 自由 + 成长 + 意识整合"
                : "Human Flourishing = Emotional Stability + Meaning + Social Connection + Curiosity + Purpose + Freedom + Growth + Consciousness Integration"}
            </p>
          </div>
          <div className="mt-12">
            <FlourishingModel />
          </div>
        </div>
      </section>

      {/* AI layer */}
      <section id="analyst" className="relative border-t border-dawn-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">AI layer · 人工智能层</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "The Flourishing Analyst", zh: "繁盛分析师" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Ask a real question about your inner life, and hear it answered through four lenses at once — neuroscience, psychology, philosophy and contemplative practice. Not motivational clichés, but the actual machinery of feeling, seen from four heights.",
                zh: "提出一个关于你内在生活的真实问题，听它同时从四重视角被回答——神经科学、心理学、哲学，与修行。不是励志的陈词，而是感受真实的机理，从四种高度被看见。",
              }}
            />
          </p>
          <div className="mt-12">
            <FlourishingAnalyst />
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="relative border-t border-dawn-500/10 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px w-40 rule-warm" />
          <h2 className="display text-4xl leading-snug text-bone-50 md:text-6xl">
            <T
              v={{
                en: "Happiness is not a thing to be caught, but a coherence to be lived into.",
                zh: "幸福不是一件可被捕获之物，而是一种可被活入的连贯。",
              }}
            />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-bone-300">
            <T
              v={{
                en: "Across biology, emotion, relationship, civilisation and technology, the same pattern returns. Pleasure is the weather of a life; meaning is its climate. We are not solitary happiness machines but social, meaning-making animals — and we flourish when the inner world and the outer one stop arguing, and begin to align.",
                zh: "穿越生物、情绪、关系、文明与技术，同一个模式一再回返。快乐是一段人生的天气，意义是它的气候。我们不是孤立的幸福机器，而是创造意义的社会性动物——当内在世界与外在世界停止争执、开始对齐时，我们便繁盛。",
              }}
            />
          </p>
          <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-calm-400/70">
            Happiness Engine · 幸福引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-dawn-500/12 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-bone-50">Happiness Engine</div>
            <div className="zh mt-1 text-sm text-bone-300">幸福引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-500">
              <T
                v={{
                  en: "How emotion, neuroscience, philosophy, love, suffering and meaning converge into one model of human flourishing.",
                  zh: "情绪、神经科学、哲学、爱、苦难与意义，如何汇聚成一个人类繁盛的统一模型。",
                }}
              />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-bone-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-dawn-300">
                    {s.num} · <T v={s.title} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-bone-300">
              <li><a href="https://flow-state.psyverse.fun" className="hover:text-dawn-300">Flow State · 心流</a></li>
              <li><a href="https://consciousness.psyverse.fun" className="hover:text-dawn-300">Consciousness · 意识</a></li>
              <li><a href="https://mission-engine.psyverse.fun" className="hover:text-dawn-300">Mission Engine · 使命引擎</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-calm-400 hover:text-dawn-300">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-warm" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-bone-500">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · a flourishing atlas</div>
        </div>
      </footer>
    </main>
  );
}

export default function HappinessEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
