import React from "react";
import { Sprout, Flame, Zap, Trophy, Award, Crown, Lock, CheckCircle2 } from "lucide-react";

export interface MilestoneBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  threshold: number;
  category: string;
}

interface MilestoneBadgesProps {
  badges: MilestoneBadge[];
  currentStreak: number;
  longestStreak: number;
}

export const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({ badges, longestStreak }) => {
  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const size = 24;
    const color = unlocked ? "var(--color-primary-500)" : "var(--color-text-muted)";
    switch (iconName) {
      case "Seedling": return <Sprout size={size} style={{ color }} />;
      case "Flame": return <Flame size={size} style={{ color }} />;
      case "Zap": return <Zap size={size} style={{ color }} />;
      case "Trophy": return <Trophy size={size} style={{ color }} />;
      case "Award": return <Award size={size} style={{ color }} />;
      case "Crown": return <Crown size={size} style={{ color }} />;
      default: return <Trophy size={size} style={{ color }} />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>Milestone Achievements</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            Unlocked {badges.filter((b) => b.unlocked).length} of {badges.length} badges
          </p>
        </div>

        <div className="badge badge-outline" style={{ fontSize: "0.78rem" }}>
          Best Streak: {longestStreak} Days
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: "14px",
        }}
      >
        {badges.map((b) => {
          const progress = Math.min(100, Math.round((longestStreak / b.threshold) * 100));

          return (
            <div
              key={b.id}
              className="glass-panel"
              style={{
                padding: "16px",
                borderRadius: "16px",
                border: b.unlocked ? "1px solid var(--color-primary-500)" : "1px solid var(--color-border)",
                opacity: b.unlocked ? 1 : 0.65,
                backgroundColor: b.unlocked ? "rgba(16,185,129,0.06)" : "var(--color-card)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: b.unlocked ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getBadgeIcon(b.icon, b.unlocked)}
                </div>

                {b.unlocked ? (
                  <CheckCircle2 size={18} style={{ color: "var(--color-primary-500)" }} />
                ) : (
                  <Lock size={16} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>

              <div>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text)" }}>{b.name}</h4>
                <p style={{ fontSize: "0.76rem", color: "var(--color-text-muted)", marginTop: "2px", lineHeight: 1.3 }}>
                  {b.description}
                </p>
              </div>

              {!b.unlocked && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                    <span>Progress</span>
                    <span>{longestStreak}/{b.threshold}</span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        backgroundColor: "var(--color-primary-500)",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
