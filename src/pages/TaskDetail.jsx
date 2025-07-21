import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TaskDetail({ id, onClose, onDelete }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("TaskDetail'e gelen id:", id);

    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7084/api/TaskItem/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Task verisi:", response.data);
        setTask(response.data);
      } catch (err) {
        console.error("Görev detayları alınamadı:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7084/api/TaskComment/task/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Yorumlar:", res.data);
        setComments(res.data);
      } catch (error) {
        console.error("Yorumlar alınamadı:", error);
      }
    };

    if (id) {
      fetchTask();
      fetchComments();
    } else {
      console.warn("TaskDetail bileşenine id gelmedi!");
    }
  }, [id, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        "https://localhost:7084/api/TaskComment",
        {
          taskId: parseInt(id),
          userId: user.userId,
          content: newComment.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment("");

      const res = await axios.get(
        `https://localhost:7084/api/TaskComment/task/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Yeni yorumlar:", res.data);
      setComments(res.data);
    } catch (error) {
      console.error("Yorum eklenemedi:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Bu görevi silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://localhost:7084/api/TaskItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Görev başarıyla silindi.");
      onClose();
      if (onDelete) onDelete(); // görevleri yenile
    } catch (error) {
      console.error("Görev silinemedi:", error);
      alert("Bir hata oluştu, görev silinemedi.");
    }
  };

  if (!task) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p style={{ padding: 20, textAlign: "center" }}>Yükleniyor veya görev bulunamadı...</p>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>{task.taskTitle}</h2>

        <div className="task-field">
          <strong>Kısa Açıklama:</strong> {task.taskDescription}
        </div>
        <div className="task-field">
          <strong>Uzun Açıklama:</strong> {task.longDescription || "Belirtilmemiş"}
        </div>
        <div className="task-field">
          <strong>Tarih Aralığı:</strong>{" "}
          {new Date(task.taskStartDate).toLocaleDateString("tr-TR")} -{" "}
          {new Date(task.taskEndDate).toLocaleDateString("tr-TR")}
        </div>
        <div className="task-field">
          <strong>İlgili Müşteri:</strong> {task.forWho || "Belirtilmemiş"}
        </div>

        {task.imageUrl && (
          <div className="task-image-container">
            <strong>Göreve Ait Görsel:</strong>
            <br />
            <img
              src={task.imageUrl}
              alt="Görev görseli"
              className="task-image"
            />
          </div>
        )}

        <div className="comments">
          <h3>Yorumlar</h3>
          {comments.length === 0 && <p>Henüz yorum yok.</p>}
          {comments.map((c) => (
            <div key={c.commentId} className="comment">
              <strong>{c.userFullName}</strong>
              <p>{c.content}</p>
            </div>
          ))}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Yeni yorum yaz..."
            className="comment-input"
          />
          <button onClick={handleAddComment} disabled={!newComment.trim()}>
            Yorum Ekle
          </button>

          {user.role === "admin" || user.role === "teamlead" && (
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "#f44336",
                marginTop: "20px",
                display: "block",
              }}
            >
              Görevi Sil
            </button>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 15px;
        }

        .modal-content {
          background: white;
          padding: 30px 40px;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #555;
          transition: color 0.3s ease;
        }

        .modal-close:hover {
          color: #2196f3;
        }

        h2 {
          margin-bottom: 25px;
          color: #1976d2;
          font-weight: 700;
          text-align: center;
          letter-spacing: 1px;
        }

        .task-field {
          margin-bottom: 15px;
          font-size: 1rem;
          line-height: 1.4;
        }

        .task-image-container {
          margin-top: 20px;
          text-align: center;
        }

        .task-image {
          max-width: 100%;
          max-height: 300px;
          margin-top: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
        }

        .comments {
          margin-top: 30px;
          font-size: 1rem;
        }

        .comments h3 {
          margin-bottom: 15px;
          color: #2196f3;
          font-weight: 600;
          border-bottom: 2px solid #2196f3;
          padding-bottom: 6px;
        }

        .comment {
          background: #f5f5f5;
          padding: 12px 15px;
          margin-bottom: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(33,150,243,0.1);
        }

        .comment strong {
          display: block;
          margin-bottom: 4px;
          color: #1976d2;
        }

        .comment-input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          resize: vertical;
          font-size: 1rem;
          margin-top: 10px;
          box-sizing: border-box;
        }

        button {
          margin-top: 12px;
          background: #2196f3;
          color: white;
          padding: 10px 22px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        button:disabled {
          background: #9ecdf7;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background: #1976d2;
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 20px;
          }
          h2 {
            font-size: 1.5rem;
          }
          .task-field {
            font-size: 0.9rem;
          }
          .comment-input {
            font-size: 0.9rem;
          }
          button {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
