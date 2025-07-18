import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role?.toLowerCase();

  if (!token) {
    // Giriş yoksa login sayfasına gönder
    return <Navigate to="/" replace />;
  }


  if (allowedRoles.length === 0) {
    return children;
  }

  // Rol kontrolü
  if (!role || !allowedRoles.includes(role)) {
    // Yetkisiz rol varsa ana sayfaya veya uygun bir sayfaya yönlendirebilirsin
    return <Navigate to="/home" replace />;
  }

  // Yetkiliyse çocuk bileşeni göster
  return children;
}
