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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Rol bazlı yönlendirme
      if (role === "admin") {
        window.location.href = "/home";
      } else if (role === "user") {
        window.location.href = "/my-tasks";
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
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">🔐 Giriş</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
