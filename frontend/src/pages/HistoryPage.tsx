import React, { useEffect, useState } from "react";
import { PlusCircle, Sparkles } from "lucide-react";
import api from "../services/api";
import { SubmissionHistory, type SubmissionItem } from "../components/SubmissionHistory";
import { ProjectSubmissionModal } from "../components/ProjectSubmissionModal";

export const HistoryPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/submissions/");
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submission history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="container" style={{ padding: "32px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)" }}>Bootcamp Project Submissions</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Filter, search, and view all your submitted GitHub repositories
          </p>
        </div>

        <button onClick={() => setIsSubmissionModalOpen(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Submit New Project
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--color-text-muted)" }}>
          <Sparkles size={32} className="flame-animated" style={{ color: "var(--color-primary-500)", marginBottom: "12px" }} />
          <p>Loading submission history...</p>
        </div>
      ) : (
        <SubmissionHistory submissions={submissions} onRefresh={fetchSubmissions} />
      )}

      {isSubmissionModalOpen && (
        <ProjectSubmissionModal
          onClose={() => setIsSubmissionModalOpen(false)}
          onSuccess={fetchSubmissions}
          initialDay={submissions.length + 1}
        />
      )}
    </div>
  );
};
