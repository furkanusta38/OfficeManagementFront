import React from "react";
import { DataGrid, Column, Paging, Pager, FilterRow, HeaderFilter, SearchPanel } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";

/**
 * @param {{
 *  dataSource: any[],
 *  columns: {
 *    visible: boolean,
 *    dataField: string,
 *    caption?: string,
 *    cellRender?: any,
 *    width?: number,
 *    allowSorting?: boolean,
 *    fontWeight?: string,
 *    backgroundColor?: string,
 *    color?: string,
 *    textAlign?: "left" | "center" | "right",
 *  }[],
 *  keyExpr?: string,
 *  pageSize?: number,
 *  showSearch?: boolean,
 *  autoHideColumns?: boolean,
 *  width?: number | string,
 *  allowSorting?: boolean,
 *  showRowLines?: boolean,
 *  rowAlternationEnabled?: boolean,
 *  height?: number | string,
 * }} props
 */
export default function LivaGrid({
  dataSource,
  columns,
  keyExpr = "id",
  pageSize = 10,
  showSearch = true,
  autoHideColumns = false,
  allowSorting = true,
  showRowLines = false,
  rowAlternationEnabled = false,
  height = "auto",
  width = "auto",
}) {
  return (
    <DataGrid
      dataSource={dataSource}
      keyExpr={keyExpr}
      showBorders={true}
      columnAutoWidth={true}
      allowColumnResizing={true}
      height={height}
      width={width}
      columnHidingEnabled={autoHideColumns}
      allowSorting={allowSorting}
      showRowLines={showRowLines}
      rowAlternationEnabled={rowAlternationEnabled}
      
      remoteOperations={{
        paging: true,
        filtering: true,
        sorting: true,
      }}
    >
      <Paging defaultPageSize={pageSize} />
      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={[5, 10, 20, 50]}
        showInfo={true}
        showNavigationButtons={true}
        showPageIndexSelector={true}
      />

      {showSearch && <SearchPanel visible={true} highlightCaseSensitive={true} />}
      <FilterRow visible={true} />
      <HeaderFilter visible={true} />

      {columns.map(
        (
          {
            dataField,
            caption,
            cellRender,
            visible,
            width,
            allowSorting,
            fontWeight,
            backgroundColor,
            color,
            textAlign,
          },
          index
        ) => {
          const customCellRender =
            cellRender ||
            ((cellInfo) => (
              <div
                style={{
                  fontWeight: fontWeight || "normal",
                  backgroundColor: backgroundColor || "transparent",
                  color: color || "inherit",
                  textAlign: textAlign || "left",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                  boxSizing: "border-box",
                }}
              >
                {cellInfo.value}
              </div>
            ));

          return (
            <Column
              key={index}
              dataField={dataField}
              caption={caption}
              cellRender={customCellRender}
              visible={visible}
              width={width}
              allowSorting={allowSorting}
            />
          );
        }
      )}
    </DataGrid>
  );
}
