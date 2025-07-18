import React, { useState } from "react";
import axios from "axios";

export default function CustomerPage() {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const fullName = user?.userFullName || "Müşteri";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7084/api/CustomerRequest",
        {
          fullName,
          message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Talebiniz başarıyla gönderildi.");
      setMessage("");
    } catch (error) {
      alert("Talep gönderilirken hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 style={{ marginBottom: "20px" }}>📩 Talep Gönder</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Talebinizi buraya yazınız..."
            required
            rows={6}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "1.1rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
