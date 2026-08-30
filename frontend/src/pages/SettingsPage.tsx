import React, { useState } from "react";
import { User as UserIcon, Palette, Check, Save, Type } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../theme/themes";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from "../theme/typography";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { activeTheme, shadeMode, setShadeMode, activeFont, activeFontSize, setTheme, setFont, setFontSize } = useTheme();

  const [bio, setBio] = useState(user?.bio || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        bio,
        timezone,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: "32px 20px", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "28px",
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)", fontWeight: 800 }}>Preferences & Typography Settings</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Customize your aesthetic theme, font family (Times New Roman, Calibri, Inter, etc.), and font sizes
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <UserIcon size={22} style={{ color: "var(--color-primary-500)" }} />
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-text)", fontWeight: 700 }}>Developer Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" disabled className="form-input" value={user?.username || "developer"} style={{ opacity: 0.7 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select className="form-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Africa/Addis_Ababa">Africa/Addis_Ababa (EAT)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Learning Goal</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="e.g. Building 180 days of AI Engineering & Full Stack..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
              <button type="submit" disabled={saving} className="btn btn-primary">
                <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
              </button>
              {savedSuccess && <span style={{ color: "var(--color-primary-500)", fontSize: "0.85rem", fontWeight: 700 }}>✓ Settings Saved!</span>}
            </div>
          </form>
        </div>

        {/* Font Family & Typography Settings */}
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Type size={22} style={{ color: "var(--color-primary-500)" }} />
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-text)", fontWeight: 700 }}>Font Family & Font Size</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Font Family / Style</label>
            <select className="form-select" value={activeFont.id} onChange={(e) => setFont(e.target.value)}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Selected Font: <strong style={{ color: "var(--color-text)", fontFamily: activeFont.family }}>{activeFont.name}</strong>
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Base Font Size</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {FONT_SIZE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFontSize(s.id)}
                  className={`btn btn-sm ${activeFontSize.id === s.id ? "btn-primary" : "btn-outline"}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "8px" }}>
            <label className="form-label">Shade Intensity</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {(["dark", "medium", "light"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShadeMode(s)}
                  className={`btn btn-sm ${shadeMode === s ? "btn-primary" : "btn-outline"}`}
                  style={{ textTransform: "capitalize", fontSize: "0.8rem", padding: "8px 4px" }}
                >
                  {s === "dark" ? "🌑 Dark" : s === "medium" ? "🌓 Medium" : "☀️ Light"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Curated Aesthetic Themes Section */}
      <div className="glass-panel" style={{ padding: "28px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Palette size={22} style={{ color: "var(--color-primary-500)" }} />
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-text)", fontWeight: 700 }}>Curated Color Themes</h3>
          </div>
          <span className="badge badge-primary">{THEMES.length} Aesthetics Available</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
          {THEMES.map((t) => {
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
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--color-text)" }}>{t.name}</span>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-primary-500)", fontWeight: 600 }}>{t.category}</span>
                  </div>
                  {isSelected && <Check size={16} style={{ color: "var(--color-primary-500)" }} />}
                </div>

                {t.vibe && (
                  <p style={{ fontSize: "0.76rem", color: "var(--color-text-muted)", lineHeight: 1.4, margin: 0 }}>
                    {t.vibe}
                  </p>
                )}

                <div style={{ display: "flex", height: "20px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", marginTop: "auto" }}>
                  <div style={{ flex: 1, backgroundColor: t.colors[50] }} />
                  <div style={{ flex: 1, backgroundColor: t.colors[100] }} />
                  <div style={{ flex: 1, backgroundColor: t.colors[300] }} />
                  <div style={{ flex: 1, backgroundColor: t.colors[500] }} />
                  <div style={{ flex: 1, backgroundColor: t.colors[700] }} />
                  <div style={{ flex: 1, backgroundColor: t.colors[900] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
