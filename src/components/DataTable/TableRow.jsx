import {Delete} from "@mui/icons-material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {Button, Checkbox} from "@mui/material";
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "../CTable";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import TableDataForm from "../ElementGenerators/TableDataForm";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import GeneratePdfFromTable from "./GeneratePdfFromTable";
import TableRowForm from "./TableRowForm";

const TableRow = ({
  relOptions,
  tableView,
  row,
  key,
  width,
  rowIndex,
  control,
  isTableView,
  onRowClick,
  calculateWidthFixedColumn,
  onDeleteClick,
  mainForm,
  checkboxValue,
  getValues,
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

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item?.guid === row?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item?.guid !== row?.guid)
      );
    } else {
      setSelectedObjectsForDelete([...selectedObjectsForDelete, row]);
    }
  };

  const parentRef = useRef(null);

  if (formVisible)
    return (
      <TableRowForm
        onDeleteClick={onDeleteClick}
        isTableView={isTableView}
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
      {!relationAction ? (
        <>
          <CTableRow style={style} ref={parentRef}>
            <CTableCell
              align="center"
              className="data_table__number_cell"
              style={{
                padding: "0 4px",
                minWidth: width,
                position: "sticky",
                left: "0",
                backgroundColor: "#F6F6F6",
                zIndex: "1",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Button
                  onClick={() => {
                    onRowClick(row, rowIndex);
                  }}
                  className="first_button"
                  style={{
                    minWidth: "max-content",
                  }}>
                  <OpenInFullIcon />
                </Button>

                <span
                  className="data_table__row_number"
                  style={{width: "35px"}}>
                  {limit === "all"
                    ? rowIndex + 1
                    : (currentPage - 1) * limit + rowIndex + 1}
                  {/* {rowIndex + 1} */}
                </span>

                <PermissionWrapperV2 tableSlug={tableSlug} type={"delete_all"}>
                  <Checkbox
                    className="table_multi_checkbox"
                    style={{
                      display:
                        selectedObjectsForDelete?.find(
                          (item) => item?.guid === row?.guid
                        ) && "block",
                    }}
                    checked={selectedObjectsForDelete?.find(
                      (item) => item?.guid === row?.guid
                    )}
                    onChange={() => {
                      changeSetDelete(row);
                    }}
                  />
                </PermissionWrapperV2>
              </div>
            </CTableCell>

            {columns.map(
              (virtualColumn) =>
                virtualColumn?.attributes?.field_permission
                  ?.view_permission && (
                  <CTableCell
                    key={virtualColumn.id}
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
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? `${
                            calculateWidthFixedColumn(virtualColumn.id) + 80
                          }px`
                        : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "#F6F6F6"
                          : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === virtualColumn?.id
                        )?.isStiky ||
                        view?.attributes?.fixedColumns?.[virtualColumn?.id]
                          ? "1"
                          : "0"
                      }`,
                    }}>
                    {isTableView ? (
                      <TableDataForm
                        relOptions={relOptions}
                        tableView={tableView}
                        tableSlug={tableSlug}
                        fields={columns}
                        field={virtualColumn}
                        getValues={getValues}
                        mainForm={mainForm}
                        row={row}
                        index={rowIndex}
                        control={control}
                        setFormValue={setFormValue}
                        relationfields={relationFields}
                        data={data}
                        onRowClick={onRowClick}
                        width={width}
                        isTableView={isTableView}
                        view={view}
                      />
                    ) : (
                      <CellElementGenerator field={virtualColumn} row={row} />
                    )}
                  </CTableCell>
                )
            )}
            <td
              style={{
                minWidth: "85px",
                color: "#262626",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                padding: "0 5px",
                position: `${"sticky"}`,
                right: "0",
                backgroundColor: `${"#fff"}`,
                zIndex: `${"0"}`,
                borderLeft: "1px solid #eee",
              }}>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  padding: "3px",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CTableCell
                  style={{
                    padding: 0,
                    borderRight: "none",
                    borderBottom: "none",
                  }}>
                  <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                    <RectangleIconButton
                      color="error"
                      onClick={() =>
                        row.guid
                          ? onDeleteClick(row, rowIndex)
                          : remove(rowIndex)
                      }>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </PermissionWrapperV2>
                </CTableCell>
                <PermissionWrapperV2 tableSlug={tableSlug} type={"pdf_action"}>
                  <GeneratePdfFromTable view={view} row={row} />
                </PermissionWrapperV2>
              </div>
            </td>
          </CTableRow>
        </>
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" ||
        !relationAction?.action_relations ? (
        <CTableRow>
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
              position: "sticky",
              left: "0",
              backgroundColor: "#F6F6F6",
              zIndex: "1",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Button
                onClick={() => {
                  onRowClick(row, rowIndex);
                }}
                className="first_button"
                style={{
                  minWidth: "max-content",
                }}>
                <OpenInFullIcon />
              </Button>

              <span className="data_table__row_number" style={{width: "35px"}}>
                {limit === "all"
                  ? rowIndex + 1
                  : (currentPage - 1) * limit + rowIndex + 1}
                {/* {rowIndex + 1} */}
              </span>
            </div>
          </CTableCell>

          {columns.map(
            (virtualColumn) =>
              virtualColumn?.attributes?.field_permission?.view_permission && (
                <CTableCell
                  key={virtualColumn.guid}
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
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[virtualColumn?.id]
                      ? `${calculateWidthFixedColumn(virtualColumn.id) + 80}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === virtualColumn?.id
                      )?.isStiky ||
                      view?.attributes?.fixedColumns?.[virtualColumn?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}>
                  {isTableView ? (
                    <TableDataForm
                      relOptions={relOptions}
                      tableView={tableView}
                      tableSlug={tableSlug}
                      fields={columns}
                      field={virtualColumn}
                      getValues={getValues}
                      mainForm={mainForm}
                      row={row}
                      index={rowIndex}
                      control={control}
                      setFormValue={setFormValue}
                      relationfields={relationFields}
                      data={data}
                      onRowClick={onRowClick}
                      width={width}
                      isTableView={isTableView}
                      view={view}
                    />
                  ) : (
                    <CellElementGenerator field={virtualColumn} row={row} />
                  )}
                </CTableCell>
              )
          )}
          <td
            style={{
              height: "30px",
              minWidth: "85px",
              color: "#262626",
              fontSize: "13px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              padding: "0 5px",
              position: `${"sticky"}`,
              right: "0",
              backgroundColor: `${"#fff"}`,
              zIndex: `${"0"}`,
              borderLeft: "1px solid #eee",
            }}>
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "3px",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <CTableCell
                style={{
                  padding: 0,
                  borderRight: "none",
                  borderBottom: "none",
                }}>
                <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                  <RectangleIconButton
                    color="error"
                    onClick={() =>
                      row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                    }>
                    <Delete color="error" />
                  </RectangleIconButton>
                </PermissionWrapperV2>
              </CTableCell>
              {/* <PermissionWrapperV2 tableSlug={tableSlug} type={"pdf_action"}>
                <GeneratePdfFromTable row={row} />
              </PermissionWrapperV2> */}
            </div>
          </td>
        </CTableRow>
      ) : (
        <CTableRow
          onClick={() => {
            onChecked(row?.guid);
          }}>
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "0 4px",
              minWidth: width,
              position: "sticky",
              left: "0",
              backgroundColor: "#F6F6F6",
              zIndex: "1",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Button
                onClick={() => {
                  onRowClick(row, rowIndex);
                }}
                className="first_button"
                style={{
                  minWidth: "max-content",
                }}>
                <OpenInFullIcon />
              </Button>

              <span className="data_table__row_number" style={{width: "35px"}}>
                {limit === "all"
                  ? rowIndex + 1
                  : (currentPage - 1) * limit + rowIndex + 1}
                {/* {rowIndex + 1} */}
              </span>
            </div>
          </CTableCell>

          {columns.map((column, index) => (
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
                  ? `${calculateWidthFixedColumn(column.id) + 80}px`
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
              }}>
              <TableDataForm
                relOptions={relOptions}
                isTableView={isTableView}
                tableView={tableView}
                tableSlug={tableSlug}
                fields={columns}
                field={column}
                getValues={getValues}
                mainForm={mainForm}
                row={row}
                index={rowIndex}
                control={control}
                setFormValue={setFormValue}
                relationfields={relationFields}
                data={data}
                onRowClick={onRowClick}
                width={width}
                view={view}
              />
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
              }}>
              <Delete color="error" />
            </RectangleIconButton>
          </PermissionWrapperV2>
        </CTableRow>
      )}
    </>
  );
};

export default TableRow;
