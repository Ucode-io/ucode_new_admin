import React from "react";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

export default function ColumnButton({onClick}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "#A8A8A8",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: "16px",
        letterSpacing: "0em",
        textAlign: "left",
        padding: '0 10px'
      }}
      onClick={(e) => onClick(e)}
    >
      <TableChartOutlinedIcon color={"#A8A8A8"} />
      Column
    </div>
  );
}
