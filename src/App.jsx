import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import TaskAdd from "./pages/TaskAdd";
import EmployeeAdd from "./pages/EmployeeAdd";
import MyTasks from "./pages/MyTasks";
import TaskDetail from "./pages/TaskDetail";
import EffortAdd from "./pages/EffortAdd";
import EffortsList from "./pages/EffortList";
import CustomerRequests from "./pages/CustomerRequest";  // Admin sayfası
import CustomerPage from "./pages/CustomerPage";          // Customer talep gönderme sayfası

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();
  // Navbar'ın görünmesini istemediğin sayfaların path'leri burada
  const hideNavbarPaths = ["/", "/customer"];  // Giriş ve müşteri talep gönderme sayfasında navbar gizli
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Giriş sayfası */}
        <Route path="/" element={<Login />} />

        {/* Admin Yetkisi Gereken Sayfalar */}
        <Route
          path="/home"
          element={
    <ProtectedRoute allowedRoles={["admin", "teamlead","user"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-add"
          element={
             <ProtectedRoute allowedRoles={["admin", "teamlead"]}>
              <TaskAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EmployeeAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/efforts-list"  
          element={
             <ProtectedRoute allowedRoles={["admin", "teamlead"]}>
              <EffortsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomerRequests />
            </ProtectedRoute>
          }
        />

        {/* User Yetkisi Gereken Sayfalar */}
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/effort-add"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "teamlead"]}>
              <EffortAdd />
            </ProtectedRoute>
          }
        />

        {/* Customer Rolü İçin Talep Gönderme Sayfası */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
