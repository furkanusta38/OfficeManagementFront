import React, { useState } from "react";
import axios from "axios";
import CustomStore from "devextreme/data/custom_store";
import LivaGrid from "../components/LivaGrid";

export default function EffortsList() {
  const [page, setPage] = useState(1); 
  const pageSize = 5;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.toLowerCase();

  // CustomStore ile server-side sayfalama
  const store = new CustomStore({
    key: "effortId",
    load: async (loadOptions) => {
      const currentPage = loadOptions.take
        ? Math.floor(loadOptions.skip / loadOptions.take) + 1
        : 1;
      const currentPageSize = loadOptions.take || pageSize;

      let endpoint = "https://localhost:7084/api/DailyEffort/paged";
      if (role === "teamlead") {
        endpoint = "https://localhost:7084/api/DailyEffort/teamlead/paged";
      }

      try {
        const response = await axios.get(endpoint, {
          params: {
            page: currentPage,
            pageSize: currentPageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          data: response.data.data,
          totalCount: response.data.totalCount,
        };
      } catch (error) {
        throw "Veriler alınırken hata oluştu.";
      }
    },
  });


  const columns = [
    { dataField: "userFullName", caption: "Kullanıcı", visible: true, width: 220, allowSorting: true, fontWeight: "bold" },
    { dataField: "date", caption: "Tarih", visible: true, width: 110, allowSorting: true,
      cellRender: (cellData) => new Date(cellData.value).toLocaleDateString("tr-TR") },
    { dataField: "hoursWorked", caption: "Çalışılan Saat", visible: true, width: 130, allowSorting: false },
    { dataField: "description", caption: "Açıklama", visible: true, width: 180, allowSorting: false },
    { dataField: "taskTitle", caption: "Görev", visible: true, allowSorting: false,
      cellRender: (cellData) => cellData.value ? cellData.value : "Atanmamış" },
  ];

  return (
    <div className="page-container">
      <div className="content-container">
        <h2 className="page-title">📊 Çalışan Eforları</h2>

        <LivaGrid
          dataSource={store}
          columns={columns}
          keyExpr="effortId"
          pageSize={pageSize}
          height="auto"
          autoHideColumns={true}
          showRowLines={true}
          rowAlternationEnabled={false}

        />
      </div>
    </div>
  );
}
