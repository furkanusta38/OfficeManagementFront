import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, Column, Paging, Pager, SearchPanel } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";

export default function EmployeeAdd() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userFullName: "",
    department: "",
    email: "",
    password: "",
    role: "User",
  });

  const departments = [
    "Bilgi Teknolojileri",
    "İnsan Kaynakları",
    "Finans",
    "Satış",
    "Pazarlama",
    "Operasyon",
    "Yazılım",
    "Destek",
    "Lojistik",
    "Yönetim",
    "Stajyer",
    "Diğer",
  ];

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7084/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Çalışanlar alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7084/api/User", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Çalışan başarıyla eklendi.");
      setFormData({
        userFullName: "",
        department: "",
        email: "",
        password: "",
        role: "User",
      });
      fetchUsers();
    } catch (err) {
      console.error("Çalışan eklenemedi:", err);
      alert("Hata oluştu. Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">👥 Çalışan Yönetimi</h2>

        <div style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          <DataGrid
            dataSource={users}
            keyExpr="userId"
            showBorders={true}
            columnAutoWidth={true}
            rowAlternationEnabled={true}
          >
            <SearchPanel visible={true} highlightCaseSensitive={true} width={300} />
            <Paging defaultPageSize={10} />
            <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
            <Column dataField="userFullName" caption="Ad Soyad" />
            <Column dataField="email" caption="Email" />
            <Column dataField="department" caption="Departman" />
            <Column dataField="role" caption="Rol" />
          </DataGrid>
        </div>

        <h3 style={{ color: "#7c3aed", marginBottom: "20px", fontSize: "1.5rem" }}>
          ➕ Yeni Çalışan Ekle
        </h3>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label className="form-label">Ad Soyad:</label>
            <input
              type="text"
              name="userFullName"
              value={formData.userFullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Çalışanın adı ve soyadı"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Departman:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Departman Seçin</option>
              {departments.map((dep, i) => (
                <option key={i} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Çalışanın email adresi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Çalışanın şifresi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="TeamLead">TeamLead</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            👤 Çalışan Ekle
          </button>
        </form>
      </div>
    </div>
  );
}
