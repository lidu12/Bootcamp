import React, { useState } from "react";
import { X, Check, Palette, Type, Sliders } from "lucide-react";
import { THEMES } from "../theme/themes";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from "../theme/typography";
import { useTheme } from "../context/ThemeContext";

interface ThemeSelectorModalProps {
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ onClose }) => {
  const {
    activeTheme,
    shadeMode,
    activeFont,
    activeFontSize,
    setTheme,
    setShadeMode,
    setFont,
    setFontSize,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<"theme" | "typography">("theme");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(THEMES.map((t) => t.category)))];

  const filteredThemes = selectedCategory === "All"
    ? THEMES
    : THEMES.filter((t) => t.category === selectedCategory);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "820px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "var(--color-primary-500)", color: "#fff" }}>
              <Palette size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", color: "var(--color-text)", fontWeight: 700 }}>
                Display & Design Settings
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                Choose your aesthetic theme, shade intensity (Dark, Medium, Light), and font styles
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Shade Level Selector Banner */}
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "rgba(0,0,0,0.06)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--color-text)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sliders size={16} style={{ color: "var(--color-primary-500)" }} /> Shade Mode:
          </span>

          <div style={{ display: "flex", gap: "6px" }}>
            {(["dark", "medium", "light"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShadeMode(s)}
                className={`btn btn-sm ${shadeMode === s ? "btn-primary" : "btn-outline"}`}
                style={{ borderRadius: "9999px", padding: "5px 14px", fontSize: "0.82rem", textTransform: "capitalize" }}
              >
                {s === "dark" ? "🌑 Dark Shade" : s === "medium" ? "🌓 Medium Shade" : "☀️ Light Shade"}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", padding: "0 24px", backgroundColor: "rgba(0,0,0,0.08)" }}>
          <button
            onClick={() => setActiveTab("theme")}
            className="btn"
            style={{
              borderRadius: 0,
              borderBottom: activeTab === "theme" ? "2px solid var(--color-primary-500)" : "2px solid transparent",
              color: activeTab === "theme" ? "var(--color-primary-500)" : "var(--color-text-muted)",
              background: "none",
              padding: "12px 16px",
            }}
          >
            <Palette size={16} /> Curated Aesthetics ({THEMES.length})
          </button>

          <button
            onClick={() => setActiveTab("typography")}
            className="btn"
            style={{
              borderRadius: 0,
              borderBottom: activeTab === "typography" ? "2px solid var(--color-primary-500)" : "2px solid transparent",
              color: activeTab === "typography" ? "var(--color-primary-500)" : "var(--color-text-muted)",
              background: "none",
              padding: "12px 16px",
            }}
          >
            <Type size={16} /> Font Style & Size
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {activeTab === "theme" ? (
            <>
              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-outline"}`}
                    style={{ borderRadius: "9999px", padding: "4px 14px", whiteSpace: "nowrap" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Themes Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "14px",
                }}
              >
                {filteredThemes.map((t) => {
                  const isSelected = activeTheme.id === t.id;
                  const cardBg = shadeMode === "dark" ? t.darkCard : shadeMode === "medium" ? t.mediumCard : t.lightCard;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        backgroundColor: cardBg,
                        border: isSelected ? "2px solid var(--color-primary-500)" : "1.5px solid var(--color-border)",
                        boxShadow: isSelected ? "0 0 0 2px var(--color-primary-500)" : "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--color-text)" }}>{t.name}</span>
                        {isSelected && <Check size={16} style={{ color: "var(--color-primary-500)" }} />}
                      </div>

                      {t.vibe && (
                        <p style={{ fontSize: "0.76rem", color: "var(--color-text-muted)", lineHeight: 1.4, margin: 0 }}>
                          {t.vibe}
                        </p>
                      )}

                      {/* 6-Shade Color Scale Swatch */}
                      <div style={{ display: "flex", height: "20px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", marginTop: "auto" }}>
                        <div style={{ flex: 1, backgroundColor: t.colors[50] }} title="50" />
                        <div style={{ flex: 1, backgroundColor: t.colors[100] }} title="100" />
                        <div style={{ flex: 1, backgroundColor: t.colors[300] }} title="300" />
                        <div style={{ flex: 1, backgroundColor: t.colors[500] }} title="500" />
                        <div style={{ flex: 1, backgroundColor: t.colors[700] }} title="700" />
                        <div style={{ flex: 1, backgroundColor: t.colors[900] }} title="900" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Typography Tab */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Font Family Selection */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Type size={18} style={{ color: "var(--color-primary-500)" }} /> Select Font Family / Style
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = activeFont.id === f.id;

                    return (
                      <div
                        key={f.id}
                        onClick={() => setFont(f.id)}
                        style={{
                          padding: "16px",
                          borderRadius: "14px",
                          backgroundColor: isSelected ? "rgba(16,185,129,0.12)" : "var(--color-card)",
                          border: isSelected ? "2px solid var(--color-primary-500)" : "1px solid var(--color-border)",
                          cursor: "pointer",
                          fontFamily: f.family,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)" }}>{f.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            The quick brown fox jumps over the lazy dog.
                          </div>
                        </div>
                        {isSelected && <Check size={18} style={{ color: "var(--color-primary-500)", flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Selection */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={18} style={{ color: "var(--color-primary-500)" }} /> Select Base Font Size
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                  {FONT_SIZE_OPTIONS.map((s) => {
                    const isSelected = activeFontSize.id === s.id;

                    return (
                      <button
                        key={s.id}
                        onClick={() => setFontSize(s.id)}
                        className={`btn ${isSelected ? "btn-primary" : "btn-outline"}`}
                        style={{ padding: "14px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                      >
                        <span style={{ fontSize: `${s.sizePx}px`, fontWeight: 700 }}>{s.name}</span>
                        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Base {s.sizePx}px</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-primary">
            Done & Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
