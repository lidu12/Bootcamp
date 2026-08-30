import React, { createContext, useContext, useState, useEffect } from "react";
import { THEMES, DEFAULT_THEME, type ThemeConfig } from "../theme/themes";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS, type FontOption, type FontSizeOption } from "../theme/typography";
import { applyTheme, applyTypography, type ShadeMode } from "../theme/themeEngine";

export type { ShadeMode };

interface ThemeContextType {
  activeTheme: ThemeConfig;
  shadeMode: ShadeMode;
  isDarkMode: boolean;
  activeFont: FontOption;
  activeFontSize: FontSizeOption;
  setTheme: (themeId: string) => void;
  setShadeMode: (shade: ShadeMode) => void;
  cycleShade: () => void;
  setFont: (fontId: string) => void;
  setFontSize: (sizeId: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem("devbloom_theme");
    return THEMES.find((t) => t.id === saved) || DEFAULT_THEME;
  });

  const [shadeMode, setShadeModeState] = useState<ShadeMode>(() => {
    const saved = localStorage.getItem("devbloom_shade");
    if (saved === "dark" || saved === "medium" || saved === "light") {
      return saved as ShadeMode;
    }
    const legacyMode = localStorage.getItem("devbloom_mode");
    return legacyMode === "light" ? "light" : "dark";
  });

  const [activeFont, setActiveFontState] = useState<FontOption>(() => {
    const saved = localStorage.getItem("devbloom_font");
    return FONT_OPTIONS.find((f) => f.id === saved) || FONT_OPTIONS[0]; // Inter default
  });

  const [activeFontSize, setActiveFontSizeState] = useState<FontSizeOption>(() => {
    const saved = localStorage.getItem("devbloom_fontsize");
    return FONT_SIZE_OPTIONS.find((s) => s.id === saved) || FONT_SIZE_OPTIONS[1]; // 16px default
  });

  useEffect(() => {
    applyTheme(activeTheme, shadeMode);
  }, [activeTheme, shadeMode]);

  useEffect(() => {
    applyTypography(activeFont, activeFontSize);
  }, [activeFont, activeFontSize]);

  const setTheme = (themeId: string) => {
    const found = THEMES.find((t) => t.id === themeId);
    if (found) {
      setActiveThemeState(found);
      localStorage.setItem("devbloom_theme", themeId);
    }
  };

  const setShadeMode = (shade: ShadeMode) => {
    setShadeModeState(shade);
    localStorage.setItem("devbloom_shade", shade);
    localStorage.setItem("devbloom_mode", shade === "dark" ? "dark" : "light");
  };

  const cycleShade = () => {
    setShadeModeState((prev) => {
      let next: ShadeMode = "dark";
      if (prev === "dark") next = "medium";
      else if (prev === "medium") next = "light";
      else next = "dark";

      localStorage.setItem("devbloom_shade", next);
      localStorage.setItem("devbloom_mode", next === "dark" ? "dark" : "light");
      return next;
    });
  };

  const toggleDarkMode = () => {
    cycleShade();
  };

  const setFont = (fontId: string) => {
    const found = FONT_OPTIONS.find((f) => f.id === fontId);
    if (found) {
      setActiveFontState(found);
      localStorage.setItem("devbloom_font", fontId);
    }
  };

  const setFontSize = (sizeId: string) => {
    const found = FONT_SIZE_OPTIONS.find((s) => s.id === sizeId);
    if (found) {
      setActiveFontSizeState(found);
      localStorage.setItem("devbloom_fontsize", sizeId);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        shadeMode,
        isDarkMode: shadeMode === "dark",
        activeFont,
        activeFontSize,
        setTheme,
        setShadeMode,
        cycleShade,
        setFont,
        setFontSize,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
