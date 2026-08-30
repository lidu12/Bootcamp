import React, { useState } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";

export interface HeatmapCell {
  date: string;
  status: "completed" | "missed" | "today_pending" | "future";
  level: number;
  is_today: boolean;
  day_of_week: string;
  month: string;
}

interface StreakHeatmapProps {
  cells: HeatmapCell[];
  daysCount?: number;
  onRangeChange?: (days: number) => void;
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ cells, daysCount = 180, onRangeChange }) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const getCellColor = (cell: HeatmapCell) => {
    switch (cell.status) {
      case "completed":
        return "var(--color-primary-500)";
      case "today_pending":
        return "rgba(255,255,255,0.08)";
      case "missed":
        return "rgba(255,255,255,0.04)";
      default:
        return "transparent";
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CalendarIcon size={20} style={{ color: "var(--color-primary-500)" }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-text)" }}>Contribution Activity Heatmap</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              Daily check-ins & project submissions over time
            </p>
          </div>
        </div>

        {onRangeChange && (
          <div style={{ display: "flex", gap: "6px" }}>
            {[90, 180, 365].map((d) => (
              <button
                key={d}
                onClick={() => onRangeChange(d)}
                className={`btn btn-sm ${daysCount === d ? "btn-primary" : "btn-outline"}`}
                style={{ borderRadius: "8px", padding: "4px 10px", fontSize: "0.78rem" }}
              >
                {d} Days
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", paddingBottom: "8px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px", fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
          {cells.map((cell, i) => {
            const isMonthStart = i === 0 || cell.month !== cells[i - 1].month;
            return (
              <div key={i} style={{ width: "14px", textAlign: "left" }}>
                {isMonthStart ? cell.month : ""}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {cells.map((cell, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCell(cell)}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                backgroundColor: getCellColor(cell),
                border: cell.is_today
                  ? "2px solid var(--color-primary-500)"
                  : cell.status === "completed"
                  ? "1px solid var(--color-primary-700)"
                  : "1px solid var(--color-border)",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.15s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--color-text-muted)", paddingTop: "8px", borderTop: "1px solid var(--color-border)" }}>
        <div>
          {hoveredCell ? (
            <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
              📅 {hoveredCell.date} ({hoveredCell.day_of_week}):{" "}
              {hoveredCell.status === "completed"
                ? "✅ Completed"
                : hoveredCell.is_today
                ? "⚡ Pending Log Today"
                : "❌ Missed Day"}
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Info size={14} /> Hover over any square to view date status
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Less</span>
          <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)" }} title="Missed" />
          <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "var(--color-primary-500)" }} title="Completed" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
