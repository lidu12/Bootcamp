import React, { useEffect, useState } from "react";
import { Map, CheckCircle2, Circle, Sparkles, Clock, Cpu, Layers, Code2, ChevronDown, ChevronUp, Calendar as CalendarIcon, ListFilter, Grid, CheckSquare, Eye, X, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import api from "../services/api";

interface DailyTaskItem {
  day: number;
  week: number;
  phase: number;
  phase_title: string;
  title: string;
  ai_eng_task: string;
  full_stack_task: string;
  dsa_task: string;
  checkpoint_step: string;
}

interface WeekItem {
  week: number;
  ai_eng: string;
  full_stack: string;
  dsa: string;
  checkpoint: string;
}

interface PhaseItem {
  phase: number;
  phase_title: string;
  weeks_range: string;
  goal: string;
  weeks: WeekItem[];
}

export const RoadmapPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "daily" | "weekly">("calendar");
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTaskItem[]>([]);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  
  const [weekProgressPercentage, setWeekProgressPercentage] = useState<number>(0);
  const [dayProgressPercentage, setDayProgressPercentage] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number>(0); // 0 = all
  const [selectedDayDetail, setSelectedDayDetail] = useState<DailyTaskItem | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [weeklyRes, dailyRes] = await Promise.all([
        api.get("/roadmap/"),
        api.get("/roadmap/days"),
      ]);

      setPhases(weeklyRes.data.phases);
      setCompletedWeeks(weeklyRes.data.completed_weeks || []);
      setWeekProgressPercentage(weeklyRes.data.progress_percentage || 0);
      setCompletedCount(weeklyRes.data.completed_count || 0);

      setDailyTasks(dailyRes.data.days || []);
      setCompletedDays(dailyRes.data.completed_days || []);
      setDayProgressPercentage(dailyRes.data.progress_percentage || 0);
      setCompletedDaysCount(dailyRes.data.completed_count || 0);
    } catch (err) {
      console.error("Failed to fetch roadmap data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDayCompletion = async (dayNum: number, currentCompleted: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = !currentCompleted;

    if (nextState) {
      setCompletedDays((prev) => [...prev, dayNum]);
      setCompletedDaysCount((prev) => prev + 1);
      setDayProgressPercentage(Math.round(((completedDaysCount + 1) / 156) * 100));

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    } else {
      setCompletedDays((prev) => prev.filter((d) => d !== dayNum));
      setCompletedDaysCount((prev) => Math.max(0, prev - 1));
      setDayProgressPercentage(Math.round(((completedDaysCount - 1) / 156) * 100));
    }

    try {
      await api.post("/roadmap/day/progress", {
        day_number: dayNum,
        is_completed: nextState,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to update day progress:", err);
    }
  };

  const toggleWeekCompletion = async (weekNum: number, currentCompleted: boolean) => {
    const nextState = !currentCompleted;

    if (nextState) {
      setCompletedWeeks((prev) => [...prev, weekNum]);
      setCompletedCount((prev) => prev + 1);
      setWeekProgressPercentage(Math.round(((completedCount + 1) / 26) * 100));

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    } else {
      setCompletedWeeks((prev) => prev.filter((w) => w !== weekNum));
      setCompletedCount((prev) => Math.max(0, prev - 1));
      setWeekProgressPercentage(Math.round(((completedCount - 1) / 26) * 100));
    }

    try {
      await api.post("/roadmap/progress", {
        week_number: weekNum,
        is_completed: nextState,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to update week progress:", err);
    }
  };

  const getLeetCodeSearchUrl = (dsaTaskStr: string) => {
    const cleanStr = dsaTaskStr.replace("LeetCode ", "").replace(/#/g, "").split("—")[0].trim();
    return `https://leetcode.com/problemset/all/?search=${encodeURIComponent(cleanStr)}`;
  };

  const filteredDailyTasks = selectedPhaseFilter === 0
    ? dailyTasks
    : dailyTasks.filter((d) => d.phase === selectedPhaseFilter);

  if (loading && dailyTasks.length === 0) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <Sparkles size={36} className="flame-animated" style={{ color: "var(--color-primary-500)", marginBottom: "12px" }} />
        <p style={{ color: "var(--color-text-muted)" }}>Loading 180-day calendar & curriculum...</p>
      </div>
    );
  }

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
          gap: "20px",
          background: "linear-gradient(135deg, var(--color-glass-bg) 0%, rgba(16,185,129,0.1) 100%)",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "8px", borderRadius: "12px", backgroundColor: "var(--color-primary-500)", color: "#fff" }}>
              <Map size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)" }}>180-Day Interactive Calendar & Curriculum</h1>
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                Tick off daily topics, video tutorials, and LeetCode problems as you finish!
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setViewMode("calendar")}
            className={`btn btn-sm ${viewMode === "calendar" ? "btn-primary" : "btn-outline"}`}
          >
            <Grid size={16} /> 180-Day Calendar Grid
          </button>

          <button
            onClick={() => setViewMode("daily")}
            className={`btn btn-sm ${viewMode === "daily" ? "btn-primary" : "btn-outline"}`}
          >
            <CalendarIcon size={16} /> Daily Tasks List
          </button>

          <button
            onClick={() => setViewMode("weekly")}
            className={`btn btn-sm ${viewMode === "weekly" ? "btn-primary" : "btn-outline"}`}
          >
            <ListFilter size={16} /> Weekly Summary
          </button>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)" }}>
            {viewMode === "calendar" ? "180-Day Calendar Completion" : viewMode === "daily" ? "Daily Tasks Progress" : "Weekly Milestones Progress"}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
            {completedDaysCount} of 156 Study Days Ticked Off ({dayProgressPercentage}%) • {completedCount} of 26 Weeks Done ({weekProgressPercentage}%)
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: "320px", width: "100%" }}>
          <div style={{ height: "10px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${viewMode === "weekly" ? weekProgressPercentage : dayProgressPercentage}%`,
                backgroundColor: "var(--color-primary-500)",
                borderRadius: "9999px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Daily Structure Box */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)" }}>
          <Clock size={18} style={{ color: "var(--color-primary-500)" }} />
          Daily Schedule Breakdown (Mon–Sat; Sunday = Review & Integration)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, color: "#3b82f6" }}>
              <Cpu size={16} /> ~90 min — AI Engineering
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Watch assigned video tutorial & build AI/LLM code
            </div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, color: "#10b981" }}>
              <Layers size={16} /> ~60–75 min — Full Stack
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Watch assigned Web tutorial & build React/FastAPI features
            </div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b" }}>
              <Code2 size={16} /> ~30–45 min — DSA LeetCode
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              1 problem, timed (25–30 min), focusing on target pattern
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Render */}
      {viewMode === "calendar" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            <button
              onClick={() => setSelectedPhaseFilter(0)}
              className={`btn btn-sm ${selectedPhaseFilter === 0 ? "btn-primary" : "btn-outline"}`}
              style={{ borderRadius: "9999px", padding: "4px 14px" }}
            >
              All 180 Days
            </button>
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPhaseFilter(p)}
                className={`btn btn-sm ${selectedPhaseFilter === p ? "btn-primary" : "btn-outline"}`}
                style={{ borderRadius: "9999px", padding: "4px 14px", whiteSpace: "nowrap" }}
              >
                Phase {p}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredDailyTasks.map((d) => {
              const isDone = completedDays.includes(d.day);

              return (
                <div
                  key={d.day}
                  className="glass-panel glass-panel-hover"
                  onClick={() => setSelectedDayDetail(d)}
                  style={{
                    padding: "16px",
                    borderRadius: "18px",
                    cursor: "pointer",
                    border: isDone ? "2px solid var(--color-primary-500)" : "1px solid var(--color-border)",
                    backgroundColor: isDone ? "rgba(16,185,129,0.08)" : "var(--color-card)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "14px",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        className={`badge ${isDone ? "badge-primary" : "badge-outline"}`}
                        style={{ fontSize: "0.82rem", padding: "4px 10px" }}
                      >
                        Day {d.day}
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                        W{d.week} • P{d.phase}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleDayCompletion(d.day, isDone, e)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: isDone ? "var(--color-primary-500)" : "var(--color-text-muted)",
                      }}
                      title={isDone ? "Mark day incomplete" : "Tick off as completed"}
                    >
                      {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.3, marginBottom: "8px" }}>
                      {d.title}
                    </h4>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.78rem" }}>
                      <div style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Cpu size={14} /> <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{d.ai_eng_task}</span>
                      </div>
                      <div style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Layers size={14} /> <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{d.full_stack_task}</span>
                      </div>
                      <div style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Code2 size={14} /> <span style={{ fontWeight: 700 }}>{d.dsa_task}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--color-border)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary-500)", fontWeight: 600 }}>
                      <Eye size={14} /> View Details & Code Task
                    </span>
                    <span>{isDone ? "✓ Completed" : "Click to view"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === "daily" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            <button onClick={() => setSelectedPhaseFilter(0)} className={`btn btn-sm ${selectedPhaseFilter === 0 ? "btn-primary" : "btn-outline"}`} style={{ borderRadius: "9999px", padding: "4px 14px" }}>
              All Phases
            </button>
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <button key={p} onClick={() => setSelectedPhaseFilter(p)} className={`btn btn-sm ${selectedPhaseFilter === p ? "btn-primary" : "btn-outline"}`} style={{ borderRadius: "9999px", padding: "4px 14px", whiteSpace: "nowrap" }}>
                Phase {p}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredDailyTasks.map((d) => {
              const isDone = completedDays.includes(d.day);

              return (
                <div
                  key={d.day}
                  className="glass-panel"
                  style={{
                    padding: "20px 24px",
                    borderRadius: "18px",
                    border: isDone ? "1px solid var(--color-primary-500)" : "1px solid var(--color-border)",
                    backgroundColor: isDone ? "rgba(16,185,129,0.06)" : "var(--color-card)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "18px",
                  }}
                >
                  <button
                    onClick={(e) => toggleDayCompletion(d.day, isDone, e)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: isDone ? "var(--color-primary-500)" : "var(--color-text-muted)",
                      marginTop: "4px",
                    }}
                    title={isDone ? "Mark day incomplete" : "Tick off day as complete"}
                  >
                    {isDone ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                  </button>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="badge badge-primary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>
                          Day {d.day} (Week {d.week})
                        </span>
                        <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>{d.title}</h3>
                      </div>
                      <span className="badge badge-outline" style={{ fontSize: "0.72rem" }}>
                        {d.phase_title}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
                      <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(59,130,246,0.1)", borderLeft: "3px solid #3b82f6" }}>
                        <strong style={{ color: "#3b82f6", display: "block", marginBottom: "2px" }}>
                          🎥 ~90 min AI Engineering Action:
                        </strong>
                        <span style={{ color: "var(--color-text)", lineHeight: 1.4 }}>{d.ai_eng_task}</span>
                      </div>

                      <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(16,185,129,0.1)", borderLeft: "3px solid #10b981" }}>
                        <strong style={{ color: "#10b981", display: "block", marginBottom: "2px" }}>
                          💻 ~60 min Full Stack Web Action:
                        </strong>
                        <span style={{ color: "var(--color-text)", lineHeight: 1.4 }}>{d.full_stack_task}</span>
                      </div>

                      <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(245,158,11,0.1)", borderLeft: "3px solid #f59e0b" }}>
                        <strong style={{ color: "#f59e0b", display: "block", marginBottom: "2px" }}>
                          🧩 ~30 min Timed DSA Problem:
                        </strong>
                        <a
                          href={getLeetCodeSearchUrl(d.dsa_task)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#f59e0b", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px", marginLeft: "4px" }}
                        >
                          {d.dsa_task} <ExternalLink size={14} />
                        </a>
                      </div>

                      <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.15)", border: "1px solid var(--color-border)" }}>
                        <strong style={{ color: "var(--color-primary-500)" }}>🎯 Project Deliverable Step:</strong>{" "}
                        <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{d.checkpoint_step}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {phases.map((p) => {
            const isExpanded = expandedPhases[p.phase] ?? true;
            const completedInPhase = p.weeks.filter((w) => completedWeeks.includes(w.week)).length;

            return (
              <div
                key={p.phase}
                className="glass-panel"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  onClick={() => setExpandedPhases((prev) => ({ ...prev, [p.phase]: !prev[p.phase] }))}
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    userSelect: "none",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--color-text)" }}>{p.phase_title}</h3>
                      <span className="badge badge-outline" style={{ fontSize: "0.75rem" }}>
                        {p.weeks_range}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                      Goal: {p.goal}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary-500)" }}>
                      {completedInPhase} / {p.weeks.length} Done
                    </span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {p.weeks.map((w) => {
                      const isDone = completedWeeks.includes(w.week);

                      return (
                        <div
                          key={w.week}
                          style={{
                            padding: "18px 20px",
                            borderRadius: "16px",
                            backgroundColor: isDone ? "rgba(16,185,129,0.06)" : "var(--color-card)",
                            border: isDone ? "1px solid var(--color-primary-500)" : "1px solid var(--color-border)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "16px",
                          }}
                        >
                          <button
                            onClick={() => toggleWeekCompletion(w.week, isDone)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              color: isDone ? "var(--color-primary-500)" : "var(--color-text-muted)",
                              marginTop: "2px",
                            }}
                          >
                            {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>

                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                              <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-text)" }}>
                                Week {w.week}
                              </span>
                              <span className={`badge ${isDone ? "badge-primary" : "badge-outline"}`} style={{ fontSize: "0.72rem" }}>
                                {isDone ? "Completed" : "In Progress"}
                              </span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", fontSize: "0.85rem" }}>
                              <div>
                                <strong style={{ color: "#3b82f6" }}>🤖 AI Engineering:</strong>
                                <p style={{ color: "var(--color-text)", marginTop: "2px", lineHeight: 1.4 }}>{w.ai_eng}</p>
                              </div>
                              <div>
                                <strong style={{ color: "#10b981" }}>⚡ Full Stack:</strong>
                                <p style={{ color: "var(--color-text)", marginTop: "2px", lineHeight: 1.4 }}>{w.full_stack}</p>
                              </div>
                              <div>
                                <strong style={{ color: "#f59e0b" }}>🧩 DSA Pattern:</strong>
                                <p style={{ color: "var(--color-text)", marginTop: "2px", lineHeight: 1.4 }}>{w.dsa}</p>
                              </div>
                            </div>

                            <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.15)", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                              <strong style={{ color: "var(--color-primary-500)" }}>🎯 Weekly Checkpoint:</strong>{" "}
                              <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{w.checkpoint}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Day Detail Modal */}
      {selectedDayDetail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() => setSelectedDayDetail(null)}
        >
          <div
            className="glass-panel animate-fade-in"
            style={{ width: "100%", maxWidth: "600px", padding: "28px", borderRadius: "24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="badge badge-primary" style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
                  Day {selectedDayDetail.day}
                </span>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-text)" }}>{selectedDayDetail.title}</h3>
              </div>

              <button onClick={() => setSelectedDayDetail(null)} className="btn btn-sm btn-outline" style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
              <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(59,130,246,0.12)", borderLeft: "4px solid #3b82f6" }}>
                <strong style={{ color: "#3b82f6", display: "block", marginBottom: "4px" }}>
                  🎥 ~90 min AI Engineering Action Plan:
                </strong>
                <p style={{ color: "var(--color-text)", lineHeight: 1.5 }}>{selectedDayDetail.ai_eng_task}</p>
              </div>

              <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(16,185,129,0.12)", borderLeft: "4px solid #10b981" }}>
                <strong style={{ color: "#10b981", display: "block", marginBottom: "4px" }}>
                  💻 ~60 min Full Stack Web Action Plan:
                </strong>
                <p style={{ color: "var(--color-text)", lineHeight: 1.5 }}>{selectedDayDetail.full_stack_task}</p>
              </div>

              <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(245,158,11,0.12)", borderLeft: "4px solid #f59e0b" }}>
                <strong style={{ color: "#f59e0b", display: "block", marginBottom: "4px" }}>
                  🧩 ~30 min Timed DSA LeetCode Target:
                </strong>
                <a
                  href={getLeetCodeSearchUrl(selectedDayDetail.dsa_task)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#f59e0b", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "2px" }}
                >
                  {selectedDayDetail.dsa_task} <ExternalLink size={16} />
                </a>
              </div>

              <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--color-border)" }}>
                <strong style={{ color: "var(--color-primary-500)", display: "block", marginBottom: "2px" }}>
                  🎯 Project Deliverable Checkpoint Step:
                </strong>
                <p style={{ color: "var(--color-text)", fontWeight: 600 }}>{selectedDayDetail.checkpoint_step}</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <button
                onClick={(e) => {
                  const isDone = completedDays.includes(selectedDayDetail.day);
                  toggleDayCompletion(selectedDayDetail.day, isDone, e);
                }}
                className={`btn ${completedDays.includes(selectedDayDetail.day) ? "btn-secondary" : "btn-primary"}`}
              >
                <CheckSquare size={18} />
                {completedDays.includes(selectedDayDetail.day) ? "Mark Incomplete" : "Tick Off as Completed"}
              </button>

              <button onClick={() => setSelectedDayDetail(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
