import React, { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });
      const role = data.role ? data.role.toLowerCase() : "";
      localStorage.setItem("token", data.token);
      const user = {
        userFullName: data.userFullName,
        role: role,
        userId: data.userId,
      };
      localStorage.setItem("user", JSON.stringify(user));
      // Rol bazlı yönlendirme
      if (["admin", "teamlead", "user"].includes(role)) {
        window.location.href = "/home";
      } else if (role === "customer") {
        window.location.href = "/customer";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err.message || "Giriş yapılamadı");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      background: "linear-gradient(120deg, #6366f1 0%, #38bdf8 100%)",
      padding: 0,
      paddingTop: 48,
    }}>
      <div style={{
        maxWidth: 340,
        width: "100%",
        boxShadow: "0 8px 32px 0 rgba(56,189,248,0.18)",
        borderRadius: 18,
        padding: "1.7rem 1.1rem 1.1rem 1.1rem",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}>
        <div style={{
          width: 48,
          height: 48,
          background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          boxShadow: "0 4px 16px rgba(56,189,248,0.13)",
        }}>
          <span role="img" aria-label="login" style={{ fontSize: 26, color: "#fff" }}>🔐</span>
        </div>
        <h1 style={{
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "#6366f1",
          marginBottom: 4,
          letterSpacing: 1,
          textAlign: "center",
        }}>
          LivaBoard Giriş
        </h1>
        <div style={{ color: "#64748b", marginBottom: 18, fontSize: "0.98rem", textAlign: "center" }}>
          Hoş geldiniz! 
        </div>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Mail adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.98rem",
              borderRadius: 8,
              border: "1.2px solid #e5e7eb",
              marginBottom: 12,
              background: "#f1f5f9",
              transition: "border 0.2s",
              outline: "none",
            }}
            onFocus={e => e.target.style.border = "1.2px solid #6366f1"}
            onBlur={e => e.target.style.border = "1.2px solid #e5e7eb"}
          />
          <input
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.98rem",
              borderRadius: 8,
              border: "1.2px solid #e5e7eb",
              marginBottom: 12,
              background: "#f1f5f9",
              transition: "border 0.2s",
              outline: "none",
            }}
            onFocus={e => e.target.style.border = "1.2px solid #6366f1"}
            onBlur={e => e.target.style.border = "1.2px solid #e5e7eb"}
          />
          {error && <div style={{ color: "#ef4444", background: "#fef2f2", borderRadius: 8, padding: "8px 10px", marginBottom: 10, textAlign: "center", fontSize: "0.93rem" }}>{error}</div>}
          <button type="submit" style={{
            width: "100%",
            background: "linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0.8rem 0",
            fontSize: "1.01rem",
            fontWeight: 700,
            marginTop: 4,
            boxShadow: "0 2px 8px 0 rgba(99, 102, 241, 0.08)",
            transition: "background 0.2s, box-shadow 0.2s",
            cursor: "pointer",
          }}
            onMouseOver={e => e.target.style.background = "linear-gradient(90deg, #818cf8 0%, #38bdf8 100%)"}
            onMouseOut={e => e.target.style.background = "linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)"}
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
