import { Delete } from "@mui/icons-material";
import { Button, Checkbox } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import { CTableCell, CTableRow } from "../CTable";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import GeneratePdfFromTable from "./GeneratePdfFromTable";
import TableRowForm from "./TableRowForm";
import GroupTableDataForm from "../ElementGenerators/GroupTableDataForm";

const GroupTableRow = ({
  row,
  key,
  width,
  rowIndex,
  control,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  view,
  columns,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
  data,
  style,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid)
      );
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };

  if (formVisible)
    return (
      <TableRowForm
        onDeleteClick={onDeleteClick}
        remove={remove}
        watch={watch}
        onCheckboxChange={onCheckboxChange}
        checkboxValue={checkboxValue}
        row={row}
        key={key}
        formVisible={formVisible}
        currentPage={currentPage}
        limit={limit}
        control={control}
        setFormValue={setFormValue}
        rowIndex={rowIndex}
        columns={columns}
        tableHeight={tableHeight}
        tableSettings={tableSettings}
        pageName={pageName}
        calculateWidth={calculateWidth}
        tableSlug={tableSlug}
        relationFields={relationFields}
        data={data}
      />
    );

  return (
    <>
      {relationAction === undefined ? (
        <CTableRow
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={style}
        >
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {hovered ? (
                <Button
                  onClick={() => {
                    onRowClick(row, rowIndex);
                  }}
                  style={{
                    minWidth: "max-content",
                  }}
                >
                  <OpenInFullIcon />
                </Button>
              ) : (
                <span
                  className="data_table__row_number"
                  style={{ display: "block", width: "35px" }}
                >
                  {(currentPage - 1) * limit + rowIndex + 1}
                  {/* {rowIndex + 1} */}
                </span>
              )}

              {hovered ||
              selectedObjectsForDelete.find(
                (item) => item?.guid === row?.guid
              ) ? (
                <Checkbox
                  checked={selectedObjectsForDelete?.find(
                    (item) => item?.guid === row?.guid
                  )}
                  onChange={() => {
                    changeSetDelete(row);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </CTableCell>

          {columns?.map(
            (column, index) =>
              column?.attributes?.field_permission?.view_permission && (
                <CTableCell
                  key={column.id}
                  className={`overflow-ellipsis ${tableHeight}`}
                  style={{
                    minWidth: "220px",
                    color: "#262626",
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                    padding: "0 5px",
                    position: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[column?.id]
                      ? `${calculateWidthFixedColumn(column.id)}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === column?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}
                >
                  <GroupTableDataForm
                    tableSlug={tableSlug}
                    watch={watch}
                    fields={columns}
                    field={column}
                    mainForm={mainForm}
                    row={row}
                    index={rowIndex}
                    control={control}
                    setFormValue={setFormValue}
                    relationfields={relationFields}
                    data={data}
                    onRowClick={onRowClick}
                  />
                </CTableCell>
              )
          )}
          <td>
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "3px",
                justifyContent: "center",
              }}
            >
              <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                <RectangleIconButton
                  color="error"
                  onClick={() =>
                    row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                  }
                >
                  <Delete color="error" />
                </RectangleIconButton>
              </PermissionWrapperV2>

              <GeneratePdfFromTable row={row} />
            </div>
          </td>

          <td>
            <div style={{ display: "flex", gap: "5px", padding: "3px" }}></div>
          </td>
        </CTableRow>
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" ||
        !relationAction?.action_relations ? (
        <CTableRow
          onClick={() => {
            onRowClick(row, rowIndex);
          }}
        >
          <CTableCell align="center" className="data_table__number_cell">
            <span className="data_table__row_number">
              {(currentPage - 1) * limit + rowIndex + 1}
            </span>
            {onCheckboxChange && (
              <div
                className={`data_table__row_checkbox ${
                  isChecked(row) ? "checked" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked(row)}
                  onChange={(_, val) => onCheckboxChange(val, row)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </CTableCell>

          {columns?.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? `${calculateWidth(column?.id, index)}px`
                  : "0",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
            <RectangleIconButton
              color="error"
              onClick={() => {
                onDeleteClick(row, rowIndex);
              }}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </PermissionWrapperV2>
        </CTableRow>
      ) : (
        <CTableRow
          onClick={() => {
            onChecked(row?.guid);
          }}
        >
          <CTableCell align="center" className="data_table__number_cell">
            <span className="data_table__row_number">
              {(currentPage - 1) * limit + rowIndex + 1}
            </span>
            {onCheckboxChange && (
              <div
                className={`data_table__row_checkbox ${
                  isChecked(row) ? "checked" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked(row)}
                  onChange={(_, val) => onCheckboxChange(val, row)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={column.id}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? `${calculateWidth(column?.id, index)}px`
                  : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
            <RectangleIconButton
              color="error"
              onClick={() => {
                onDeleteClick(row, rowIndex);
                remove(rowIndex);
                navigate("/reloadRelations", {
                  state: {
                    redirectUrl: window.location.pathname,
                  },
                });
              }}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </PermissionWrapperV2>
        </CTableRow>
      )}
    </>
  );
};

export default GroupTableRow;
