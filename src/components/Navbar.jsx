import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';
import logo from "../assets/livaboardlogo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [showUserTooltip, setShowUserTooltip] = useState(false);

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
    <nav className="navbar-simple">
      <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logo} alt="Logo" height={60} style={{ marginRight: 12 }} />
        Ofis Yönetimi 
      </div>
      <div className="navbar-links-simple">
        {token ? (
          <>
            <Link className="nav-link-simple" to="/home">Ana Sayfa</Link>
            {isAdmin && (
              <>
                <Link className="nav-link-simple" to="/employee-add">Çalışan Yönetimi</Link>
                <Link className="nav-link-simple" to="/efforts-list">Efor Yönetimi</Link>
                <Link className="nav-link-simple" to="/customer-requests">Müşteri Talepleri</Link>
              </>
            )}
            {isTeamLead && (
              <>
                <Link className="nav-link-simple" to="/efforts-list">Çalışan Eforları</Link>
                <Link className="nav-link-simple" to="/effort-add">Efor Ekle</Link>
              </>
            )}
            {isNormalUser && (
              <>
                <Link className="nav-link-simple" to="/my-tasks">Görevlerim</Link>
                <Link className="nav-link-simple" to="/effort-add">Efor Ekle</Link>
              </>
            )}
            <label className="darkmode-toggle" title="Karanlık Mod">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((dm) => !dm)}
                aria-label="Karanlık Mod"
              />
              <span className="slider">
                <span className="icon" style={{
                  position: 'absolute',
                  top: 3,
                  left: darkMode ? 3 : 25,
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#fff',
                  transition: 'left 0.3s',
                  pointerEvents: 'none',
                }}>{darkMode ? '🌙' : '☀️'}</span>
              </span>
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
          <Link className="nav-link-simple" to="/">Giriş</Link>
        )}
      </div>
      {user && (
        <div className="user-welcome">
          <span className="welcome-text">Hoşgeldin</span>
          <span
            className="user-name user-tooltip-trigger"
            onMouseEnter={() => setShowUserTooltip(true)}
            onMouseLeave={() => setShowUserTooltip(false)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {user.userFullName}
            {showUserTooltip && (
              <div className="user-tooltip">
                <div><b>Ad Soyad:</b> {user.userFullName}</div>
                {user.email && <div><b>E-posta:</b> {user.email}</div>}
                {user.department && <div><b>Departman:</b> {user.department}</div>}
                {user.role && <div><b>Rol:</b> {user.role}</div>}
              </div>
            )}
          </span>
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
