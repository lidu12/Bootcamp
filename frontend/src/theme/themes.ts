export interface ColorScale {
  50: string;
  100: string;
  300: string;
  500: string; // Primary accent brand color
  700: string; // Dark theme text / strong accent
  900: string; // Darkest theme text (super readable & dark)
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: string;
  vibe: string;
  accents: string;
  colors: ColorScale;
  darkBg: string;
  darkCard: string;
  mediumBg: string;
  mediumCard: string;
  lightBg: string;
  lightCard: string;
  previewBg: string;
}

export const THEMES: ThemeConfig[] = [
  // 🌸 Pink & Pastel Aesthetics (1-4)
  {
    id: "rose-gold-champagne",
    name: "Rose Gold & Champagne",
    category: "Pink & Pastel Aesthetics",
    vibe: "Soft luxury, warm rosy blush, subtle gold borders, and dark velvet slate backgrounds.",
    accents: "Dusty rose, soft blush pink, champagne gold",
    colors: {
      50: "#fdf8f6",
      100: "#fceee9",
      300: "#f4b8aa",
      500: "#c85a6a",
      700: "#8c2d3c",
      900: "#45121b"
    },
    darkBg: "#130f17",
    darkCard: "#1f1826",
    mediumBg: "#f5e6e8",
    mediumCard: "#faeff1",
    lightBg: "#faf5f5",
    lightCard: "#ffffff",
    previewBg: "#c85a6a"
  },
  {
    id: "sakura-blossom",
    name: "Sakura Blossom",
    category: "Pink & Pastel Aesthetics",
    vibe: "Japanese cherry blossom aesthetic with delicate pink petals and radiant blossom glow.",
    accents: "Sakura pink, petal magenta, soft pastel highlights",
    colors: {
      50: "#fff0f5",
      100: "#fce7f3",
      300: "#f9a8d4",
      500: "#db2777",
      700: "#9d174d",
      900: "#500724"
    },
    darkBg: "#160c15",
    darkCard: "#231322",
    mediumBg: "#fce2ee",
    mediumCard: "#faeef5",
    lightBg: "#fdf2f8",
    lightCard: "#ffffff",
    previewBg: "#db2777"
  },
  {
    id: "cotton-candy-pastel",
    name: "Cotton Candy Pastel",
    category: "Pink & Pastel Aesthetics",
    vibe: "Playful, sweet, dreamy contrast between baby pink, lavender, and pastel sky blue.",
    accents: "Bubblegum pink, pastel cyan, baby lavender",
    colors: {
      50: "#fdf2f8",
      100: "#f5d0fe",
      300: "#c084fc",
      500: "#d946ef",
      700: "#86198f",
      900: "#4a044e"
    },
    darkBg: "#110e1c",
    darkCard: "#1c162e",
    mediumBg: "#f6e3fb",
    mediumCard: "#fbf0fe",
    lightBg: "#fdf4ff",
    lightCard: "#ffffff",
    previewBg: "#d946ef"
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    category: "Pink & Pastel Aesthetics",
    vibe: "Calming, reflective floral lilac tones designed for relaxed, late-night coding sessions.",
    accents: "Soft lilac, muted purple, gentle violet",
    colors: {
      50: "#faf5ff",
      100: "#f3e8ff",
      300: "#d8b4fe",
      500: "#9333ea",
      700: "#6b21a8",
      900: "#3b0764"
    },
    darkBg: "#0f0d1b",
    darkCard: "#19152b",
    mediumBg: "#ede4fb",
    mediumCard: "#f6f0fd",
    lightBg: "#faf5ff",
    lightCard: "#ffffff",
    previewBg: "#9333ea"
  },

  // 🌌 Deep Dark & Cyberpunk Aesthetics (5-7)
  {
    id: "midnight-velvet",
    name: "Midnight Velvet",
    category: "Deep Dark & Cyberpunk Aesthetics",
    vibe: "Sleek high-contrast dark mode with rich plum and deep burgundy undertones.",
    accents: "Crimson pink, velvet ruby, dark charcoal",
    colors: {
      50: "#fff1f2",
      100: "#ffe4e6",
      300: "#fda4af",
      500: "#e11d48",
      700: "#9f1239",
      900: "#4c0519"
    },
    darkBg: "#0d080c",
    darkCard: "#191018",
    mediumBg: "#fde2e6",
    mediumCard: "#faedf0",
    lightBg: "#fff1f2",
    lightCard: "#ffffff",
    previewBg: "#e11d48"
  },
  {
    id: "cyber-neon-tokyo",
    name: "Cyber Neon Tokyo",
    category: "Deep Dark & Cyberpunk Aesthetics",
    vibe: "Futuristic synthwave cyberpunk energy with high-voltage neon pink and electric purple.",
    accents: "Neon magenta (#ff007f), electric cyan, ultra-violet",
    colors: {
      50: "#fdf2f8",
      100: "#fce7f3",
      300: "#f472b6",
      500: "#ff007f",
      700: "#a21caf",
      900: "#4a044e"
    },
    darkBg: "#090710",
    darkCard: "#151024",
    mediumBg: "#fce0f1",
    mediumCard: "#faecf6",
    lightBg: "#fdf2f8",
    lightCard: "#ffffff",
    previewBg: "#ff007f"
  },
  {
    id: "amethyst-crystal",
    name: "Amethyst Crystal",
    category: "Deep Dark & Cyberpunk Aesthetics",
    vibe: "Royal jewel-tone purple with glowing amethyst accents and rich crystalline dark backgrounds.",
    accents: "Bright amethyst, royal violet, orchid purple",
    colors: {
      50: "#faf5ff",
      100: "#ede9fe",
      300: "#c4b5fd",
      500: "#7c3aed",
      700: "#5b21b6",
      900: "#2e1065"
    },
    darkBg: "#0b0916",
    darkCard: "#17132c",
    mediumBg: "#e8e2fa",
    mediumCard: "#f4f0fd",
    lightBg: "#f5f3ff",
    lightCard: "#ffffff",
    previewBg: "#7c3aed"
  },

  // 🌿 Nature & Minimalist Aesthetics (8-10)
  {
    id: "matcha-cherry",
    name: "Matcha & Cherry",
    category: "Nature & Minimalist Aesthetics",
    vibe: "Earthy zen matcha green balanced with soft cherry blossom pink accents.",
    accents: "Fresh matcha green, sage, subtle pink highlights",
    colors: {
      50: "#f0fdf4",
      100: "#dcfce7",
      300: "#86efac",
      500: "#16a34a",
      700: "#166534",
      900: "#052e16"
    },
    darkBg: "#0c130e",
    darkCard: "#142218",
    mediumBg: "#e2f5e8",
    mediumCard: "#edf9f1",
    lightBg: "#f0fdf4",
    lightCard: "#ffffff",
    previewBg: "#16a34a"
  },
  {
    id: "sunset-boulevard",
    name: "Sunset Boulevard",
    category: "Nature & Minimalist Aesthetics",
    vibe: "Warm golden hour glow with radiant peach, coral, and sunset rose gradients.",
    accents: "Warm coral, amber gold, sunset peach",
    colors: {
      50: "#fff7ed",
      100: "#ffedd5",
      300: "#fdba74",
      500: "#ea580c",
      700: "#9a3412",
      900: "#431407"
    },
    darkBg: "#150d09",
    darkCard: "#23150f",
    mediumBg: "#fee7d6",
    mediumCard: "#fff2e8",
    lightBg: "#fff7ed",
    lightCard: "#ffffff",
    previewBg: "#ea580c"
  },
  {
    id: "nordic-minimalist-rose",
    name: "Nordic Minimalist Rose",
    category: "Nature & Minimalist Aesthetics",
    vibe: "Clean, distraction-free Scandinavian studio aesthetic with cool slate grays and muted dusty rose.",
    accents: "Nordic slate, muted blush, frosty silver",
    colors: {
      50: "#f8fafc",
      100: "#f1f5f9",
      300: "#cbd5e1",
      500: "#db7093",
      700: "#6b3048",
      900: "#331221"
    },
    darkBg: "#0f172a",
    darkCard: "#1e293b",
    mediumBg: "#e8edf2",
    mediumCard: "#f3f6f9",
    lightBg: "#f8fafc",
    lightCard: "#ffffff",
    previewBg: "#db7093"
  }
];

export const DEFAULT_THEME = THEMES[0]; // Rose Gold & Champagne
