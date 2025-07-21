import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskDetail from "./TaskDetail";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  const openDetailModal = (taskId) => {
    setSelectedTaskId(taskId);
  };
  const closeDetailModal = () => {
    setSelectedTaskId(null);
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
                  <th>Detay</th>
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
                      <button className="detail-table-btn" onClick={() => openDetailModal(task.taskId)}>
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
      {selectedTaskId && (
        <TaskDetail id={selectedTaskId} onClose={closeDetailModal} />
      )}
    </div>
  );
}
