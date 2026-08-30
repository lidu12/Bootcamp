import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "420px", padding: "36px", borderRadius: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", backgroundColor: "var(--color-primary-500)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: "1.6rem", color: "var(--color-text)" }}>Start Devbloom</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "4px" }}>Create your account to track your bootcamp journey</p>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", fontSize: "0.85rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: "relative" }}>
              <UserIcon size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input type="text" required className="form-input" style={{ paddingLeft: "42px" }} placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input type="email" required className="form-input" style={{ paddingLeft: "42px" }} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input type="password" required minLength={6} className="form-input" style={{ paddingLeft: "42px" }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "10px" }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link to="/dashboard" style={{ color: "var(--color-primary-500)", fontWeight: 700 }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
