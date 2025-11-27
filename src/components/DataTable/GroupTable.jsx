import { useState } from "react";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableHeadRow,
  CTableRow,
} from "../CTable";
import TableCard from "../TableCard";

const GroupTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedGroupRows, setExpandedGroupRows] = useState([]);

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };
  const groupToggleRow = (index) => {
    if (expandedGroupRows.includes(index)) {
      setExpandedGroupRows(
        expandedGroupRows.filter((rowIndex) => rowIndex !== index)
      );
    } else {
      setExpandedGroupRows([...expandedGroupRows, index]);
    }
  };

  return (
    <TableCard>
      <CTable removableHeight={140}>
        <CTableHead>
          <CTableHeadRow>
            <CTableHeadCell>Country</CTableHeadCell>
            <CTableHeadCell>Year</CTableHeadCell>
            <CTableHeadCell>Sport</CTableHeadCell>
            <CTableHeadCell>Atlethe</CTableHeadCell>
            <CTableHeadCell>Gold</CTableHeadCell>
            <CTableHeadCell>Silver</CTableHeadCell>
            <CTableHeadCell>Bronze</CTableHeadCell>
            <CTableHeadCell>Total</CTableHeadCell>
          </CTableHeadRow>
        </CTableHead>
        <CTableBody columnsCount={6} dataLength={data?.length}>
          {data?.map((row, index) => (
            <>
              <CTableRow onClick={() => toggleRow(index)} key={index}>
                <CTableCell>{row.country}</CTableCell>
                <CTableCell></CTableCell>
                <CTableCell></CTableCell>
                <CTableCell></CTableCell>
                <CTableCell>{row.gold}</CTableCell>
                <CTableCell>{row.silver}</CTableCell>
                <CTableCell>{row.bronze}</CTableCell>
                <CTableCell>{row.total}</CTableCell>
              </CTableRow>
              {expandedRows.includes(index) &&
                row.year?.map((year, yearIndex) => (
                  <>
                    <CTableRow
                      key={yearIndex}
                      onClick={() => {
                        groupToggleRow(yearIndex);
                      }}
                    >
                      <CTableCell></CTableCell>
                      <CTableCell>{year.year}</CTableCell>
                      <CTableCell></CTableCell>
                      <CTableCell></CTableCell>
                      <CTableCell>{year.gold}</CTableCell>
                      <CTableCell>{year.silver}</CTableCell>
                      <CTableCell>{year.bronze}</CTableCell>
                      <CTableCell>{year.total}</CTableCell>
                    </CTableRow>
                    {expandedGroupRows.includes(yearIndex)
                      ? year.data.map((data, dataIndex) => (
                          <CTableRow key={dataIndex}>
                            <CTableCell></CTableCell>
                            <CTableCell></CTableCell>
                            <CTableCell>{data.company}</CTableCell>
                            <CTableCell>{data.athlete}</CTableCell>
                            <CTableCell>{data.gold}</CTableCell>
                            <CTableCell>{data.silver}</CTableCell>
                            <CTableCell>{data.bronze}</CTableCell>
                            <CTableCell>{data.total}</CTableCell>
                          </CTableRow>
                        ))
                      : null}
                  </>
                ))}
            </>
          ))}
        </CTableBody>
      </CTable>
    </TableCard>
  );
};

export default GroupTable;
