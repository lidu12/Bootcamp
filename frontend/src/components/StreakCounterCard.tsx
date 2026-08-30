import React, { useState } from "react";
import { Flame, CheckCircle, Trophy, Calendar, PlusCircle, Sparkles, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import api from "../services/api";

interface StreakCounterCardProps {
  currentStreak: number;
  longestStreak: number;
  totalLoggedDays: number;
  hasCheckedInToday: boolean;
  streakFreezesAvailable?: number;
  onCheckinSuccess: () => void;
}

export const StreakCounterCard: React.FC<StreakCounterCardProps> = ({
  currentStreak,
  longestStreak,
  totalLoggedDays,
  hasCheckedInToday,
  streakFreezesAvailable = 1,
  onCheckinSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleCheckin = async () => {
    setLoading(true);
    try {
      await api.post("/streaks/checkin", { note });
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#6ee7b7", "#06b6d4", "#f97316", "#a855f7"],
      });

      setShowNoteInput(false);
      setNote("");
      onCheckinSuccess();
    } catch (err) {
      console.error("Checkin failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: "28px",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            className={currentStreak > 0 ? "flame-animated" : ""}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              backgroundColor: currentStreak > 0 ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${currentStreak > 0 ? "var(--color-primary-500)" : "var(--color-border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStreak > 0 ? "var(--color-primary-500)" : "var(--color-text-muted)",
            }}
          >
            <Flame size={40} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1, color: "var(--color-text)", letterSpacing: "-0.04em" }}>
                {currentStreak}
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary-500)" }}>
                Day{currentStreak === 1 ? "" : "s"} Streak
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {hasCheckedInToday
                ? "🎉 You logged today's progress! Keep the flame burning."
                : currentStreak > 0
                ? "⚡ Log today's work to keep your streak going!"
                : "🌱 Start your streak today by logging your first entry!"}
            </p>
          </div>
        </div>

        <div>
          {hasCheckedInToday ? (
            <div
              className="badge badge-primary"
              style={{
                padding: "10px 20px",
                fontSize: "0.9rem",
                borderRadius: "9999px",
              }}
            >
              <CheckCircle size={18} /> Checked In Today
            </div>
          ) : (
            <button
              onClick={() => setShowNoteInput((prev) => !prev)}
              className="btn btn-lg btn-primary"
              style={{ borderRadius: "9999px" }}
            >
              <PlusCircle size={20} /> Log Today's Work
            </button>
          )}
        </div>
      </div>

      {showNoteInput && !hasCheckedInToday && (
        <div className="animate-fade-in" style={{ backgroundColor: "rgba(0,0,0,0.15)", padding: "16px", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
          <div className="form-group" style={{ marginBottom: "12px" }}>
            <label className="form-label">Optional Note / What did you learn today?</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Practiced React Hooks and FastAPI JWT Auth..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheckin()}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setShowNoteInput(false)} className="btn btn-sm btn-outline">Cancel</button>
            <button onClick={handleCheckin} disabled={loading} className="btn btn-sm btn-primary">
              {loading ? "Logging..." : "Confirm Daily Check-in"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          paddingTop: "20px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(250,204,21,0.15)", color: "#f59e0b" }}>
            <Trophy size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Longest Streak</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)" }}>{longestStreak} Days</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Total Days Logged</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)" }}>{totalLoggedDays} Days</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(16,185,129,0.15)", color: "var(--color-primary-500)" }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Streak Freeze</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)" }}>{streakFreezesAvailable} Ready</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Consistency</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)" }}>
              {totalLoggedDays > 0 ? `${Math.round((currentStreak / totalLoggedDays) * 100)}%` : "0%"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
