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

    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!repoUrl.toLowerCase().includes("github.com/")) {
      setError("URL must be a valid GitHub link (e.g. https://github.com/username/repository)");
      return;
    }

    setLoading(true);
    try {
      await api.post("/submissions/", {
        day_number: Number(dayNumber),
        repo_url: repoUrl.trim(),
        description: description.trim(),
      });

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#d946ef"],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Submission failed:", err);
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
          border: "1px solid var(--color-border)",
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
                backgroundColor: "var(--color-primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <GithubIcon size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", color: "var(--color-text)" }}>Submit GitHub Project</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                Link your repository to your bootcamp task
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bootcamp Day / Task #</label>
            <input
              type="number"
              min="1"
              max="1000"
              className="form-input"
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Repository Link</label>
            <div style={{ position: "relative" }}>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                required
                style={{ paddingLeft: "40px" }}
              />
              <GithubIcon
                size={18}
                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Description (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="What tech stack did you use? What features did you implement?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
