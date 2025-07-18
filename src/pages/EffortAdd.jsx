import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // varsa

export default function EffortAdd() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    hoursWorked: "",
    description: "",
    taskIds: [],
  });

  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://localhost:7084/api/TaskItem/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Görevler yüklenemedi:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hoursWorked || !formData.description || formData.taskIds.length === 0) {
      alert("Lütfen tüm alanları doldurun ve en az bir görev seçin.");
      return;
    }

    const payload = {
      userId: user.userId,
      date: formData.date,
      hoursWorked: parseFloat(formData.hoursWorked),
      description: formData.description,
      taskIds: formData.taskIds,
    };

    try {
      await axios.post("https://localhost:7084/api/DailyEffort", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Efor kaydı başarıyla oluşturuldu.");
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        hoursWorked: "",
        description: "",
        taskIds: [],
      });
    } catch (error) {
      console.error("Efor kaydı oluşturulamadı:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">📝 Efor Ekle</h2>

        <form onSubmit={handleSubmit} className="modern-form">

          <div className="form-group">
            <label className="form-label">Tarih:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Çalışılan Saat:</label>
            <input
              type="number"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              className="form-input"
              min="0"
              step="0.1"
              placeholder="Örneğin: 7.5"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Açıklama:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Çalıştığınız Görev(ler):</label>
            <select
              name="taskIds"
              value={formData.taskIds}
              onChange={handleChange}
              className="form-input custom-multiselect"
              multiple
              required
            >
              {tasks.map((task) => (
                <option key={task.taskId} value={task.taskId}>
                  {task.taskTitle}
                </option>
              ))}
            </select>
            <small className="info-text">CTRL (veya Mac için ⌘) tuşuna basarak çoklu seçim yapabilirsin.</small>
          </div>

          <button type="submit" className="btn btn-primary">
            💾 Eforu Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
