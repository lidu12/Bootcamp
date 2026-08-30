import React, { useEffect, useState } from "react";
import { Download, Calendar, Sparkles, ExternalLink, Code, Flame, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { StreakCounterCard } from "../components/StreakCounterCard";
import { StreakHeatmap, type HeatmapCell } from "../components/StreakHeatmap";
import { MilestoneBadges } from "../components/MilestoneBadges";
import { ProjectSubmissionModal } from "../components/ProjectSubmissionModal";
import { ExportModal } from "../components/ExportModal";
import type { SubmissionItem } from "../components/SubmissionHistory";
import { GithubIcon } from "../components/GithubIcon";

const FALLBACK_STREAK_SUMMARY = {
  current_streak: 0,
  longest_streak: 0,
  total_logged_days: 0,
  has_checked_in_today: false,
  last_checkin_date: null,
  today_date: new Date().toISOString().split("T")[0],
  streak_freezes_available: 1,
  streak_freezes_used: 0,
  freeze_applied_today: false,
  milestone_badges: [
    { id: "badge-1", name: "First Step", description: "Logged your first day of learning", icon: "Seedling", unlocked: false, threshold: 1, category: "checkin" },
    { id: "badge-7", name: "Week Warrior", description: "Achieved a continuous 7-day streak", icon: "Flame", unlocked: false, threshold: 7, category: "streak" },
    { id: "badge-14", name: "Fortnight Focus", description: "Maintained focus for 14 continuous days", icon: "Zap", unlocked: false, threshold: 14, category: "streak" },
    { id: "badge-30", name: "Monthly Master", description: "Achieved a full 30-day streak milestone", icon: "Trophy", unlocked: false, threshold: 30, category: "streak" },
    { id: "badge-50", name: "Half Century", description: "50 consecutive days of non-stop learning", icon: "Award", unlocked: false, threshold: 50, category: "streak" },
    { id: "badge-100", name: "Bootcamp Legend", description: "Hit the elite 100-day streak mark!", icon: "Crown", unlocked: false, threshold: 100, category: "streak" },
  ]
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [streakSummary, setStreakSummary] = useState<any>(FALLBACK_STREAK_SUMMARY);
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [heatmapDays, setHeatmapDays] = useState(180);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, heatRes, subRes] = await Promise.all([
        api.get("/streaks/summary").catch(() => ({ data: FALLBACK_STREAK_SUMMARY })),
        api.get(`/streaks/heatmap?days=${heatmapDays}`).catch(() => ({ data: [] })),
        api.get("/submissions/").catch(() => ({ data: [] })),
      ]);

      setStreakSummary(sumRes.data || FALLBACK_STREAK_SUMMARY);
      setHeatmapCells(heatRes.data || []);
      setRecentSubmissions((subRes.data || []).slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setStreakSummary(FALLBACK_STREAK_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [heatmapDays]);

  if (loading && !streakSummary) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <Sparkles size={36} className="flame-animated" style={{ color: "var(--color-primary-500)", marginBottom: "12px" }} />
        <p style={{ color: "var(--color-text-muted)" }}>Loading your bootcamp dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 20px", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Daily Reminder Banner (Shows if not checked in today) */}
      {streakSummary && !streakSummary.has_checked_in_today && (
        <div
          className="animate-fade-in"
          style={{
            padding: "16px 24px",
            borderRadius: "14px",
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Flame size={26} className="flame-animated" style={{ color: "#f97316" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--color-text)" }}>
                Keep your {streakSummary.current_streak}-day streak alive!
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                You haven't logged today's progress yet. Log your daily work before midnight to maintain momentum.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById("log-today-btn");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn btn-sm"
            style={{ backgroundColor: "#f97316", color: "#ffffff", borderRadius: "8px", padding: "8px 18px", fontWeight: 600 }}
          >
            <PlusCircle size={16} /> Log Today's Work
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)" }}>
            Welcome back, <span style={{ color: "var(--color-primary-500)" }}>@{user?.username || "developer"}</span>! 👋
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Timezone: <strong style={{ color: "var(--color-text)" }}>{user?.timezone || "UTC"}</strong> • Stay consistent & hit your next streak milestone.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => setIsSubmissionModalOpen(true)} className="btn btn-primary">
            <GithubIcon size={18} /> Submit Project
          </button>
          <button onClick={() => setIsExportModalOpen(true)} className="btn btn-outline">
            <Download size={18} /> Export History
          </button>
        </div>
      </div>

      {/* Streak Counter Card */}
      {streakSummary && (
        <div id="log-today-btn">
          <StreakCounterCard
            currentStreak={streakSummary.current_streak}
            longestStreak={streakSummary.longest_streak}
            totalLoggedDays={streakSummary.total_logged_days}
            hasCheckedInToday={streakSummary.has_checked_in_today}
            streakFreezesAvailable={streakSummary.streak_freezes_available}
            onCheckinSuccess={fetchDashboardData}
          />
        </div>
      )}

      {/* Calendar Heatmap */}
      <StreakHeatmap
        cells={heatmapCells}
        daysCount={heatmapDays}
        onRangeChange={(d) => setHeatmapDays(d)}
      />

      {/* Milestone Badges */}
      {streakSummary && (
        <MilestoneBadges
          badges={streakSummary.milestone_badges}
          currentStreak={streakSummary.current_streak}
          longestStreak={streakSummary.longest_streak}
        />
      )}

      {/* Recent Submissions */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Code size={20} style={{ color: "var(--color-primary-500)" }} />
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>Recent Project Submissions</h3>
          </div>
          <button onClick={() => setIsSubmissionModalOpen(true)} className="btn btn-sm btn-outline">
            + New Project
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            No project submissions logged yet. Click "Submit Project" above to submit your first GitHub repo!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span className="badge badge-primary" style={{ padding: "4px 10px" }}>
                    Day {sub.day_number}
                  </span>
                  <div>
                    <a
                      href={sub.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <GithubIcon size={16} />
                      {sub.repo_url.replace("https://github.com/", "").replace("http://github.com/", "")}
                      <ExternalLink size={14} style={{ color: "var(--color-primary-500)" }} />
                    </a>
                    {sub.description && (
                      <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        {sub.description}
                      </p>
                    )}
                  </div>
                </div>

                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} /> {sub.submitted_date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSubmissionModalOpen && (
        <ProjectSubmissionModal
          onClose={() => setIsSubmissionModalOpen(false)}
          onSuccess={fetchDashboardData}
          initialDay={(streakSummary?.total_logged_days || 0) + 1}
        />
      )}

      {isExportModalOpen && <ExportModal onClose={() => setIsExportModalOpen(false)} />}
    </div>
  );
};
