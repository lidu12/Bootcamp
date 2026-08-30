import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.detail || "Invalid email or password";
      setError(typeof msg === "string" ? msg : "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "36px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "var(--color-primary-500)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--color-text)" }}>Welcome Back</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Log in to continue your coding bootcamp journey
          </p>
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
              marginBottom: "20px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-input"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: "40px" }}
              />
              <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label">Password</label>
              <Link to="/reset-password" style={{ fontSize: "0.8rem" }}>Forgot?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: "40px" }}
              />
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg btn-primary"
            style={{ width: "100%", marginTop: "12px" }}
          >
            {loading ? "Authenticating..." : "Log In"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
