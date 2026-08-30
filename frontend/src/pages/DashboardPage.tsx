import React, { useEffect, useState } from "react";
import { Download, ExternalLink, Code, Flame, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { StreakCounterCard } from "../components/StreakCounterCard";
import { StreakHeatmap, type HeatmapCell } from "../components/StreakHeatmap";
import { MilestoneBadges } from "../components/MilestoneBadges";
import { ProjectSubmissionModal } from "../components/ProjectSubmissionModal";
import { ExportModal } from "../components/ExportModal";
import type { SubmissionItem } from "../components/SubmissionHistory";
import { GithubIcon } from "../components/GithubIcon";
import { calculateStreakStats, generateLocalHeatmap, type StreakData } from "../utils/streakUtils";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const [streakSummary, setStreakSummary] = useState<StreakData>(() => {
    try {
      const savedDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");
      return calculateStreakStats(savedDates);
    } catch {
      return calculateStreakStats([]);
    }
  });

  const [heatmapDays, setHeatmapDays] = useState(180);
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>(() => {
    try {
      const savedDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");
      return generateLocalHeatmap(savedDates, 180);
    } catch {
      return generateLocalHeatmap([], 180);
    }
  });

  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("devbloom_local_submissions") || "[]").slice(0, 5);
    } catch {
      return [];
    }
  });

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, heatRes, subRes] = await Promise.all([
        api.get("/streaks/summary").catch(() => null),
        api.get(`/streaks/heatmap?days=${heatmapDays}`).catch(() => null),
        api.get("/submissions/").catch(() => null),
      ]);

      // Read local dates to merge
      const localDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");

      if (sumRes?.data) {
        // If server responded, check if today or dates were recorded
        const allDates = Array.from(new Set([...localDates, ...(sumRes.data.last_checkin_date ? [sumRes.data.last_checkin_date] : [])]));
        const mergedStats = calculateStreakStats(allDates);
        setStreakSummary(mergedStats);
        localStorage.setItem("devbloom_checkin_dates", JSON.stringify(allDates));
      } else {
        const localStats = calculateStreakStats(localDates);
        setStreakSummary(localStats);
      }

      if (heatRes?.data && Array.isArray(heatRes.data) && heatRes.data.length > 0) {
        setHeatmapCells(heatRes.data);
      } else {
        const freshDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");
        setHeatmapCells(generateLocalHeatmap(freshDates, heatmapDays));
      }

      if (subRes?.data && Array.isArray(subRes.data)) {
        const localSubs: SubmissionItem[] = JSON.parse(localStorage.getItem("devbloom_local_submissions") || "[]");
        const existingIds = new Set(subRes.data.map((s: SubmissionItem) => s.id));
        const extraLocal = localSubs.filter((l) => !existingIds.has(l.id));
        const merged = [...subRes.data, ...extraLocal];
        setRecentSubmissions(merged.slice(0, 5));
        localStorage.setItem("devbloom_local_submissions", JSON.stringify(merged));
      }
    } catch (err) {
      console.warn("Using offline dashboard data:", err);
      const localDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");
      setStreakSummary(calculateStreakStats(localDates));
      setHeatmapCells(generateLocalHeatmap(localDates, heatmapDays));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [heatmapDays]);

  const handleCheckinSuccess = () => {
    const localDates: string[] = JSON.parse(localStorage.getItem("devbloom_checkin_dates") || "[]");
    const updatedStats = calculateStreakStats(localDates);
    setStreakSummary(updatedStats);
    setHeatmapCells(generateLocalHeatmap(localDates, heatmapDays));
    fetchDashboardData();
  };

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
            border: "1.5px solid rgba(249, 115, 22, 0.3)",
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
                You haven't logged today's coding session yet. Click "Log Today's Work" below to keep your streak burning!
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCheckinSuccess()}
            className="btn btn-sm btn-primary"
          >
            Log Now
          </button>
        </div>
      )}

      {/* Hero Welcome & Quick Stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--color-text)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Welcome back, <span style={{ color: "var(--color-primary-500)" }}>{user?.username || "Developer"}</span>! 👋
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Here is your bootcamp learning streak and project submission activity.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setIsExportModalOpen(true)} className="btn btn-outline">
            <Download size={16} /> Export Data
          </button>
          <button onClick={() => setIsSubmissionModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={18} /> Submit Project
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Streak Counter Card */}
        <StreakCounterCard
          currentStreak={streakSummary.current_streak}
          longestStreak={streakSummary.longest_streak}
          totalLoggedDays={streakSummary.total_logged_days}
          hasCheckedInToday={streakSummary.has_checked_in_today}
          streakFreezesAvailable={streakSummary.streak_freezes_available}
          onCheckinSuccess={handleCheckinSuccess}
        />

        {/* Milestone Badges Overview Card */}
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}>
          <MilestoneBadges
            badges={streakSummary.milestone_badges}
            currentStreak={streakSummary.current_streak}
            longestStreak={streakSummary.longest_streak}
          />
        </div>
      </div>

      {/* Calendar Heatmap Section */}
      <StreakHeatmap
        cells={heatmapCells}
        daysCount={heatmapDays}
        onRangeChange={(d) => setHeatmapDays(d)}
      />

      {/* Recent Submissions Section */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Code size={20} style={{ color: "var(--color-primary-500)" }} />
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>Recent Project Submissions</h3>
          </div>

          <button onClick={() => setIsSubmissionModalOpen(true)} className="btn btn-sm btn-outline">
            <PlusCircle size={16} /> Add Submission
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", border: "1.5px dashed var(--color-border)", borderRadius: "14px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            No projects submitted yet. Click "Submit Project" to link your first GitHub repo!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  backgroundColor: "var(--color-card)",
                  border: "1.5px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="badge badge-primary">Day {sub.day_number}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)" }}>
                      {sub.description || "Bootcamp Project Deliverable"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                      Submitted on {sub.submitted_date}
                    </div>
                  </div>
                </div>

                <a
                  href={sub.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <GithubIcon size={14} />
                  <span>View Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isSubmissionModalOpen && (
        <ProjectSubmissionModal
          onClose={() => setIsSubmissionModalOpen(false)}
          onSuccess={() => {
            handleCheckinSuccess();
          }}
          initialDay={recentSubmissions.length + 1}
        />
      )}

      {isExportModalOpen && <ExportModal onClose={() => setIsExportModalOpen(false)} />}
    </div>
  );
};
