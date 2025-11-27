import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { CTableCell, CTableHeadCell, CTableRow } from "../../../../components/CTable";
import { numberWithSpaces } from "../../../../utils/formatNumbers";
import useTabRouter from "../../../../hooks/useTabRouter";
import styles from "./styles.module.scss";

export default function RecursiveHorizontalRow(props) {
  const {
    row,
    showClActModal,
    index,
    computedCalcFields,
    fields,
    handleExpandRow,
    getValueRecursively,
    expandedRows,
    childLoader,
    setCurClActRow,
    columnsData,
    level = 0
  } = props;

  const { tableSlug } = useParams();
  const { navigateToForm } = useTabRouter();

  const navigateToEditPage = (guid) => {
    if (guid) {
      navigateToForm(tableSlug, "EDIT", { guid }, { currentViewTab: 1 });
    }
  };

  const includeSummary = useMemo(() => {
    return (
      fields.cols[0]?.slug &&
      fields?.calc?.some((i) => i.type === "NUMBER" || i.type === "FORMULA_FRONTEND" || i.type === "MONEY")
    );
  }, [fields]);

  const colSpan = fields.rows?.length + (row?.values ? fields.calc?.length : columnsData?.length);

  return (
    <>
      <CTableRow key={row.guid}>
        {/* Left summary */}
        {includeSummary &&
          fields?.calc?.map((calc) => (
            <CTableCell key={calc.field_slug} style={{ backgroundColor: "#d9d9d9", fontWeight: 600 }} noWrap>
              {numberWithSpaces(
                row[`${fields.cols[0]?.table_slug}s`]?.reduce((acc, cur) => acc + (cur[calc.slug] ?? 0), 0)
              )}
            </CTableCell>
          ))}
        <CTableHeadCell
          style={{
            fontWeight: "600",
            backgroundColor: level ? "#E4FBFF" : "#fafafa",
            padding: "4px",
            fontSize: `${14 - level * 3}px`
          }}
        >
          {index + 1}
        </CTableHeadCell>
        {fields.rows.length > 0 &&
          fields.defaults.map((defaultCol) => (
            <CTableHeadCell
              style={{ backgroundColor: level ? "#e4fbff" : "#fafafa", padding: "4px" }}
              noWrap
              key={defaultCol.field_slug}
            >
              {row[defaultCol.field_slug]}
            </CTableHeadCell>
          ))}
        {fields?.rows.map((rowCol) =>
          rowCol.table_field_settings?.map((rowColField, rowColIdx) => (
            <CTableCell
              style={{ backgroundColor: level ? "#E4FBFF" : "#fafafa", padding: "4px" }}
              noWrap
              key={rowCol.id + rowColField.field_slug}
            >
              {row?.is_tree && rowCol?.order_number === level + 1 && rowColIdx === 0 && (
                <span className={styles.plus_action} onClick={() => handleExpandRow(row, rowCol)}>
                  {expandedRows.some(
                    (i) =>
                      getValueRecursively(i, i.is_relaiton_row ? i.relation_order_number : i.order_number) ===
                      [...row.parent_ids, row.guid].join("#")
                  ) ? (
                    <RemoveIcon />
                  ) : (
                    <AddIcon />
                  )}
                </span>
              )}
              {row.table_slug === `${rowCol.slug}_id` && row[rowColField.field_slug]}
            </CTableCell>
          ))
        )}
        {fields.cols[0]?.table_field_settings[0]?.field_slug
          ? columnsData?.map((group) =>
              computedCalcFields.map((calcCol) => (
                <CTableCell
                  noWrap
                  key={group.guid + "#" + calcCol.key}
                  onClick={() =>
                    // !row?.is_tree &&
                    navigateToEditPage(
                      row[`${fields.cols[0]?.table_slug}s`]?.find((i) => i[fields.cols[0]?.slug] === group.guid)?.guid
                    )
                  }
                  onDoubleClick={() => {
                    setCurClActRow(row);
                    showClActModal();
                  }}
                  style={{
                    backgroundColor: row[calcCol.table_slug]?.[group.guid]?.[calcCol.field_slug] ? "#f0f0f0" : "",
                    padding: "4px"
                  }}
                >
                  {numberWithSpaces(row[calcCol.table_slug]?.[group.guid]?.[calcCol.field_slug]) || ""}
                </CTableCell>
              ))
            )
          : computedCalcFields.map((calcCol) => (
              <CTableCell
                noWrap
                key={calcCol.key}
                onDoubleClick={() => {
                  setCurClActRow(row);
                  showClActModal();
                }}
                style={{
                  backgroundColor: row[calcCol.field_slug] ? "#f0f0f0" : ""
                }}
                onClick={() => !row?.is_tree && navigateToEditPage(row.guid)}
              >
                {numberWithSpaces(row[calcCol.field_slug]) || ""}
              </CTableCell>
            ))}
      </CTableRow>
      {childLoader &&
        getValueRecursively(
          expandedRows.at(-1),
          expandedRows.at(-1).is_relaiton_row
            ? expandedRows.at(-1).relation_order_number
            : expandedRows.at(-1).order_number
        ) === [...row.parent_ids, row.guid].join("#") && (
          <CTableRow>
            <CTableCell colSpan={`${fields.calc.length}`} />
            <CTableCell style={{ textAlign: "center", padding: 0 }}>
              <CircularProgress size={18} />
            </CTableCell>
            <CTableCell style={{ padding: "8px 4px" }} colSpan={`${colSpan}`}>
              Загрузка данных...
            </CTableCell>
          </CTableRow>
        )}
      {row?.children?.map((childRow, childIdx) => (
        <RecursiveHorizontalRow
          key={childRow.guid}
          setCurClActRow={setCurClActRow}
          level={level + 1}
          row={childRow}
          index={childIdx}
          showClActModal={showClActModal}
          computedCalcFields={computedCalcFields}
          getValueRecursively={getValueRecursively}
          childLoader={childLoader}
          fields={fields}
          handleExpandRow={handleExpandRow}
          expandedRows={expandedRows}
          columnsData={columnsData}
        />
      ))}
    </>
  );
}
