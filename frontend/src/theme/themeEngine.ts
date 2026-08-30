import type { ThemeConfig } from "./themes";
import type { FontOption, FontSizeOption } from "./typography";

function hexToRgb(hex: string): string {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map(x => x + x).join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return "16, 185, 129";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

export type ShadeMode = "dark" | "medium" | "light";

export function applyTheme(theme: ThemeConfig, shade: ShadeMode | boolean = "dark"): void {
  const root = document.documentElement;

  const currentShade: ShadeMode = typeof shade === "boolean" ? (shade ? "dark" : "light") : shade;

  root.setAttribute("data-theme", theme.id);
  root.setAttribute("data-shade", currentShade);
  root.setAttribute("data-mode", currentShade === "dark" ? "dark" : "light");

  const primaryRgb = hexToRgb(theme.colors[500]);
  root.style.setProperty("--primary-rgb", primaryRgb);

  // Inject primary color scale variables
  root.style.setProperty("--color-primary-50", theme.colors[50]);
  root.style.setProperty("--color-primary-100", theme.colors[100]);
  root.style.setProperty("--color-primary-300", theme.colors[300]);
  root.style.setProperty("--color-primary-500", theme.colors[500]);
  root.style.setProperty("--color-primary-700", theme.colors[700]);
  root.style.setProperty("--color-primary-900", theme.colors[900]);

  // Full Page Background & Clean Defined Themed Panels for each shade level
  if (currentShade === "dark") {
    root.style.setProperty("--color-bg", theme.darkBg);
    root.style.setProperty("--color-card", theme.darkCard);
    root.style.setProperty("--color-card-hover", `rgba(${primaryRgb}, 0.15)`);
    root.style.setProperty("--color-text", theme.colors[50]);
    root.style.setProperty("--color-text-muted", theme.colors[300]);
    root.style.setProperty("--color-border", `rgba(${primaryRgb}, 0.38)`);
    root.style.setProperty("--color-glass-bg", theme.darkCard);
    root.style.setProperty("--color-glass-border", `rgba(${primaryRgb}, 0.38)`);
  } else if (currentShade === "medium") {
    root.style.setProperty("--color-bg", theme.mediumBg);
    root.style.setProperty("--color-card", theme.mediumCard);
    root.style.setProperty("--color-card-hover", `rgba(${primaryRgb}, 0.12)`);
    root.style.setProperty("--color-text", theme.colors[900]);
    root.style.setProperty("--color-text-muted", theme.colors[700]);
    root.style.setProperty("--color-border", `rgba(${primaryRgb}, 0.32)`);
    root.style.setProperty("--color-glass-bg", theme.mediumCard);
    root.style.setProperty("--color-glass-border", `rgba(${primaryRgb}, 0.32)`);
  } else {
    // light shade
    root.style.setProperty("--color-bg", theme.lightBg);
    root.style.setProperty("--color-card", theme.lightCard);
    root.style.setProperty("--color-card-hover", `rgba(${primaryRgb}, 0.08)`);
    root.style.setProperty("--color-text", theme.colors[900]);
    root.style.setProperty("--color-text-muted", theme.colors[700]);
    root.style.setProperty("--color-border", `rgba(${primaryRgb}, 0.28)`);
    root.style.setProperty("--color-glass-bg", theme.lightCard);
    root.style.setProperty("--color-glass-border", `rgba(${primaryRgb}, 0.28)`);
  }
}

export function applyTypography(font: FontOption, fontSize: FontSizeOption): void {
  const root = document.documentElement;
  root.style.setProperty("--app-font-family", font.family);
  root.style.setProperty("--app-font-size-base", `${fontSize.sizePx}px`);
}


