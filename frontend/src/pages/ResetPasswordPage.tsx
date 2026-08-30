import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import api from "../services/api";

export const ResetPasswordPage: React.FC = () => {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/password-reset/request", { email: email.trim() });
      setMessage("Password reset token generated! Copy demo token below to reset your password.");
      if (res.data.demo_reset_token) {
        setResetToken(res.data.demo_reset_token);
      }
      setStep("confirm");
    } catch (err: any) {
      console.error("Reset request failed:", err);
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/password-reset/confirm", {
        token: resetToken.trim(),
        new_password: newPassword,
      });
      setMessage("Password updated successfully! You can now log in.");
    } catch (err: any) {
      console.error("Reset confirm failed:", err);
      const msg = err.response?.data?.detail || "Invalid or expired token";
      setError(typeof msg === "string" ? msg : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div
        className="glass-panel animate-fade-in"
        style={{ width: "100%", maxWidth: "440px", padding: "36px", borderRadius: "24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "var(--color-primary-500)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            <KeyRound size={26} />
          </div>
          <h1 style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>Reset Password</h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
            {step === "request" ? "Enter your email to receive password reset instructions" : "Set your new password below"}
          </p>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#a7f3d0", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <CheckCircle2 size={18} /> <span>{message}</span>
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestReset}>
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

            <button type="submit" disabled={loading} className="btn btn-lg btn-primary" style={{ width: "100%", marginTop: "12px" }}>
              {loading ? "Generating..." : "Request Reset Token"} <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset}>
            <div className="form-group">
              <label className="form-label">Reset Token</label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste token here..."
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-lg btn-primary" style={{ width: "100%", marginTop: "12px" }}>
              {loading ? "Updating..." : "Confirm New Password"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.88rem" }}>
          <Link to="/login" style={{ color: "var(--color-text-muted)" }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
