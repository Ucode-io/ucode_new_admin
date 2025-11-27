import { useMemo } from "react";

import { CircularProgress } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { CTableCell, CTableHeadCell, CTableRow } from "../../../../components/CTable";
import { numberWithSpaces } from "../../../../utils/formatNumbers";
import DoubleClick from "../../../../components/DoubleClick";
import MultiselectCellColoredElement from "../../../../components/ElementGenerators/MultiselectCellColoredElement";
import useVerticalRowNavigate from "./verticalRowNavigate";
import styles from "./styles.module.scss";

export default function RecursiveVerticalRow(props) {
  const {
    row,
    index,
    setCurClActRow,
    tableSlugData,
    computedRelationRows,
    calculateParentValues,
    fields,
    fieldsRows,
    handleExpandRow,
    computedValues,
    colsSpanRowCol,
    showClActModal,
    getValueRecursively,
    computedCalcFields,
    expandedRows,
    childLoader,
    notJoinedRows,
    columnsData,
    level = 0,
    totalValues,
  } = props;

  const findExpandRow = (param) =>
    expandedRows.find(
      (i) => getValueRecursively(i, i.is_relaiton_row ? i.relation_order_number : i.order_number) === param
    );

  const { navigateToEditPage } = useVerticalRowNavigate(level, expandedRows, findExpandRow);

  const foundExpandedRow = useMemo(
    () => expandedRows.find((i) => getValueRecursively(i, i.order_number) === [...row.parent_ids, row.guid].join("#")),
    [expandedRows, level]
  );

  const isAfterRelationRow = fields.rows_relation?.[0]?.order_number < level;

  return (
    <>
      <CTableRow key={row.guid}>
        <CTableHeadCell
          rowSpan={row.slug_type === "RELATION" ? 2 : 1}
          style={{
            fontWeight: "600",
            backgroundColor: level ? "#E4FBFF" : "#fafafa",
            padding: "4px",
            fontSize: `${14 - level * 3}px`,
          }}
        >
          {index + 1}
        </CTableHeadCell>
        {fields.rows.length > 0 &&
          fields.defaults.map((defaultCol) => (
            <CTableCell
              key={defaultCol.field_slug}
              noWrap
              onClick={() => {
                setCurClActRow({ ...row, level, foundExpandedRow });
                showClActModal();
              }}
              rowSpan={row.slug_type === "RELATION" ? 2 : 1}
              style={{ backgroundColor: level ? "#e4fbff" : "#fafafa", padding: "4px" }}
            >
              {row[defaultCol.field_slug]}
            </CTableCell>
          ))}
        {(fieldsRows[level] ?? fieldsRows[level - 1])?.table_field_settings?.map((rowColField, rowColIdx) => (
          <CTableCell
            onClick={() => {
              setCurClActRow({ ...row, level, foundExpandedRow });
              showClActModal();
            }}
            key={row.guid + rowColField?.field_slug}
            noWrap
            style={{
              backgroundColor: level > 2 || !level ? "#f8f8f8" : "#e4fbff",
              padding: `4px 4px 4px ${(level || 4 / 15) * 18}px`,
              fontWeight: fieldsRows[level].isRelationHead ? 700 : "",
            }}
            colSpan={
              colsSpanRowCol % (fieldsRows[level] ?? fieldsRows[level - 1]).table_field_settings.length === 0
                ? colsSpanRowCol / (fieldsRows[level] ?? fieldsRows[level - 1]).table_field_settings.length
                : 1
            }
          >
            {row?.is_tree &&
            (fieldsRows[level] ?? fieldsRows[level - 1])?.order_number === level + (isAfterRelationRow ? 0 : 1) &&
            rowColIdx === 0 ? (
              <span
                className={styles.plus_action}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandRow(row, fieldsRows[level] ?? fieldsRows[level - 1], isAfterRelationRow);
                }}
              >
                {findExpandRow([...row.parent_ids, row.guid].join("#")) ? <RemoveIcon /> : <AddIcon />}
              </span>
            ) : (
              ""
            )}
            {rowColField.field_type === "MULTISELECT" ? (
              <MultiselectCellColoredElement field={rowColField} value={row[rowColField.field_slug]} />
            ) : (
              row[rowColField.field_slug]
            )}
          </CTableCell>
        ))}
        {fieldsRows[level][row.parent_value]?.map((fieldCol, fieldColIdx) => (
          <CTableCell
            noWrap
            key={fieldCol.field_slug}
            colSpan={
              (fieldsRows[level] ?? fieldsRows[level - 1])?.[
                level === fieldsRows.findIndex((f) => f.isRelationFields) ? row.parent_value : "table_field_settings"
              ]?.length !== 0
                ? colsSpanRowCol /
                  (fieldsRows[level] ?? fieldsRows[level - 1])?.[
                    level === fieldsRows.findIndex((f) => f.isRelationFields)
                      ? row.parent_value
                      : "table_field_settings"
                  ]?.length
                : 1
            }
            onClick={() => {
              setCurClActRow({ ...row, level, foundExpandedRow });
              showClActModal();
            }}
          >
            {row?.is_tree &&
            (fieldsRows[level] ?? fieldsRows[level - 1])?.order_number === level + 1 &&
            fieldColIdx === 0 ? (
              <span
                style={{ padding: `4px 4px 4px ${(level || 4 / 15) * 18}px` }}
                className={styles.plus_action}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandRow(row, fieldsRows[level] ?? fieldsRows[level - 1]);
                }}
              >
                {findExpandRow([...row.parent_ids, row.guid].join("#")) ? <RemoveIcon /> : <AddIcon />}
              </span>
            ) : (
              ""
            )}

            {fieldCol.field_type === "MULTISELECT" ? (
              <MultiselectCellColoredElement field={fieldCol} value={row[fieldCol.field_slug]} />
            ) : (
              row[fieldCol.field_slug]
            )}
          </CTableCell>
        ))}
        {colsSpanRowCol %
          (fieldsRows[level] ?? fieldsRows[level - 1])?.[
            level === fieldsRows.findIndex((f) => f.isRelationFields) ? row.parent_value : "table_field_settings"
          ]?.length !==
          0 && (
          <CTableCell
            style={{ backgroundColor: level > 2 || !level ? "#f8f8f8" : "#e4fbff" }}
            colSpan={
              colsSpanRowCol -
              (fieldsRows[level] ?? fieldsRows[level - 1])?.[
                level === fieldsRows.findIndex((f) => f.isRelationFields) ? row.parent_value : "table_field_settings"
              ]?.length
            }
          />
        )}

        {notJoinedRows.map((rowCol) => (
          <CTableCell
            noWrap
            key={rowCol.field_slug}
            onClick={() => {
              setCurClActRow({ ...row, level, foundExpandedRow });
              showClActModal();
            }}
          >
            {row[rowCol.field_slug]}
          </CTableCell>
        ))}
        {fields.cols.length
          ? columnsData?.map((group) =>
              computedCalcFields?.map((calcCol, _, arr) => (
                <DoubleClick
                  key={group.guid + "#" + calcCol.key}
                  onClick={() => {
                    setCurClActRow({ ...row, level, foundExpandedRow });
                    showClActModal();
                  }}
                  onDoubleClick={() => navigateToEditPage(row, calcCol, group)}
                >
                  <CTableCell
                    noWrap
                    style={{
                      backgroundColor: row[calcCol.table_slug]?.[group.guid]?.[calcCol.field_slug] ? "#f0f0f0" : "#fff",
                      padding: "4px",
                    }}
                  >
                    {!arr.reduce((acc, cur) => acc + (row[cur.table_slug]?.[group.guid]?.[cur.field_slug] ?? 0), 0)
                      ? ""
                      : numberWithSpaces(row[calcCol.table_slug]?.[group.guid]?.[calcCol.field_slug])}
                  </CTableCell>
                </DoubleClick>
              ))
            )
          : computedCalcFields.map((calcCol, _, arr) => (
              <DoubleClick
                key={calcCol.key}
                onClick={() => {
                  setCurClActRow({ ...row, level, foundExpandedRow });
                  showClActModal();
                }}
                onDoubleClick={() => navigateToEditPage(row, calcCol)}
              >
                <CTableCell
                  style={{
                    backgroundColor: row[calcCol.table_slug]?.[calcCol.field_slug] ? "#f0f0f0" : "#fff",
                  }}
                  noWrap
                  rowSpan={row.slug_type === "RELATION" ? 2 : 1}
                >
                  {!arr.reduce((acc, cur) => acc + (row[cur.table_slug]?.[cur.field_slug] ?? 0), 0)
                    ? ""
                    : numberWithSpaces(row[calcCol.table_slug]?.[calcCol.field_slug])}
                </CTableCell>
              </DoubleClick>
            ))}
        {fields.cols.length
          ? computedCalcFields?.map((_, index) => (
              <CTableCell
                noWrap
                style={{
                  backgroundColor: "#d9d9d9",
                  padding: "4px",
                }}
              >
                {numberWithSpaces(
                  computedCalcFields?.map((group) =>
                    columnsData?.reduce(
                      (acc, curr) => acc + (row?.[group?.table_slug]?.[curr?.guid]?.[group?.field_slug] ?? 0),
                      0
                    )
                  )[index]
                )}
              </CTableCell>
            ))
          : computedCalcFields.map((calcCol, _, arr) => (
              <DoubleClick
                key={calcCol.key}
                onClick={() => {
                  setCurClActRow({ ...row, level, foundExpandedRow });
                  showClActModal();
                }}
                onDoubleClick={() => navigateToEditPage(row, calcCol)}
              >
                <CTableCell
                  style={{
                    backgroundColor: "#d9d9d9",
                    padding: "4px",
                  }}
                  noWrap
                  rowSpan={row.slug_type === "RELATION" ? 2 : 1}
                >
                  {!arr?.reduce((acc, curr) => acc + (row?.[curr.table_slug]?.[curr?.field_slug] ?? 0), 0)
                    ? ""
                    : numberWithSpaces(row?.[calcCol?.table_slug]?.[calcCol?.field_slug])}
                </CTableCell>
              </DoubleClick>
            ))}
      </CTableRow>
      {row.slug_type === "RELATION" && (
        <CTableRow style={{ backgroundColor: "#f8f8f8" }}>
          {computedRelationRows
            .find((r) => r.slug === row.guid)
            ?.table_field_settings?.map((fieldCol) => (
              <CTableHeadCell
                key={fieldCol.field_slug}
                style={{ padding: "0 4px", fontWeight: "500" }}
                noWrap
                colSpan={
                  (fieldsRows[level] ?? fieldsRows[level - 1])?.[
                    level === fieldsRows.findIndex((f) => f.isRelationHead) ? row.parent_value : "table_field_settings"
                  ]?.length !== 0
                    ? colsSpanRowCol /
                      (fieldsRows[level] ?? fieldsRows[level - 1])?.[
                        level === fieldsRows.findIndex((f) => f.isRelationHead)
                          ? row.parent_value
                          : "table_field_settings"
                      ]?.length
                    : 1
                }
              >
                {fieldCol.field_type?.includes("LOOKUP") ? fieldCol.table_to.label : fieldCol.label?.split(" -> ")[0]}
              </CTableHeadCell>
            ))}
          {fieldsRows[level].isRelationHead &&
            computedCalcFields.map((calcCol) => <CTableCell key={calcCol.key} style={{ backgroundColor: "#fff" }} />)}
          {fieldsRows[level].isRelationFields &&
            colsSpanRowCol %
              computedRelationRows.find((r) => r.slug === row.parent_value)?.table_field_settings?.length !==
              0 && <CTableCell colSpan={1} />}
          {/* placeholder columns for summary */}
          {fieldsRows[level].isRelationHead &&
            computedCalcFields.map((calcCol) => (
              <CTableCell key={calcCol.key} style={{ backgroundColor: "#d9d9d9" }} />
            ))}
        </CTableRow>
      )}
      {childLoader &&
        getValueRecursively(
          expandedRows.at(-1),
          expandedRows.at(-1).is_relaiton_row
            ? expandedRows.at(-1).relation_order_number
            : expandedRows.at(-1).order_number
        ) === [...row.parent_ids, row.guid].join("#") && (
          <CTableRow>
            <CTableCell style={{ textAlign: "center", padding: 0 }}>
              <CircularProgress size={18} />
            </CTableCell>
            <CTableCell colSpan={2} style={{ padding: "8px 4px" }}>
              Загрузка данных...
            </CTableCell>
          </CTableRow>
        )}
      {row?.children?.map((childRow, childIdx) => (
        <RecursiveVerticalRow
          key={childRow.guid}
          calculateParentValues={calculateParentValues}
          showClActModal={showClActModal}
          setCurClActRow={setCurClActRow}
          fieldsRows={fieldsRows}
          colsSpanRowCol={colsSpanRowCol}
          level={level + 1}
          tableSlug={tableSlugData}
          computedCalcFields={computedCalcFields}
          computedRelationRows={computedRelationRows}
          row={childRow}
          index={childIdx}
          notJoinedRows={notJoinedRows}
          computedValues={computedValues}
          getValueRecursively={getValueRecursively}
          childLoader={childLoader}
          fields={fields}
          handleExpandRow={handleExpandRow}
          expandedRows={expandedRows}
          columnsData={columnsData}
          totalValues={totalValues}
        />
      ))}
    </>
  );
}
