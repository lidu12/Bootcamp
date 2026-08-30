import React, { useState } from "react";
import { ExternalLink, Search, ArrowUpDown, Calendar, Code, Trash2, Eye } from "lucide-react";
import api from "../services/api";
import { GithubIcon } from "./GithubIcon";

export interface SubmissionItem {
  id: number;
  user_id: number;
  day_number: number;
  repo_url: string;
  description: string;
  submitted_date: string;
  created_at: string;
}

interface SubmissionHistoryProps {
  submissions: SubmissionItem[];
  onRefresh: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submissions, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<SubmissionItem | null>(null);

  const uniqueDays = Array.from(new Set(submissions.map((s) => s.day_number))).sort((a, b) => a - b);

  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesSearch =
        sub.repo_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDay = selectedDay === "all" || sub.day_number === Number(selectedDay);
      return matchesSearch && matchesDay;
    })
    .sort((a, b) => {
      if (sortAsc) {
        return a.day_number - b.day_number;
      }
      return b.day_number - a.day_number;
    });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await api.delete(`/submissions/${id}`).catch(() => null);
      try {
        const local: SubmissionItem[] = JSON.parse(localStorage.getItem("devbloom_local_submissions") || "[]");
        const updated = local.filter((s) => s.id !== id);
        localStorage.setItem("devbloom_local_submissions", JSON.stringify(updated));
      } catch {
        // ignore
      }
      onRefresh();
    } catch (err) {
      console.error("Delete submission failed:", err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-text)" }}>Project Submission History</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Total {submissions.length} project{submissions.length === 1 ? "" : "s"} submitted
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "200px" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "34px", padding: "6px 12px 6px 34px", fontSize: "0.85rem" }}
            />
            <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
          </div>

          <select
            className="form-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={{ padding: "6px 12px", fontSize: "0.85rem", width: "auto" }}
          >
            <option value="all">All Days</option>
            {uniqueDays.map((d) => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>

          <button
            onClick={() => setSortAsc((prev) => !prev)}
            className="btn btn-sm btn-outline"
            title="Toggle sort order"
          >
            <ArrowUpDown size={16} /> {sortAsc ? "Oldest First" : "Newest First"}
          </button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
          <Code size={36} style={{ opacity: 0.5, marginBottom: "8px" }} />
          <p style={{ fontSize: "0.95rem" }}>No project submissions found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "240px" }}>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--color-primary-500)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>Day {sub.day_number}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <a
                    href={sub.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 700,
                      fontSize: "0.98rem",
                      color: "var(--color-text)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <GithubIcon size={16} />
                    {sub.repo_url.replace("https://github.com/", "").replace("http://github.com/", "")}
                    <ExternalLink size={14} style={{ color: "var(--color-primary-500)" }} />
                  </a>

                  {sub.description && (
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                      {sub.description}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} /> {sub.submitted_date}
                </span>

                <button
                  onClick={() => setDetailModalItem(sub)}
                  className="btn btn-sm btn-outline"
                  title="View details"
                >
                  <Eye size={15} /> Details
                </button>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="btn btn-sm btn-outline"
                  style={{ color: "#ef4444" }}
                  title="Delete submission"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailModalItem && (
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
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="glass-panel animate-fade-in"
            style={{ width: "100%", maxWidth: "560px", padding: "28px", borderRadius: "24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="badge badge-primary" style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
                  Day {detailModalItem.day_number}
                </span>
                <h3 style={{ fontSize: "1.2rem", color: "var(--color-text)" }}>Submission Details</h3>
              </div>
              <button onClick={() => setDetailModalItem(null)} className="btn btn-sm btn-outline" style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}>
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>GitHub Repository Link</label>
                <a
                  href={detailModalItem.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: "break-all", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}
                >
                  <GithubIcon size={18} /> {detailModalItem.repo_url} <ExternalLink size={16} />
                </a>
              </div>

              <div>
                <label className="form-label" style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>Description</label>
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", marginTop: "4px", whiteSpace: "pre-wrap", fontSize: "0.92rem" }}>
                  {detailModalItem.description || "No description provided."}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>Submitted On</label>
                <div style={{ fontSize: "0.92rem", color: "var(--color-text)", fontWeight: 600, marginTop: "2px" }}>
                  {detailModalItem.submitted_date}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <button onClick={() => setDetailModalItem(null)} className="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
