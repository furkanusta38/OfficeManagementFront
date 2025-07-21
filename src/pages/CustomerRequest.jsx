import React, { useEffect, useState } from "react";
import axios from "axios";
import LivaGrid from "../components/LivaGrid"; // Path senin klasör yapına göre değişebilir

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://localhost:7084/api/CustomerRequest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Talepler alınamadı:", error);
      }
    };

    fetchRequests();
  }, [token]);

  // Kolon yapılandırması
  const columns = [
    { dataField: "fullName", caption: "Ad Soyad" },
    { dataField: "message", caption: "Mesaj" },
    {
      dataField: "createdAt",
      caption: "Tarih",
      cellRender: (cellData) => new Date(cellData.value).toLocaleString("tr-TR"),
    },
  ];

  return (
    <div className="home-container customer-requests-page">
      <div className="table-container">
        <h2 className="table-title"><span role="img" aria-label="Talepler" style={{marginRight: 8}}>📬</span>Müşteri Talepleri</h2>

        {requests.length === 0 ? (
          <p className="empty-message">Hiç talep bulunamadı.</p>
        ) : (
          <LivaGrid
            dataSource={requests}
            columns={columns}
            keyExpr="requestId" 
            pageSize={10}
            autoHideColumns={true}
            width="100%"
            height={600}
          />
        )}
      </div>
    </div>
  );
}
