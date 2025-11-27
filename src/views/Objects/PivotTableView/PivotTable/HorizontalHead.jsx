import React, { useMemo } from "react";

import { CTableHeadCell, CTableRow } from "../../../../components/CTable";

export default function HorizontalHead(props) {
  const { includeSummary, computedFields, colsSpanRowCol, columnsData, computedCalcFields } = props;

  const rowSpanCount = computedFields.rows.filter((field) => field.join).length;

  const rowsColCount = useMemo(() => {
    if (computedFields.rows.length)
      return Math.max(...computedFields.rows.reduce((acc, cur) => [acc, cur.table_field_settings.length ?? 0], 0));
    return 0;
  }, [computedFields]);

  return (
    <>
      <CTableRow>
        <CTableHeadCell
          rowSpan={computedFields.calc?.length ? 3 : 1}
          style={{ backgroundColor: "#fafafa", padding: "4px" }}
          noWrap
        >
          №
        </CTableHeadCell>
        {computedFields.rows.length > 0 &&
          computedFields.defaults.map((defaultCol) => (
            <CTableHeadCell
              rowSpan={8}
              style={{ backgroundColor: "#fafafa", padding: "4px", minWidth: "150px" }}
              noWrap
              key={defaultCol.field_slug}
            >
              {defaultCol.label.split(" -> ")[0]}
            </CTableHeadCell>
          ))}
        {computedFields?.rows?.map((rowCol) => (
          <CTableHeadCell
            rowSpan={computedFields.calc?.length ? 2 : 1}
            colSpan={colsSpanRowCol}
            style={{ backgroundColor: "#fafafa", padding: "4px", minWidth: "150px" }}
            noWrap
            key={rowCol.id}
          >
            {rowCol.label}
          </CTableHeadCell>
        ))}
        {computedFields.cols?.length
          ? columnsData?.map((group) => (
              <CTableHeadCell
                colSpan={computedCalcFields.length}
                style={{ backgroundColor: "#fafafa" }}
                noWrap
                key={group.guid}
              >
                {group?.branch_name}
              </CTableHeadCell>
            ))
          : computedFields.calc.map((calcCol) => (
              <CTableHeadCell
                style={{ backgroundColor: "#fafafa" }}
                key={calcCol.label}
                colSpan={calcCol.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                rowSpan={rowSpanCount * 2 - 1}
              >
                {calcCol.label}
              </CTableHeadCell>
            ))}
        {/* Right summary */}
        {includeSummary && computedFields.cols[0]?.slug && (
          <CTableHeadCell
            noWrap
            //   rowSpan={computedFields.calc?.length ? 2 : 1}
            colSpan={99}
            // rowSpan={88}
            style={{ backgroundColor: "#d9d9d9" }}
          >
            Итог
          </CTableHeadCell>
        )}
      </CTableRow>

      {computedFields.calc.length > 0 && (
        <>
          <CTableRow>
            {columnsData?.map((row) =>
              computedFields.calc.map((calc) => (
                <CTableHeadCell
                  colSpan={calc.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                  style={{ padding: "2px 4px", backgroundColor: "#fafafa", fontWeight: 500 }}
                  noWrap
                  key={row.guid + calc.label}
                >
                  {calc.label}
                </CTableHeadCell>
              ))
            )}
            {computedFields.calc.map((calc) => (
              <CTableHeadCell
                colSpan={calc.objects.reduce((acc, cur) => acc + cur.table_field_settings.length, 0)}
                style={{ padding: "2px 4px", fontWeight: "600", backgroundColor: "#d9d9d9" }}
                noWrap
                key={calc.label}
              >
                {calc.label}
              </CTableHeadCell>
            ))}
          </CTableRow>
          <CTableRow>
            {computedFields.rows.map((rowCol) =>
              rowCol.table_field_settings.map((rowColChild) => (
                <CTableHeadCell
                  colSpan={
                    colsSpanRowCol % rowCol.table_field_settings.length === 0
                      ? colsSpanRowCol / rowCol.table_field_settings.length
                      : 1
                  }
                  style={{ padding: "2px 4px", fontWeight: 500 }}
                  noWrap
                  key={rowCol.slug + rowColChild.field_slug}
                >
                  {rowColChild.field_type.includes("LOOKUP")
                    ? rowColChild.table_to.label
                    : rowColChild.label.split("->")[0]}
                </CTableHeadCell>
              ))
            )}
            {colsSpanRowCol % rowsColCount !== 0 && <CTableHeadCell colSpan={colsSpanRowCol - rowsColCount} />}
            {columnsData.length
              ? columnsData?.map(() =>
                  computedCalcFields.map((calcCol) => (
                    <CTableHeadCell noWrap key={calcCol.key} style={{ padding: "2px 4px", fontWeight: 500 }}>
                      {calcCol.label}
                    </CTableHeadCell>
                  ))
                )
              : computedCalcFields.map((calcCol) => (
                  <CTableHeadCell noWrap key={calcCol.key} style={{ padding: "2px 4px", fontWeight: 500 }}>
                    {calcCol.label}
                  </CTableHeadCell>
                ))}
            {computedCalcFields.map((calcCol) => (
              <CTableHeadCell
                noWrap
                key={calcCol.key}
                style={{ padding: "2px 4px", fontWeight: "600", backgroundColor: "#d9d9d9" }}
              >
                {calcCol.label}
              </CTableHeadCell>
            ))}
          </CTableRow>
        </>
      )}
    </>
  );
}
