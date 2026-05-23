"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background: a warm, breathing field of luminous soft particles.
 * Particles drift on slow flow-noise, glow in the four emotional hues
 * (dawn / rose / calm / mind), and gently link to nearby neighbours —
 * a living emotional weather system. Canvas-2D only (no WebGL).
 */
export default function EmotionField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = (canvas.width = canvas.clientWidth * dpr);
    let h = (canvas.height = canvas.clientHeight * dpr);

    const HUES = [
      [255, 158, 79], // dawn
      [255, 107, 129], // rose
      [61, 214, 189], // calm
      [168, 127, 255], // mind
      [255, 210, 154], // soft gold
    ];

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      c: number[];
      phase: number;
      sp: number;
    };
    const COUNT = Math.min(72, Math.floor((w * h) / (42000 * dpr)));
    const ps: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (1.2 + Math.random() * 2.8) * dpr,
      c: HUES[(Math.random() * HUES.length) | 0],
      phase: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.8,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      w = canvas.width = canvas.clientWidth * dpr;
      h = canvas.height = canvas.clientHeight * dpr;
    };
    window.addEventListener("resize", onResize);

    const linkDist = 150 * dpr;

    const tick = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      // global breathing scale on glow
      const breath = 0.85 + 0.15 * Math.sin(t * 0.9);

      for (const p of ps) {
        // gentle flow-field drift
        p.vx += Math.cos(p.y * 0.0012 + t) * 0.004 * dpr;
        p.vy += Math.sin(p.x * 0.0012 + t * 0.8) * 0.004 * dpr;

        // soft attraction to cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dm = Math.hypot(dx, dy);
        if (dm < 220 * dpr && dm > 0.001) {
          const f = (1 - dm / (220 * dpr)) * 0.06;
          p.vx += (dx / dm) * f;
          p.vy += (dy / dm) * f;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // links
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i];
          const b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.18;
            const c = a.c;
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
            ctx.lineWidth = 0.7 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of ps) {
        const pulse = 0.6 + 0.4 * Math.sin(t * p.sp + p.phase);
        const [r, g, bl] = p.c;
        ctx.shadowColor = `rgba(${r},${g},${bl},${0.85 * breath})`;
        ctx.shadowBlur = 16 * dpr * pulse;
        ctx.fillStyle = `rgba(${r},${g},${bl},${0.85 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.85 + 0.3 * pulse), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
