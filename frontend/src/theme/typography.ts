export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: "sans-serif" | "serif" | "monospace";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inter", name: "Inter (Modern Tech)", family: "'Inter', system-ui, -apple-system, sans-serif", category: "sans-serif" },
  { id: "calibri", name: "Calibri (Clean Corporate)", family: "'Calibri', 'Segoe UI', sans-serif", category: "sans-serif" },
  { id: "times-new-roman", name: "Times New Roman (Editorial Serif)", family: "'Times New Roman', Times, serif", category: "serif" },
  { id: "roboto", name: "Roboto (Clean Sans)", family: "'Roboto', sans-serif", category: "sans-serif" },
  { id: "outfit", name: "Outfit (Geometric)", family: "'Outfit', sans-serif", category: "sans-serif" },
  { id: "georgia", name: "Georgia (Classic Serif)", family: "'Georgia', serif", category: "serif" },
  { id: "jetbrains-mono", name: "JetBrains Mono (Developer Code)", family: "'JetBrains Mono', 'Fira Code', monospace", category: "monospace" },
  { id: "system", name: "System Standard", family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", category: "sans-serif" }
];

export interface FontSizeOption {
  id: string;
  name: string;
  sizePx: number; // base font size in px
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: "sm", name: "Small (14px)", sizePx: 14 },
  { id: "md", name: "Medium (16px)", sizePx: 16 },
  { id: "lg", name: "Large (18px)", sizePx: 18 },
  { id: "xl", name: "Extra Large (20px)", sizePx: 20 }
];
