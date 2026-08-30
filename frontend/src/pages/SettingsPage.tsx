import React, { useState, useEffect } from "react";
import { User as UserIcon, Palette, Check, Save, Type, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../theme/themes";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from "../theme/typography";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { activeTheme, shadeMode, setShadeMode, activeFont, activeFontSize, setTheme, setFont, setFontSize } = useTheme();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setTimezone(user.timezone || "UTC");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty.");
      return;
    }

    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage("");

    try {
      await updateProfile({
        username: username.trim(),
        bio,
        timezone,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      console.error("Failed to update profile settings:", err);
      setErrorMessage(err.response?.data?.detail || "Failed to update profile. Please try again.");
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
          <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)", fontWeight: 800 }}>Preferences & Developer Settings</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Customize your developer name, aesthetic themes (Dark, Medium, Light), and typography
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
            {errorMessage && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Developer Username / Name</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name or username..."
                required
              />
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
              {savedSuccess && <span style={{ color: "var(--color-primary-500)", fontSize: "0.85rem", fontWeight: 700 }}>✓ Profile Saved!</span>}
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
            <label className="form-label">Active Font Family</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFont(f.id)}
                  className={`btn btn-sm ${activeFont.id === f.id ? "btn-primary" : "btn-outline"}`}
                  style={{ justifyContent: "space-between", fontFamily: f.family, padding: "8px 14px" }}
                >
                  <span>{f.name}</span>
                  {activeFont.id === f.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Base Font Size</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
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
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text)" }}>{t.name}</span>
                  {isSelected && <Check size={18} style={{ color: "var(--color-primary-500)" }} />}
                </div>

                <p style={{ fontSize: "0.76rem", color: "var(--color-text-muted)", lineHeight: 1.35 }}>
                  {t.vibe}
                </p>

                {/* 6-shade color palette scale */}
                <div style={{ display: "flex", height: "18px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-border)", marginTop: "auto" }}>
                  <div style={{ flex: 1, backgroundColor: t.colors[50] }} title="50 Light" />
                  <div style={{ flex: 1, backgroundColor: t.colors[100] }} title="100 Soft" />
                  <div style={{ flex: 1, backgroundColor: t.colors[300] }} title="300 Pastel" />
                  <div style={{ flex: 1, backgroundColor: t.colors[500] }} title="500 Brand" />
                  <div style={{ flex: 1, backgroundColor: t.colors[700] }} title="700 Deep" />
                  <div style={{ flex: 1, backgroundColor: t.colors[900] }} title="900 Rich Text" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
