import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7084/api/TaskItem/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data);
      } catch (err) {
        console.error("Görevler alınamadı:", err);
      }
    };

    if (user?.userId) {
      fetchTasks();
    }
  }, [token, user]);

  const goToDetail = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">📝 Benim Görevlerim</h2>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Henüz görev bulunmuyor</h3>
            <p>Size atanmış görevler burada görünecek</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Açıklama</th>
                  <th>Başlangıç</th>
                  <th>Beklenen Bitiş</th>
                  <th>Süre (saat)</th>
                  <th>Detay</th> {/* Yeni sütun */}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskTitle}</td>
                    <td>{task.taskDescription}</td>
                    <td>{new Date(task.taskStartDate).toLocaleDateString()}</td>
                    <td>{new Date(task.taskEndDate).toLocaleDateString()}</td>
                    <td>{task.taskDurationHours}</td>
                    <td>
                      <button className="detail-table-btn" onClick={() => goToDetail(task.taskId)}>
                        Detaya Git
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
