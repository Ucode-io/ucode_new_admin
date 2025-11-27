import {Checkbox} from "@mui/material";
import {CTableCell, CTableRow} from "../CTable";
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator";
import TableDataForm from "../ElementGenerators/TableDataForm";
import CellCheckboxOrOrderNumBlock from "./CellCheckboxOrOrderNumBlock";

const TableRowForm = ({
  onCheckboxChange,
  isTableView,
  checkboxValue,
  watch = () => {},
  row,
  onDeleteClick = () => {},
  formVisible,
  remove,
  control,
  currentPage,
  rowIndex,
  relatedTableSlug,
  isRelationTable,
  columns,
  tableSettings,
  tableSlug,
  setFormValue,
  pageName,
  calculateWidth,
  limit = 10,
  relationFields,
  data,
}) => {
  return (
    <CTableRow>
      <CellCheckboxOrOrderNumBlock
        currentPage={currentPage}
        limit={limit}
        rowIndex={rowIndex}
        row={row}
      />
      {onCheckboxChange && !formVisible && (
        <CTableCell>
          <Checkbox
            checked={checkboxValue === row.guid}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </CTableCell>
      )}

      {!formVisible && (
        <CTableCell align="center">
          {(currentPage - 1) * limit + rowIndex + 1}
        </CTableCell>
      )}
      {columns.map(
        (column, index) =>
          column?.attributes?.field_permission?.view_permission && (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis editable_col`}
              style={{
                padding: 0,
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? calculateWidth(column?.id, index)
                  : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
                minWidth: "max-content",
              }}>
              {isTableView ? (
                <TableDataForm
                  tableSlug={tableSlug}
                  watch={watch}
                  fields={columns}
                  field={column}
                  row={row}
                  index={rowIndex}
                  control={control}
                  setFormValue={setFormValue}
                  relationfields={relationFields}
                  data={data}
                />
              ) : (
                <CellFormElementGenerator
                  tableSlug={tableSlug}
                  watch={watch}
                  fields={columns}
                  field={column}
                  row={row}
                  index={rowIndex}
                  control={control}
                  setFormValue={setFormValue}
                  relationfields={relationFields}
                  data={data}
                />
              )}
            </CTableCell>
          )
      )}
      {/* <CTableCell
        style={{
          padding: 0,
          position: tableSettings?.[pageName]?.find(
            (item) => item?.id === column?.id
          )?.isStiky
            ? "sticky"
            : "relative",
          left: tableSettings?.[pageName]?.find(
            (item) => item?.id === column?.id
          )?.isStiky
            ? calculateWidth(column?.id, index)
            : "0",
          backgroundColor: "#fff",
          zIndex: tableSettings?.[pageName]?.find(
            (item) => item?.id === column?.id
          )?.isStiky
            ? "1"
            : "",
          minWidth: "max-content",
        }}
      >
        <PermissionWrapperV2
          type="delete"
          tableSlug={isRelationTable ? relatedTableSlug : tableSlug}
        >
          <RectangleIconButton
            color="error"
            onClick={() => {
              onDeleteClick(row, rowIndex);
              remove(rowIndex);
              // navigate("/reloadRelations", {
              //   state: {
              //     redirectUrl: window.location.pathname,
              //   },
              // });
            }}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </PermissionWrapperV2>
      </CTableCell> */}
    </CTableRow>
  );
};

export default TableRowForm;
