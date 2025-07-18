import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskAdd() {
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    longDescription: "",
    imageUrl: "",
    taskDurationHours: "",
    taskStartDate: "",
    taskEndDate: "",
    assignedToUserId: "",
    forWho: "", // 👈 yeni alan
  });

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const forWhoOptions = [
    "DataLiva",
    "X Şirketi",
    "C Şirketi",
    "Y Şirketi",
    "Z Şirketi",
    "V Şirketi",
    "A Şirketi",

  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://localhost:7084/api/User", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Kullanıcılar alınamadı:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7084/api/TaskItem", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Görev başarıyla eklendi!");
      setFormData({
        taskTitle: "",
        taskDescription: "",
        longDescription: "",
        imageUrl: "",
        taskDurationHours: "",
        taskStartDate: "",
        taskEndDate: "",
        assignedToUserId: "",
        forWho: "", // sıfırla
      });
    } catch (err) {
      console.error("Görev eklenemedi:", err);
      alert("Hata oluştu. Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">📝 Görev Ekle</h2>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label className="form-label">Başlık:</label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Görev başlığını girin"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Açıklama:</label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              className="form-textarea"
              required
              placeholder="Görev açıklamasını girin"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Uzun Açıklama:</label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Detaylı açıklama girin (isteğe bağlı)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Görsel URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">İşin Alacağı Tahmini Süre (saat):</label>
            <input
              type="number"
              name="taskDurationHours"
              value={formData.taskDurationHours}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Tahmini süre"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Başlangıç Tarihi:</label>
            <input
              type="date"
              name="taskStartDate"
              value={formData.taskStartDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Beklenen Bitiş Tarihi:</label>
            <input
              type="date"
              name="taskEndDate"
              value={formData.taskEndDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bu iş kim için?</label>
            <select
              name="forWho"
              value={formData.forWho}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Şirket seçiniz</option>
              {forWhoOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Çalışan Seç:</label>
            <select
              name="assignedToUserId"
              value={formData.assignedToUserId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Çalışan seçiniz</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userFullName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            💾 Görevi Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
