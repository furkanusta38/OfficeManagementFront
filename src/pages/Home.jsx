import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskDetail from "./TaskDetail"; // Yolunu projenin yapısına göre ayarla
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./Home.css";


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin"; // Admin kontrolü

  console.log("Kullanıcı rolü:", user?.role);
  console.log("isAdmin:", isAdmin);

  // Görevleri çek
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://localhost:7084/api/TaskItem", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Görev durumunu güncelle
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://localhost:7084/api/TaskItem/update-status",
        { taskId, status: parseInt(newStatus) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  // Modal açma
  const openModalWithTask = (taskId) => setSelectedTaskId(taskId);

  // Modal kapatma
  const closeModal = () => setSelectedTaskId(null);

  // Sütunlar ve durumları
  const columns = [
    { id: "4", title: "⚪ Backlog", status: 4 },      // En başa alındı
    { id: "0", title: "🟡 Bekleyen", status: 0 },
    { id: "1", title: "🟠 Devam Ediyor", status: 1 },
    { id: "2", title: "🟢 Tamamlanan", status: 2 },
  ];

  // Duruma göre görevleri filtrele
  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  // Drag & drop sonrası işlem
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStatus = parseInt(destination.droppableId);

    setTasks((prev) =>
      prev.map((task) =>
        String(task.taskId) === draggableId ? { ...task, status: newStatus } : task
      )
    );

    handleStatusChange(draggableId, newStatus);
  };

  // Butonun tıklama fonksiyonu
  const handleAddTask = () => {
    // Görev ekleme sayfasına yönlendir
    navigate("/task-add");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2 className="table-title">📋 Görev Panosu</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  className={
                    "kanban-column" + (snapshot.isDraggingOver ? " dragging-over" : "")
                  }
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="kanban-column-title">{col.title}</h3>

                  {getTasksByStatus(col.status).map((task, idx) => (
                    <Draggable key={task.taskId} draggableId={String(task.taskId)} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          className={
                            "kanban-card" + (snapshot.isDragging ? " dragging" : "")
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="kanban-card-title">{task.taskTitle}</div>
                          <div className="kanban-card-desc">{task.taskDescription}</div>
                          <div className="kanban-card-meta">
                            <span>⏳ {task.taskDurationHours} saat</span>
                            <span>👤 {task.assignedToUserFullName}</span>
                          </div>
                          <button
                            className="detail-button"
                            onClick={() => openModalWithTask(task.taskId)}
                          >
                            Detaya Git
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal Görev Detayı */}
      {selectedTaskId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              X
            </button>
            <TaskDetail id={selectedTaskId} onClose={closeModal} />
          </div>
        </div>
      )}

      {/* Portal ile butonu body'ye ekle */}
      {createPortal(
        <button className="add-task-button" onClick={handleAddTask}>
          ➕ Yeni Görev Ekle
        </button>,
        document.body
      )}
    </div>
  );
}
