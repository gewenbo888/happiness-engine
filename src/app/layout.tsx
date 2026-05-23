import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Happiness Engine · The Nature of Happiness, Meaning, Emotion, Consciousness & Human Flourishing";
const TITLE_ZH = "幸福引擎 · 关于幸福、意义、情绪、意识与人类繁盛的本质";
const DESC =
  "A civilisation-scale, bilingual exploration of happiness, pleasure, meaning, emotion, suffering, love, flow, and consciousness — integrating neuroscience, philosophy, contemplative traditions and AI into one model of human flourishing.";

export const metadata: Metadata = {
  metadataBase: new URL("https://happiness-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "happiness", "meaning", "eudaimonia", "hedonia", "flourishing", "wellbeing",
    "emotion", "consciousness", "flow state", "dopamine", "serotonin", "oxytocin",
    "neurochemistry of happiness", "positive psychology", "philosophy of happiness",
    "suffering", "Buddhism", "Stoicism", "meditation", "love and relationships",
    "digital happiness", "AI wellbeing", "future of flourishing",
    "幸福", "意义", "情绪", "意识", "心流", "多巴胺", "血清素", "繁盛",
    "积极心理学", "幸福哲学", "苦难", "佛教", "斯多葛", "冥想", "数字幸福",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Happiness Engine · 幸福引擎 — the nature of happiness, meaning, emotion, consciousness & human flourishing",
      },
    ],
    title: TITLE_EN,
    description:
      "Humans do not merely seek pleasure — they seek meaning, connection, harmony, growth and inner coherence. A bilingual atlas of happiness and human flourishing.",
    url: "https://happiness-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description:
      "Pleasure vs meaning, dopamine vs serotonin, flow, love, suffering, contemplative traditions & the future of wellbeing — one bilingual model of human flourishing.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0608" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Mono:wght@400;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://happiness-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-bone-100 antialiased">
        {children}
        <Script
          src="https://analytics-dashboard-two-blue.vercel.app/tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
