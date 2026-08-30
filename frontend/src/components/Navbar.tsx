import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, Map, Settings, Palette, Sun, Moon, Sparkles, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeSelectorModal } from "./ThemeSelectorModal";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { shadeMode, cycleShade, activeTheme } = useTheme();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none", position: "sticky", top: 0, zIndex: 50, padding: "12px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo & Brand */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "var(--color-primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.03em" }}>
                Dev<span style={{ color: "var(--color-primary-500)" }}>bloom</span>
              </span>
              <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 600, color: "var(--color-text-muted)", marginTop: "-2px" }}>
                Bootcamp Journey Tracker
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              to="/dashboard"
              className={`btn btn-sm ${isActive("/dashboard") || isActive("/") ? "btn-primary" : "btn-outline"}`}
              style={{ border: isActive("/dashboard") || isActive("/") ? "none" : "1.5px solid transparent" }}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/roadmap"
              className={`btn btn-sm ${isActive("/roadmap") ? "btn-primary" : "btn-outline"}`}
              style={{ border: isActive("/roadmap") ? "none" : "1.5px solid transparent" }}
            >
              <Map size={16} />
              <span>180-Day Roadmap</span>
            </Link>
            <Link
              to="/history"
              className={`btn btn-sm ${isActive("/history") ? "btn-primary" : "btn-outline"}`}
              style={{ border: isActive("/history") ? "none" : "1.5px solid transparent" }}
            >
              <History size={16} />
              <span>Submissions</span>
            </Link>
            {user && (
              <Link
                to={`/u/${user.username}`}
                target="_blank"
                className="btn btn-sm btn-outline"
                style={{ border: "1.5px solid transparent" }}
                title="View shareable public profile"
              >
                <Share2 size={16} />
                <span>Public Card</span>
              </Link>
            )}
            <Link
              to="/settings"
              className={`btn btn-sm ${isActive("/settings") ? "btn-primary" : "btn-outline"}`}
              style={{ border: isActive("/settings") ? "none" : "1.5px solid transparent" }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Actions & Theme Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="btn btn-sm btn-outline"
              style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "9999px", padding: "6px 14px" }}
              title="Change Aesthetic Theme"
            >
              <Palette size={16} style={{ color: "var(--color-primary-500)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{activeTheme.name}</span>
            </button>

            <button
              onClick={cycleShade}
              className="btn btn-sm btn-outline"
              style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}
              title={`Current: ${shadeMode.toUpperCase()} shade. Click to cycle (Dark -> Medium -> Light)`}
            >
              {shadeMode === "dark" ? (
                <Moon size={18} style={{ color: "#c084fc" }} />
              ) : shadeMode === "medium" ? (
                <Sun size={18} style={{ color: "#f97316" }} />
              ) : (
                <Sun size={18} style={{ color: "#f59e0b" }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {isThemeModalOpen && <ThemeSelectorModal onClose={() => setIsThemeModalOpen(false)} />}
    </>
  );
};
