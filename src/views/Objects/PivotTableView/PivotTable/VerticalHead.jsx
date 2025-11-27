import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";

import { CTableHeadCell, CTableRow } from "../../../../components/CTable";

export default function VerticalHead(props) {
  const [isOpen, setIsOpen] = useState(false);

  const { includeSummary, computedFields, columnsData, computedCalcFields, colsSpanRowCol, notJoinedRows } = props;

  const rowSpanCount = computedFields.rows.filter((field) => field.join).length;

  return computedFields.rows
    .filter((row) => row.join)
    .slice(0, isOpen ? 1 : rowSpanCount)
    .map((row, index) => (
      <>
        <CTableRow key={row.guid}>
          {/* Left summary */}
          {index === 0 && (
            <CTableHeadCell rowSpan={20} style={{ backgroundColor: "#fafafa", padding: "4px" }} noWrap>
              №
            </CTableHeadCell>
          )}
          {index === 0 &&
            computedFields.rows.length > 0 &&
            computedFields.defaults.map((defaultCol) => (
              <CTableHeadCell
                key={defaultCol.field_slug}
                rowSpan={20}
                style={{ backgroundColor: "#fafafa", padding: "4px" }}
                noWrap
              >
                {defaultCol.label.split(" -> ")[0]}
              </CTableHeadCell>
            ))}
          <CTableHeadCell
            colSpan={colsSpanRowCol}
            rowSpan={notJoinedRows.length > 0 ? 2 : 1}
            style={{
              backgroundColor: "#fafafa",
              padding: "4px",
            }}
            noWrap
          >
            {/* Expand toggle */}
            {index === 0 &&
              (isOpen ? (
                <Add style={{ transform: "translate(-2px,4px)" }} onClick={() => setIsOpen((p) => !p)} />
              ) : (
                <RemoveIcon style={{ transform: "translate(-2px,4px)" }} onClick={() => setIsOpen((p) => !p)} />
              ))}
            {row.label}
          </CTableHeadCell>
          {index === 0 &&
            computedFields.rows
              .filter((field) => !field.join)
              .map((col) => (
                <CTableHeadCell
                  key={col.guid}
                  colSpan={notJoinedRows.length}
                  rowSpan={11}
                  style={{ backgroundColor: "#fafafa", padding: "4px" }}
                  noWrap
                >
                  {col.label}
                </CTableHeadCell>
              ))}
          {index === 0 &&
            (computedFields.cols.length
              ? columnsData?.map((group) => (
                  <CTableHeadCell
                    key={group.guid}
                    style={{ backgroundColor: "#fafafa" }}
                    noWrap
                    // TO-DO - change rowSpan
                    rowSpan={isOpen ? 1 : rowSpanCount * 2 - (notJoinedRows.length ? 1 : 2)}
                    colSpan={computedCalcFields.length}
                  >
                    {group?.name}
                  </CTableHeadCell>
                ))
              : computedFields.calc.map((calcCol) => (
                  <CTableHeadCell
                    key={calcCol.label}
                    noWrap
                    style={{ backgroundColor: "#fafafa" }}
                    colSpan={calcCol.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                    rowSpan={isOpen ? 1 : computedFields.rows.filter((i) => i.join)?.length * 2 - 1}
                  >
                    {calcCol.label}
                  </CTableHeadCell>
                )))}
          {computedFields.rows.filter((i) => i.join).length - 1 === index &&
            !notJoinedRows.length &&
            columnsData?.map((group) =>
              computedFields.calc.map((calcCol) => (
                <CTableHeadCell
                  key={calcCol.label + group.guid}
                  noWrap
                  colSpan={calcCol.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                  style={{ backgroundColor: "#fafafa", padding: "4px", fontWeight: "500" }}
                >
                  {calcCol.label}
                </CTableHeadCell>
              ))
            )}
          {index === (rowSpanCount * 2 - 2) / 2 &&
            computedFields.calc.map((calcCol) => (
              <CTableHeadCell
                key={calcCol.label}
                noWrap
                colSpan={calcCol.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                style={{ backgroundColor: "#d9d9d9", padding: "4px", fontWeight: "600" }}
              >
                {calcCol.label}
              </CTableHeadCell>
            ))}
          {index === 0 && (
            <CTableHeadCell
              rowSpan={isOpen ? 1 : rowSpanCount * 2 - (notJoinedRows.length ? 0 : 1) - 1}
              colSpan={computedCalcFields.length}
              noWrap
              style={{ backgroundColor: "#d9d9d9" }}
            >
              Итог
            </CTableHeadCell>
          )}
        </CTableRow>
        {notJoinedRows.length > 0 && (
          <CTableRow key={row.guid}>
            {computedFields.rows.filter((i) => i.join).length - 1 === index &&
              columnsData?.map((group) =>
                computedFields.calc.map((calcCol) => (
                  <CTableHeadCell
                    key={calcCol.label + group.guid}
                    noWrap
                    colSpan={calcCol.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                    style={{ backgroundColor: "#fafafa", padding: "4px", fontWeight: "500" }}
                  >
                    {calcCol.label}
                  </CTableHeadCell>
                ))
              )}
          </CTableRow>
        )}
        {
          <CTableRow>
            {row.table_field_settings.map((rowCol) => (
              <CTableHeadCell
                key={rowCol.field_slug}
                noWrap
                colSpan={
                  colsSpanRowCol % row.table_field_settings.length === 0
                    ? colsSpanRowCol / row.table_field_settings.length
                    : 1
                }
                style={{ padding: "2px 4px", fontWeight: "500" }}
              >
                {/* {JSON.stringify(rowCol)} */}
                {rowCol.field_type.includes("LOOKUP") ? rowCol.table_to.label : rowCol.label.split("->")[0]}
              </CTableHeadCell>
            ))}
            {colsSpanRowCol % row?.table_field_settings.length !== 0 && (
              <CTableHeadCell colSpan={colsSpanRowCol - row?.table_field_settings.length}></CTableHeadCell>
            )}
            {rowSpanCount - 1 === index &&
              notJoinedRows.map((rowCol) => (
                <CTableHeadCell key={rowCol.field_slug} style={{ padding: "2px 4px", fontWeight: 500 }} noWrap>
                  {rowCol.field_type.includes("LOOKUP") ? rowCol.table_to.label : rowCol.label}
                </CTableHeadCell>
              ))}
            {/* Values' titles */}
            {(isOpen ? true : rowSpanCount - 1 === index) && (
              <>
                {computedFields.cols.length
                  ? columnsData?.map(() =>
                      computedCalcFields.map((calcCol) => (
                        <CTableHeadCell key={calcCol.key} noWrap style={{ padding: "2px 4px", fontWeight: "500" }}>
                          {calcCol.label}
                        </CTableHeadCell>
                      ))
                    )
                  : computedCalcFields.map((calcCol) => (
                      <CTableHeadCell key={calcCol.key} noWrap style={{ padding: "2px 4px", fontWeight: "500" }}>
                        {calcCol.label}
                      </CTableHeadCell>
                    ))}
                {computedCalcFields?.map((calcCol) => (
                  <CTableHeadCell
                    key={calcCol?.key}
                    noWrap
                    style={{ padding: "2px 4px", fontWeight: "600", backgroundColor: "#d9d9d9" }}
                  >
                    {calcCol?.label}
                  </CTableHeadCell>
                ))}
              </>
            )}
          </CTableRow>
        }
      </>
    ));
}
