import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Geçersiz user verisi:", e);
    localStorage.removeItem("user");
  }

  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isNormalUser = role === "user";
  const isCustomer = role === "customer";
  const isTeamLead = role === "teamlead";

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">DataLiva Ofis Yönetim</div>

      <div className="navbar-links">
        {token ? (
          <>
            <Link className="navbar-button btn-home" to="/home">Ana Sayfa</Link>

            {/* Admin linkleri */}
            {isAdmin && (
              <>
                <Link className="navbar-button btn-task-add" to="/task-add">Görev Ekle</Link>
                <Link className="navbar-button btn-employee-add" to="/employee-add">Çalışan Yönetimi</Link>
                <Link className="navbar-button btn-efforts-list" to="/efforts-list">Efor Yönetimi</Link>
                <Link className="navbar-button btn-customer-requests" to="/customer-requests">Müşteri Talepleri</Link>
              </>
            )}

            {/* TeamLead linkleri */}
            {isTeamLead && (
              <>
                <Link className="navbar-button btn-task-add" to="/task-add">Görev Ekle</Link>
                <Link className="navbar-button btn-efforts-list" to="/efforts-list">Çalışan Eforları</Link>
                <Link className="navbar-button btn-effort-add" to="/effort-add">Efor Ekle</Link>
              </>
            )}  

            {/* Normal kullanıcı (user) linkleri */}
            {isNormalUser && (
              <>
                <Link className="navbar-button btn-my-tasks" to="/my-tasks">Görevlerim</Link>
                <Link className="navbar-button btn-effort-add" to="/effort-add">Efor Ekle</Link>
              </>
            )}

            {/* Customer rolü navbar göstermez */}

            {/* Dark mode toggle */}
            <label className="darkmode-toggle" title="Karanlık Mod">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((dm) => !dm)}
                aria-label="Karanlık Mod"
              />
              <span className="slider" />
            </label>

            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
              title="Çıkış Yap"
              aria-label="Çıkış Yap"
            >
              <span role="img" aria-label="Çıkış">🚪</span>
            </button>
          </>
        ) : (
          <Link className="navbar-button btn-home" to="/">Giriş</Link>
        )}
      </div>

      {user && (
        <div className="user-welcome">
          <span className="welcome-text">Hoşgeldin</span>
          <span className="user-name">{user.userFullName}</span>
          {user.department && (
            <div style={{ fontSize: '0.92rem', color: '#888', marginTop: 2, marginLeft: 4 }}>
              {user.department}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
