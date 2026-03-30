export type TechCategory = {
  label: string;
  color: string;
  techs: string[];
};

export const TECH_CATEGORIES: TechCategory[] = [
  {
    label: "Framework / Library",
    color: "bg-blue-100 text-blue-800",
    techs: ["React", "Next.js", "Vue", "Nuxt.js", "Angular", "Svelte", "Remix", "Astro"],
  },
  {
    label: "Language",
    color: "bg-purple-100 text-purple-800",
    techs: ["JavaScript", "TypeScript"],
  },
  {
    label: "Styling",
    color: "bg-pink-100 text-pink-800",
    techs: ["Tailwind CSS", "shadcn/ui", "Styled Components", "Emotion", "CSS Modules", "SCSS", "MUI"],
  },
  {
    label: "State Management",
    color: "bg-orange-100 text-orange-800",
    techs: ["Redux", "Zustand", "Jotai", "Recoil", "MobX", "SWR", "TanStack Query"],
  },
  {
    label: "Build / Tooling",
    color: "bg-yellow-100 text-yellow-800",
    techs: ["Vite", "Webpack", "Turborepo", "Nx", "Rollup", "Bun", "Biome"],
  },
  {
    label: "Testing",
    color: "bg-green-100 text-green-800",
    techs: ["Jest", "Vitest", "Playwright", "Cypress", "Testing Library"],
  },
  {
    label: "Infrastructure",
    color: "bg-gray-100 text-gray-700",
    techs: ["AWS", "Vercel", "Netlify", "Docker", "GitHub Actions"],
  },
];

export const ALL_TECHS = TECH_CATEGORIES.flatMap((c) => c.techs);

export const TECH_COLOR_MAP: Record<string, string> = Object.fromEntries(
  TECH_CATEGORIES.flatMap((c) => c.techs.map((t) => [t, c.color]))
);

export const TECH_ALIASES: Record<string, string> = {
  reactjs: "React",
  "react.js": "React",
  nextjs: "Next.js",
  "next.js": "Next.js",
  next: "Next.js",
  vuejs: "Vue",
  "vue.js": "Vue",
  nuxtjs: "Nuxt.js",
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  "tailwind": "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "styled-components": "Styled Components",
  "react-query": "React Query",
  tanstack: "TanStack Query",
  "tanstack-query": "TanStack Query",
  shadcn: "shadcn/ui",
  "shadcn-ui": "shadcn/ui",
};
