"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RELATION_LAYERS } from "./content";
import { useLang, T } from "./lang";

/**
 * RelationshipWeb — concentric belonging visualiser for section 05 "Love & Belonging".
 *
 * A "Self" node sits at centre; each RELATION_LAYER occupies a ring.
 * A loneliness slider (0–100) animates the web: rising loneliness cools
 * colours, thins links, and drifts outer nodes apart; falling loneliness
 * warms everything and pulls nodes inward. Hover/click a ring to inspect
 * its bilingual layer card.
 *
 * Canvas-2D only — no WebGL, no new packages.
 */

/* ------------------------------------------------------------------ */
/*  Geometry helpers                                                     */
/* ------------------------------------------------------------------ */

const TWO_PI = Math.PI * 2;

/** Base node count per ring (self is 1, handled separately) */
const RING_COUNTS = [1, 5, 13, 22, 36]; // self, intimates, friends, community, humanity

/** Radii for each ring as fraction of the base radius R */
const RING_RADII_FRAC = [0, 0.18, 0.38, 0.60, 0.84];

interface Node {
  /** ring index 0 = self */
  ring: number;
  /** angle in radians at loneliness = 0 */
  baseAngle: number;
  /** random jitter angle (stays fixed) */
  jitter: number;
  /** individual phase for pulse */
  phase: number;
  /** oscillation speed */
  sp: number;
  /** canvas x/y (updated each frame) */
  x: number;
  y: number;
}

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  for (let ring = 0; ring < RING_COUNTS.length; ring++) {
    const count = RING_COUNTS[ring];
    for (let i = 0; i < count; i++) {
      const baseAngle = count === 1 ? 0 : (i / count) * TWO_PI - Math.PI / 2;
      nodes.push({
        ring,
        baseAngle,
        jitter: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * TWO_PI,
        sp: 0.5 + Math.random() * 0.8,
        x: 0,
        y: 0,
      });
    }
  }
  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                       */
/* ------------------------------------------------------------------ */

/** Interpolate between two RGB triples */
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Layer warm colours (rose/dawn/calm/mind) */
const WARM_RGB: [number, number, number][] = [
  [255, 210, 154], // self – dawn-300
  [255, 140, 158], // intimates – rose-400
  [255, 179, 191], // friends – rose-300
  [110, 233, 212], // community – calm-400
  [192, 163, 255], // humanity – mind-400
];

/** Cold colours that loneliness shifts toward */
const COLD_RGB: [number, number, number][] = [
  [160, 138, 130], // self – desaturated bone
  [100,  90, 120], // intimates – cool grey-violet
  [90,   80, 110],
  [60,   70, 100],
  [50,   55,  90],
];

function layerRgb(ring: number, lonely: number): [number, number, number] {
  return lerpRgb(WARM_RGB[ring], COLD_RGB[ring], lonely / 100);
}

/* ------------------------------------------------------------------ */
/*  Component                                                            */
/* ------------------------------------------------------------------ */

export default function RelationshipWeb() {
  const { lang } = useLang();

  /* loneliness slider 0..100 */
  const [loneliness, setLoneliness] = useState(20);

  /* which layer the user has clicked */
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  /* canvas ref */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* stable refs so rAF closure always sees latest values */
  const lonelyRef = useRef(loneliness);
  useEffect(() => { lonelyRef.current = loneliness; }, [loneliness]);

  const activeRef = useRef(activeLayer);
  useEffect(() => { activeRef.current = activeLayer; }, [activeLayer]);

  /* ---------------------------------------------------------------- */
  /*  Canvas animation                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = buildNodes();
    let raf = 0;
    let t = 0;

    const tick = () => {
      t += 0.012;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.44; // base radius
      const lonely = lonelyRef.current;
      const lFrac = lonely / 100;

      ctx.clearRect(0, 0, w, h);

      /* ---- position nodes ---- */
      for (const nd of nodes) {
        if (nd.ring === 0) {
          nd.x = cx;
          nd.y = cy;
          continue;
        }
        const rFrac = RING_RADII_FRAC[nd.ring];
        /* outer rings drift outward + angularly as lonely rises */
        const radialPush = 1 + lFrac * 0.22 * nd.ring;
        const angularSpread = lFrac * 0.38 * nd.ring * (nd.jitter > 0 ? 1 : -1);
        const ang = nd.baseAngle + nd.jitter + angularSpread;
        const r = R * rFrac * radialPush;
        nd.x = cx + Math.cos(ang) * r;
        nd.y = cy + Math.sin(ang) * r;
      }

      /* ---- draw ring guides (faint concentric circles) ---- */
      for (let ring = 1; ring < RING_RADII_FRAC.length; ring++) {
        const rFrac = RING_RADII_FRAC[ring];
        const rr = R * rFrac;
        const [r, g, b] = layerRgb(ring, lonely);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, TWO_PI);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.08 - lFrac * 0.05})`;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
      }

      /* ---- draw links from self to each node ---- */
      const selfNode = nodes[0];
      for (const nd of nodes) {
        if (nd.ring === 0) continue;
        const ringDist = nd.ring; // 1..4
        /* links fade more for outer rings as loneliness rises */
        const linkAlpha = Math.max(0, (1 - lFrac * 0.9) * (1 - (ringDist - 1) * 0.18));
        if (linkAlpha < 0.005) continue;

        const [r, g, b] = layerRgb(nd.ring, lonely);

        /* animated flowing dash for inner rings */
        const flowSpeed = t * (nd.ring < 3 ? 1.8 : 0.9);
        const dashOffset = -((flowSpeed * 20) % 40);

        ctx.save();
        ctx.setLineDash([4 * dpr, 6 * dpr]);
        ctx.lineDashOffset = dashOffset;
        ctx.strokeStyle = `rgba(${r},${g},${b},${linkAlpha * 0.5})`;
        ctx.lineWidth = Math.max(0.4, (1.4 - lFrac * 0.9) * (1 - (ringDist - 1) * 0.2)) * dpr;
        ctx.beginPath();
        ctx.moveTo(selfNode.x, selfNode.y);
        ctx.lineTo(nd.x, nd.y);
        ctx.stroke();
        ctx.restore();
      }

      /* ---- draw nodes ---- */
      for (const nd of nodes) {
        const pulse = 0.7 + 0.3 * Math.sin(t * nd.sp + nd.phase);
        const [r, g, b] = layerRgb(nd.ring, lonely);
        /* self node is special */
        if (nd.ring === 0) {
          const selfGlow = 1 - lFrac * 0.55;
          ctx.shadowColor = `rgba(${r},${g},${b},${selfGlow * 0.8})`;
          ctx.shadowBlur = 28 * dpr * pulse;
          ctx.fillStyle = `rgba(${r},${g},${b},${selfGlow})`;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 7 * dpr * pulse, 0, TWO_PI);
          ctx.fill();
          ctx.shadowBlur = 0;
          continue;
        }

        const dimFrac = lFrac * 0.75 * (nd.ring / 4);
        const nodeAlpha = Math.max(0.08, (1 - dimFrac) * (0.6 + 0.4 * pulse));
        const nodeR = Math.max(1, (4.5 - nd.ring * 0.5) * dpr * (0.8 + 0.25 * pulse));

        /* highlight active ring */
        const isActive = activeRef.current === nd.ring;
        ctx.shadowColor = `rgba(${r},${g},${b},${isActive ? nodeAlpha * 1.4 : nodeAlpha * 0.7})`;
        ctx.shadowBlur = (isActive ? 22 : 12) * dpr;
        ctx.fillStyle = `rgba(${r},${g},${b},${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, isActive ? nodeR * 1.35 : nodeR, 0, TWO_PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* ---- draw centre label (Self / 自我) ---- */
      ctx.fillStyle = `rgba(255,230,180,${0.85 - lFrac * 0.3})`;
      ctx.font = `${600}  ${11 * dpr}px "Space Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SELF", cx, cy + 14 * dpr);

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Hit-testing: click on canvas → detect nearest ring              */
  /* ---------------------------------------------------------------- */

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mx = (e.clientX - rect.left) * dpr;
    const my = (e.clientY - rect.top) * dpr;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.44;
    const dist = Math.hypot(mx - cx, my - cy);

    /* find closest ring boundary */
    let closest = 0;
    let minGap = Infinity;
    for (let ring = 0; ring < RING_RADII_FRAC.length; ring++) {
      const rr = R * RING_RADII_FRAC[ring];
      const gap = Math.abs(dist - rr);
      if (gap < minGap) { minGap = gap; closest = ring; }
    }
    /* also accept clicks within ring 0 centre zone */
    if (dist < R * 0.09) closest = 0;

    setActiveLayer(prev => prev === closest ? null : closest);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Derived values for readout                                        */
  /* ---------------------------------------------------------------- */

  const belongingWarmth = Math.max(0, Math.round(100 - loneliness * 0.85));

  const warmthDesc = (() => {
    if (belongingWarmth >= 80) return {
      en: "The web is rich and close — oxytocin is flowing, your nervous system is co-regulated by those who truly know you.",
      zh: "关系网浓密而亲近——催产素在流动，你的神经系统被真正懂你的人所共同调节。",
    };
    if (belongingWarmth >= 55) return {
      en: "A functional web with some warmth — but the deeper circles may still be hungry. Depth matters more than count.",
      zh: "关系网尚在运作，有一定温度——但更深的圈层或许仍在饥饿之中。深度，比数量更重要。",
    };
    if (belongingWarmth >= 30) return {
      en: "The outer links are thinning. Many digital contacts, perhaps — but oxytocin needs presence, touch, being truly seen.",
      zh: "外层连接正在消退。也许拥有许多数字联系——但催产素需要在场、触碰、被真正看见。",
    };
    return {
      en: "Loneliness here is a hunger signal, not a character flaw. The modern epidemic: connected everywhere, close to almost no one.",
      zh: "此处的孤独是一种饥饿信号，而非性格缺陷。现代流行病：处处相连，却几乎与任何人都不亲近。",
    };
  })();

  const activeLayerData = activeLayer !== null ? RELATION_LAYERS[activeLayer] : null;

  /* ---------------------------------------------------------------- */
  /*  Warmth meter colour                                               */
  /* ---------------------------------------------------------------- */

  const meterColor = loneliness < 40 ? "#ff8c9e" : loneliness < 70 ? "#ffd29a" : "#6ee9d4";

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="rounded-xl border border-dawn-500/15 bg-void-900/60 p-5 md:p-7">

      {/* Header */}
      <div className="mb-1 label-mono">
        {lang === "zh" ? "关系网络 · 同心归属圈" : "Relationship Web · concentric belonging"}
      </div>
      <p className={`mt-2 mb-6 text-sm leading-relaxed text-bone-300 max-w-2xl ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "邓巴的圈层研究揭示：我们与生俱来地嵌入同心的归属圈中——自我、至亲、密友、社群、众生。拖动孤独滑块，感受网络如何变化。"
          : "Dunbar's circle research reveals we are wired for concentric belonging — self, intimates, close friends, community, humanity. Drag the loneliness slider to feel the web change."}
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

        {/* ---- Canvas ---- */}
        <div className="relative aspect-square w-full max-w-[560px] mx-auto">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer"
            onClick={handleCanvasClick}
            aria-label={lang === "zh" ? "关系网络图，点击圈层查看详情" : "Relationship web diagram, click a ring to see details"}
          />

          {/* Ring labels overlaid as SVG — so they track language */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {RELATION_LAYERS.map((layer, i) => {
              /* label at top of each ring */
              const rFrac = RING_RADII_FRAC[i];
              if (rFrac === 0) return null;
              /* position along top (–π/2 angle) */
              const lx = 50;
              const ly = 50 - rFrac * 44 - 3.2;
              const isAct = activeLayer === i;
              return (
                <text
                  key={layer.key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="auto"
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Space Mono, monospace"}
                  fontSize={lang === "zh" ? "3.1" : "2.7"}
                  letterSpacing={lang === "zh" ? "0" : "0.5"}
                  fill={layer.color}
                  opacity={isAct ? 1 : 0.55}
                  className={lang === "zh" ? "zh" : ""}
                >
                  {layer.name[lang]}
                </text>
              );
            })}
          </svg>
        </div>

        {/* ---- Controls + readout ---- */}
        <div className="flex flex-col gap-6">

          {/* Loneliness slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label-mono" style={{ color: "#ff8c9e" }}>
                {lang === "zh" ? "孤独感" : "Loneliness"}
              </span>
              <span className="font-mono text-[0.68rem] text-bone-500">{loneliness}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={loneliness}
              onChange={e => setLoneliness(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#ff6b81" }}
              aria-label={lang === "zh" ? "孤独感滑块" : "Loneliness slider"}
            />
            <div className="flex justify-between mt-1 font-mono text-[0.6rem] text-bone-500">
              <span className={lang === "zh" ? "zh" : ""}>{lang === "zh" ? "深度连结" : "deep belonging"}</span>
              <span className={lang === "zh" ? "zh" : ""}>{lang === "zh" ? "深度孤独" : "deep isolation"}</span>
            </div>
          </div>

          {/* Belonging warmth meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label-mono" style={{ color: meterColor }}>
                {lang === "zh" ? "归属温度" : "Belonging warmth"}
              </span>
              <span className="font-mono text-[0.68rem]" style={{ color: meterColor }}>{belongingWarmth}</span>
            </div>
            <div className="h-2 rounded-full bg-void-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${belongingWarmth}%`,
                  background: `linear-gradient(90deg, #ff6b81, ${meterColor})`,
                  boxShadow: `0 0 10px ${meterColor}66`,
                }}
              />
            </div>
            <p className={`mt-3 text-xs leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
              {warmthDesc[lang]}
            </p>
          </div>

          {/* Divider */}
          <div className="rule-warm" />

          {/* Active layer detail card */}
          {activeLayerData ? (
            <div
              className="card rounded-lg p-4 transition-all duration-500"
              style={{ borderColor: `${activeLayerData.color}33` }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className={`display text-xl ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: activeLayerData.color }}
                >
                  {activeLayerData.name[lang]}
                </span>
                <span className="font-mono text-[0.65rem] text-bone-500">
                  {activeLayerData.count[lang]}
                </span>
              </div>
              <p className={`text-sm leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
                {activeLayerData.note[lang]}
              </p>
              <div
                className="mt-3 flex items-center gap-2"
                title={lang === "zh" ? "圈层温暖度" : "Layer warmth"}
              >
                <span className="font-mono text-[0.6rem] text-bone-500 uppercase tracking-widest">
                  {lang === "zh" ? "温暖度" : "warmth"}
                </span>
                <div className="flex-1 h-1 rounded-full bg-void-700 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${activeLayerData.warmth}%`,
                      background: activeLayerData.color,
                      boxShadow: `0 0 6px ${activeLayerData.color}88`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <span className="font-mono text-[0.6rem]" style={{ color: activeLayerData.color }}>
                  {activeLayerData.warmth}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dawn-500/10 bg-void-800/40 p-4 text-center">
              <p className={`text-xs text-bone-500 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh"
                  ? "点击图中任意圈层，查看该层的详情"
                  : "Click any ring in the web to inspect that layer"}
              </p>
            </div>
          )}

          {/* Layer legend */}
          <div className="space-y-2">
            <div className="label-mono mb-3">{lang === "zh" ? "圈层图例" : "Layer legend"}</div>
            {RELATION_LAYERS.map((layer, i) => (
              <button
                key={layer.key}
                onClick={() => setActiveLayer(prev => prev === i ? null : i)}
                className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-all duration-300 ${
                  activeLayer === i
                    ? "bg-void-700/70 border border-dawn-500/20"
                    : "hover:bg-void-800/50 border border-transparent"
                }`}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 node-pulse"
                  style={{
                    background: layer.color,
                    boxShadow: `0 0 8px ${layer.color}88`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
                <span
                  className={`text-xs font-medium ${lang === "zh" ? "zh" : "font-mono"}`}
                  style={{ color: layer.color }}
                >
                  {layer.name[lang]}
                </span>
                <span className="ml-auto font-mono text-[0.6rem] text-bone-500">
                  {layer.count[lang]}
                </span>
              </button>
            ))}
          </div>

          {/* Loneliness epidemic note */}
          <div className="rule-warm" />
          <div className="rounded-lg bg-void-800/50 border border-rose-500/15 p-4">
            <div className="label-mono mb-2" style={{ color: "#ff8c9e" }}>
              {lang === "zh" ? "孤独流行病" : "The loneliness epidemic"}
            </div>
            <p className={`text-xs leading-relaxed text-bone-300 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "许多弱联系的数字连接，可能会欺骗我们以为归属感得到了满足——却同时饿坏了真正需要喂养的胃口：深度在场、触碰、被懂得。催产素不接受点赞。"
                : "Many weak digital ties can fool us into thinking the belonging need is met — while starving the appetite that actually needs feeding: deep presence, touch, being truly known. Oxytocin does not accept likes."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
