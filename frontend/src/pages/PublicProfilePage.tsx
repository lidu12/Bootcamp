import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flame, Sparkles, AlertCircle } from "lucide-react";
import api from "../services/api";
import { StreakHeatmap, type HeatmapCell } from "../components/StreakHeatmap";

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      setError("");
      try {
        const [profRes, heatRes] = await Promise.all([
          api.get(`/users/public/${username}`),
          api.get(`/streaks/heatmap?username=${username}&days=180`),
        ]);
        setProfile(profRes.data);
        setHeatmapCells(heatRes.data);
      } catch (err: any) {
        console.error("Failed to load public profile:", err);
        setError("Developer profile not found or private.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <Sparkles size={36} className="flame-animated" style={{ color: "var(--color-primary-500)", marginBottom: "12px" }} />
        <p style={{ color: "var(--color-text-muted)" }}>Loading developer card...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "480px" }}>
        <div className="glass-panel" style={{ padding: "40px", borderRadius: "24px" }}>
          <AlertCircle size={48} style={{ color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ fontSize: "1.4rem", color: "var(--color-text)" }}>Profile Not Found</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "8px" }}>
            The developer @{username} does not exist or has not logged any public activity yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div
        className="glass-panel"
        style={{
          padding: "36px",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                backgroundColor: "var(--color-primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              {profile.username[0].toUpperCase()}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "1.8rem", color: "var(--color-text)" }}>@{profile.username}</h1>
                <span className="badge badge-primary">Devbloom Learner</span>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                {profile.bio || "Bootcamp learner tracking daily progress & GitHub submissions"}
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderRadius: "18px",
              backgroundColor: "rgba(16,185,129,0.12)",
              border: "1px solid var(--color-primary-500)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <Flame size={32} className="flame-animated" style={{ color: "var(--color-primary-500)" }} />
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1, color: "var(--color-text)" }}>
                {profile.current_streak} Days
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase" }}>
                Current Streak
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "28px",
            paddingTop: "24px",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)" }}>LONGEST STREAK</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-text)" }}>{profile.longest_streak} Days</div>
          </div>

          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)" }}>TOTAL LOGGED DAYS</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-text)" }}>{profile.total_logged_days} Days</div>
          </div>

          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)" }}>PROJECTS SUBMITTED</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-text)" }}>{profile.total_projects} Projects</div>
          </div>
        </div>
      </div>

      <StreakHeatmap cells={heatmapCells} daysCount={180} />
    </div>
  );
};
