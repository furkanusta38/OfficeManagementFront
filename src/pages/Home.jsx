import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskDetail from "./TaskDetail"; // Yolunu projenin yapısına göre ayarla
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./Home.css";
import TaskAdd from "./TaskAdd";


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  const isTeamLead = user?.role === "teamlead";

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


  const columns = [
    { id: "4", title: "⚪ Backlog", status: 4, color: "#b0b0b0" },   
    { id: "0", title: "🟡 To Do", status: 0, color: "#facc15" },
    { id: "1", title: "🟠  In Progress", status: 1, color: "#fb923c" },
    { id: "2", title: "🟢 Done", status: 2, color: "#22c55e" },
  ];


  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  // İstatistikler
  const backlogCount = tasks.filter(t => t.status === 4).length;
  const waitingCount = tasks.filter(t => t.status === 0).length;
  const inProgressCount = tasks.filter(t => t.status === 1).length;
  const completedCount = tasks.filter(t => t.status === 2).length;

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
    setShowTaskAddModal(true);
  };

  const handleCloseTaskAddModal = () => {
    setShowTaskAddModal(false);
    fetchTasks(); // Yeni görev eklendiyse listeyi güncelle
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2 className="table-title">📋 LivaBoard </h2>
      </div>

      {(isAdmin || isTeamLead) && (
        <div className="add-task-btn-wrapper">
          <button className="add-task-button" onClick={handleAddTask}>
            ➕ Yeni Görev Ekle
          </button>
        </div>
      )}

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
                  <h3 className="kanban-column-title">
                    <span>{col.title}</span>
                    <span className="column-count-badge" style={{ background: col.color }}>
                      {getTasksByStatus(col.status).length}
                    </span>
                  </h3>

                  {getTasksByStatus(col.status).map((task, idx) => (
                    <Draggable key={task.taskId} draggableId={String(task.taskId)} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          className={
                            "modern-kanban-card" + (snapshot.isDragging ? " dragging" : "")
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="modern-card-header">
                            <span className="modern-card-avatar">{task.assignedToUserFullName ? task.assignedToUserFullName[0] : "?"}</span>
                            <span className="modern-card-title">{task.taskTitle}</span>
                            <span className={
                              "modern-card-status status-" + task.status
                            }>
                              {col.title.replace(/^[^ ]+ /, "")}
                            </span>
                          </div>
                          <div className="modern-card-desc">{task.taskDescription}</div>
                          <div className="modern-card-meta">
                            <span>⏳ {task.taskDurationHours} saat</span>
                            <span>👤 {task.assignedToUserFullName}</span>
                          </div>
                          <button
                            className="modern-detail-btn"
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

      {/* Modal Görev Ekle */}
      {showTaskAddModal && (
        <div className="modal-overlay" onClick={handleCloseTaskAddModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseTaskAddModal}>
              X
            </button>
            <TaskAdd onClose={handleCloseTaskAddModal} />
          </div>
        </div>
      )}
    </div>
  );
}
