import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import api from "../services/api";
import { GithubIcon } from "./GithubIcon";

interface ProjectSubmissionModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDay?: number;
}

export const ProjectSubmissionModal: React.FC<ProjectSubmissionModalProps> = ({
  onClose,
  onSuccess,
  initialDay = 1,
}) => {
  const [dayNumber, setDayNumber] = useState<number>(initialDay);
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let cleanedUrl = repoUrl.trim();
    if (!cleanedUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
      cleanedUrl = `https://${cleanedUrl}`;
    }

    if (!cleanedUrl.toLowerCase().includes("github.com")) {
      setError("URL must be a valid GitHub link (e.g. https://github.com/username/repository)");
      return;
    }

    setLoading(true);
    try {
      await api.post("/submissions/", {
        day_number: Number(dayNumber),
        repo_url: cleanedUrl,
        description: description.trim(),
      });

      // Cache locally as well
      try {
        const localSubs = JSON.parse(localStorage.getItem("devbloom_local_submissions") || "[]");
        const newSub = {
          id: Date.now(),
          user_id: 1,
          day_number: Number(dayNumber),
          repo_url: cleanedUrl,
          description: description.trim(),
          submitted_date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
        };
        localStorage.setItem("devbloom_local_submissions", JSON.stringify([newSub, ...localSubs]));
      } catch {
        // ignore
      }

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#d946ef"],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.warn("Backend submission error, saving locally:", err);
      // Fallback: save locally so user work is never lost!
      try {
        const localSubs = JSON.parse(localStorage.getItem("devbloom_local_submissions") || "[]");
        const newSub = {
          id: Date.now(),
          user_id: 1,
          day_number: Number(dayNumber),
          repo_url: cleanedUrl,
          description: description.trim(),
          submitted_date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
        };
        localStorage.setItem("devbloom_local_submissions", JSON.stringify([newSub, ...localSubs]));

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });

        onSuccess();
        onClose();
        return;
      } catch {
        // ignore
      }

      const msg = err.response?.data?.detail || "Failed to submit project. Check your GitHub link.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "540px",
          padding: "28px",
          borderRadius: "24px",
          border: "1.5px solid var(--color-border)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(var(--primary-rgb), 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary-500)",
              }}
            >
              <GithubIcon size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", color: "var(--color-text)", fontWeight: 700 }}>
                Submit Bootcamp Project
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                Link your GitHub repository to Day #{dayNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm btn-outline"
            style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group">
            <label className="form-label">Bootcamp Day Number</label>
            <input
              type="number"
              min={1}
              max={1000}
              required
              className="form-input"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Repository URL</label>
            <input
              type="text"
              required
              placeholder="https://github.com/username/project-repo"
              className="form-input"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Must be a valid GitHub URL (e.g. github.com/user/repo)
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Learnings (Optional)</label>
            <textarea
              rows={3}
              placeholder="What did you build today? Mention key challenges or achievements..."
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <GithubIcon size={16} />
              <span>{loading ? "Submitting..." : "Submit Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
