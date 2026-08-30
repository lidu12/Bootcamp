import React from "react";
import { Download, FileText, FileCode, X } from "lucide-react";

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const handleExportCSV = () => {
    const token = localStorage.getItem("devbloom_token");
    window.open(`http://localhost:8000/api/v1/export/csv?token=${token}`, "_blank");
  };

  const handleExportJSON = () => {
    const token = localStorage.getItem("devbloom_token");
    window.open(`http://localhost:8000/api/v1/export/json?token=${token}`, "_blank");
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
        style={{ width: "100%", maxWidth: "460px", padding: "28px", borderRadius: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", backgroundColor: "rgba(16,185,129,0.18)", color: "var(--color-primary-500)" }}>
              <Download size={22} />
            </div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-text)" }}>Export Learning Data</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-outline" style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "20px", lineHeight: 1.5 }}>
          Download a full archive of your bootcamp daily check-ins, GitHub project links, notes, and timestamps.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-outline"
            style={{ padding: "16px", borderRadius: "14px", justifyContent: "flex-start", gap: "14px" }}
          >
            <FileText size={22} style={{ color: "#3b82f6" }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Export as CSV Spreadsheet</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Ideal for Excel, Google Sheets & data analysis</div>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="btn btn-outline"
            style={{ padding: "16px", borderRadius: "14px", justifyContent: "flex-start", gap: "14px" }}
          >
            <FileCode size={22} style={{ color: "#10b981" }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Export as JSON Document</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Raw structured backup containing user history</div>
            </div>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </div>
      </div>
    </div>
  );
};
