import React, { useMemo } from "react";
import { withErrorBoundary } from "react-error-boundary";

import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import RecursiveHorizontalRow from "./RecursiveHorizontalRow";
import { numberWithSpaces } from "../../../../utils/formatNumbers";
import RecursiveVerticalRow from "./RecursiveVerticalRow";
import HorizontalHead from "./HorizontalHead";
import VerticalHead from "./VerticalHead";
import ErrorPage from "./ErrorPage";

function PivotTable(props) {
  const {
    setCurClActRow,
    expandedRows,
    clickActionTabs,
    handleExpandRow,
    calculateParentValues,
    showClActModal,
    computedData,
    getValueRecursively,
    isRefetching,
    isLoading,
    childLoader,
    columnsData,
    computedFields,
    isTemplateChanged,
    columnValueData,
    tableSlugData,
    totalValues,
  } = props;

  const computedRelationRows = useMemo(
    () =>
      computedFields.rows_relation?.reduce(
        (acc, cur) => [
          ...acc,
          ...cur.objects.map((i, idx) => ({
            ...i,
            isRelation: true,
            order_number: computedFields.rows_relation[idx]?.order_number,
          })),
        ],
        []
      ),
    [computedFields]
  );

  const computedCalcFields = useMemo(
    () =>
      computedFields.calc.reduce(
        (acc, cur) => [
          ...acc,
          ...cur.objects
            .reduce(
              (acc, cur) => [
                ...acc,
                ...cur.table_field_settings.map((i) => ({
                  ...i,
                  key: cur.id + "#" + i.field_slug,
                })),
              ],
              []
            )
            .sort((a, b) => (a.order_number > b.order_number ? 1 : -1)),
        ],
        []
      ),
    [computedFields]
  );

  const includeSummary = useMemo(() => {
    return computedCalcFields?.some(
      (i) =>
        i.field_type === "NUMBER" ||
        i.field_type === "FORMULA_FRONTEND" ||
        i.field_type === "MONEY"
    );
  }, [computedCalcFields]);

  const isJoinTable = useMemo(() => {
    return computedFields.rows.filter((field) => field.join).length > 1;
  }, [computedFields]);

  const hasRelationRow = computedFields.rows_relation.length > 0;

  const notJoinedRows = useMemo(
    () =>
      computedFields.rows
        .filter((i) => !i.join)
        .reduce((acc, cur) => [...acc, ...cur.table_field_settings], []),
    [computedFields]
  );

  const colsSpanRowCol = Math.max(
    ...computedFields.rows.map((i) => i.table_field_settings.length),
    ...computedRelationRows.map((i) => i.table_field_settings.length)
  );

  const computedRelationRowsFields = useMemo(() => {
    const data = {};
    if (computedRelationRows.length) {
      data.order_number = computedRelationRows[0]?.order_number + 1;
      data.id = computedRelationRows.at(-1).id;
      data.isRelation = true;
      data.isRelationFields = true;
      computedRelationRows.forEach((row) => {
        data[row.slug] = row.table_field_settings;
      });
    }
    return data;
  }, [computedRelationRows]);

  const computedRows = useMemo(
    () =>
      [
        computedRelationRowsFields,
        ...computedFields.rows.filter((field) => field.join),
        {
          label: "Something",
          order_number: computedRelationRows[0]?.order_number,
          isRelation: true,
          slug: "coming_table",
          isRelationHead: true,
          id: "6dda7c51-73d4-477a-9c3e-8c01fdd5417d",
          table_field_settings: [
            {
              field_slug: "title",
              field_type: "SINGLE_LINE",
              order_number:
                computedFields.rows.filter((field) => field.join).length + 1,
            },
          ],
        },
      ]
        .filter((i) => i.order_number)
        .sort((a, b) => a.order_number - b.order_number),
    [computedFields, computedRelationRowsFields]
  );

  return (
    <CTable
      dataLength={computedData.length}
      removableHeight={0}
      count={10}
      disablePagination
      tableStyle={{
        height: `calc(100vh - 43px)`,
        borderRadius: "0",
        borderLeft: "none",
      }}
    >
      <CTableHead>
        {isJoinTable ? (
          <VerticalHead
            computedRelationRows={computedRelationRows}
            notJoinedRows={notJoinedRows}
            colsSpanRowCol={colsSpanRowCol}
            includeSummary={includeSummary}
            computedFields={computedFields}
            columnsData={columnsData}
            computedCalcFields={computedCalcFields}
            totalValues={totalValues}
          />
        ) : (
          <HorizontalHead
            colsSpanRowCol={colsSpanRowCol}
            computedCalcFields={computedCalcFields}
            includeSummary={includeSummary}
            computedFields={computedFields}
            columnsData={columnsData}
          />
        )}
      </CTableHead>
      <CTableBody
        columnsCount={
          computedCalcFields.length * (columnsData.length || 1) +
          (computedFields.rows.reduce(
            (acc, cur) => [...acc, ...cur.table_field_settings],
            []
          ).length
            ? computedFields.rows.reduce(
                (acc, cur) => [...acc, ...cur.table_field_settings],
                []
              ).length + 3
            : 0)
        }
        loader={
          computedData.length ? isTemplateChanged : isRefetching || isLoading
        }
        dataLength={computedData.length || columnsData.length}
      >
        {computedData.length > 0 ? (
          computedData?.map((row, index) =>
            isJoinTable || hasRelationRow ? (
              <RecursiveVerticalRow
                setCurClActRow={setCurClActRow}
                tableSlugData={tableSlugData}
                key={row.guid}
                row={row}
                index={index}
                notJoinedRows={notJoinedRows}
                calculateParentValues={calculateParentValues}
                computedCalcFields={computedCalcFields}
                colsSpanRowCol={colsSpanRowCol}
                fieldsRows={computedRows}
                childLoader={childLoader}
                fields={computedFields}
                getValueRecursively={getValueRecursively}
                handleExpandRow={handleExpandRow}
                expandedRows={expandedRows}
                columnsData={columnsData}
                showClActModal={showClActModal}
                computedRelationRows={computedRelationRows}
                totalValues={totalValues}
              />
            ) : (
              <RecursiveHorizontalRow
                setCurClActRow={setCurClActRow}
                showClActModal={showClActModal}
                key={row.guid}
                row={row}
                index={index}
                computedCalcFields={computedCalcFields}
                childLoader={childLoader}
                fields={computedFields}
                getValueRecursively={getValueRecursively}
                handleExpandRow={handleExpandRow}
                expandedRows={expandedRows}
                columnsData={columnsData}
              />
            )
          )
        ) : (
          <CTableRow>
            <CTableCell
              style={{
                padding: "4px",
                backgroundColor: "#fafafa",
                fontWeight: 600,
              }}
            >
              1
            </CTableCell>
            {columnsData?.map((row) =>
              computedCalcFields.map((calcCol) => (
                <CTableCell
                  key={row.guid + "#" + calcCol.key}
                  onClick={showClActModal}
                  style={{ padding: "4px", fontWeight: 400 }}
                >
                  {row[calcCol.table_slug]?.[calcCol.field_slug]}
                </CTableCell>
              ))
            )}
            {!columnsData.length &&
              Object.keys(columnValueData ?? {}).length > 0 &&
              computedCalcFields.map((calcCol) => (
                <CTableCell
                  key={calcCol.key}
                  style={{ padding: "4px", fontWeight: 400 }}
                >
                  {
                    columnValueData[calcCol.table_slug]?.[0]?.[
                      calcCol.field_slug
                    ]
                  }
                </CTableCell>
              ))}
          </CTableRow>
        )}
        {/* Bottom summary */}
        {includeSummary && (
          <CTableRow
            style={{
              backgroundColor: "#d9d9d9",
              fontWeight: 600,
              position: "sticky",
              bottom: 0,
            }}
          >
            <CTableCell
              style={{ fontWeight: 600, padding: "4px" }}
              colSpan={colsSpanRowCol + computedFields.defaults?.length + 1}
            >
              Итог
            </CTableCell>
            {computedFields.cols[0]?.slug
              ? columnsData?.map((group) =>
                  computedCalcFields.map((calcCol) => (
                    <CTableCell key={group.guid + "#" + calcCol.key} noWrap>
                      {numberWithSpaces(
                        computedData.reduce(
                          (acc, cur) =>
                            acc +
                            (cur?.[calcCol.table_slug]?.[group.guid]?.[
                              calcCol.field_slug
                            ] ?? 0),
                          0
                        )
                      )}
                    </CTableCell>
                  ))
                )
              : computedCalcFields.map((calcCol) => (
                  <CTableCell key={calcCol.key} noWrap>
                    {numberWithSpaces(
                      computedData.reduce(
                        (acc, cur) =>
                          acc +
                          (cur?.[calcCol.table_slug]?.[calcCol.field_slug] ??
                            0),
                        0
                      )
                    )}
                  </CTableCell>
                ))}
            {/* {computedCalcFields.map((calcCol) => (
              <CTableCell key={calcCol.field_slug} noWrap>
                {computedData?.reduce((acc, cur) => acc + (cur[calcCol.table_slug] ?? 0), 0)}
              </CTableCell>
            ))} */}
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  );
}

export default withErrorBoundary(PivotTable, {
  fallbackRender: () => <ErrorPage />,
});
