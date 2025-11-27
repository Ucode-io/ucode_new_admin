import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {Button} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import useOnClickOutside from "use-onclickoutside";
import {tableSizeAction} from "../../store/tableSize/tableSizeSlice";
import FilterGenerator from "../../views/Objects/components/FilterGenerator";
import {CTable, CTableBody, CTableCell, CTableHead, CTableRow} from "../CTable";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import CellCheckboxNoSign from "./CellCheckboxNoSign";
import FieldButton from "./FieldButton";
import MultipleUpdateRow from "./MultipleUpdateRow";
import SummaryRow from "./SummaryRow";
import TableHeadForTableView from "./TableHeadForTableView";
import "./style.scss";
import AddDataColumn from "./AddDataColumn";
import {Container, Draggable} from "react-smooth-dnd";
import DragTableRow from "./DragTableRow";
import {applyDrag} from "../../utils/applyDrag";
import draggableRowService from "../../services/draggableRowService";

const DragObjectDataTable = ({
  selectedTab,
  relOptions,
  filterVisible,
  tableView,
  data = [],
  loader = false,
  setDrawerState,
  currentView,
  setDrawerStateField,
  removableHeight,
  getValues,
  additionalRow,
  mainForm,
  selectedView,
  isTableView = false,
  remove,
  multipleDelete,
  openFieldSettings,
  sortedDatas,
  fields = [],
  isRelationTable,
  disablePagination,
  currentPage = 1,
  onPaginationChange = () => {},
  pagesCount = 1,
  setSortedDatas,
  columns = [],
  relatedTableSlug,
  watch,
  control,
  setFormValue,
  navigateToEditPage,
  dataLength,
  onDeleteClick,
  onRowClick = () => {},
  filterChangeHandler = () => {},
  filters,
  disableFilters,
  tableStyle,
  wrapperStyle,
  tableSlug,
  isResizeble,
  paginationExtraButton,
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  onCheckboxChange,
  limit,
  setLimit,
  isChecked,
  formVisible,
  summaries,
  relationAction,
  onChecked,
  defaultLimit,
  title,
  view,
  refetch,
  menuItem,
  getAllData = () => {},
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [addNewRow, setAddNewRow] = useState(false);

  const parentRef = useRef(null);
  const popupRef = useRef(null);

  useOnClickOutside(popupRef, () => setColumnId(""));
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];
  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll("th");
      [].forEach.call(cols, function (col, idx) {
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");

        resizer.style.height = `${table.offsetHeight}px`;

        col.appendChild(resizer);

        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth}));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
        col.style.width = `${colWidth}px`;
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [data, isResizeble, pageName, dispatch]);

  const handleAutoSize = (colID, colIdx) => {
    dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth: "auto"}));
    const element = document.getElementById(colID);
    element.style.width = "auto";
    element.style.minWidth = "auto";
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: element.offsetWidth,
        isStiky: "ineffective",
        colIdx,
      })
    );
    setColumnId("");
  };

  const handlePin = (colID, colIdx) => {
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: currentColumnWidth,
        isStiky: true,
        colIdx,
      })
    );
    setColumnId("");
  };

  const calculateWidth = (colId, index) => {
    const colIdx = tableSettings?.[pageName]
      ?.filter((item) => item?.isStiky === true)
      ?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (
      tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)
        .length === 1
    ) {
      return 0;
    } else {
      return tableSettings?.[pageName]
        ?.filter((item) => item?.isStiky === true)
        ?.slice(0, colIdx)
        ?.reduce((acc, item) => acc + item?.colWidth, 0);
    }
  };

  const calculateWidthFixedColumn = (colId) => {
    const prevElementIndex = columns?.findIndex((item) => item.id === colId);

    if (prevElementIndex === -1 || prevElementIndex === 0) {
      return 0;
    }

    let totalWidth = 0;

    for (let i = 0; i < prevElementIndex; i++) {
      const element = document.querySelector(`[id='${columns?.[i].id}']`);
      totalWidth += element?.offsetWidth || 0;
    }

    return totalWidth;
  };

  const updateRowIndex = (objectData) => {
    const data = {
      objects: [...objectData],
    };
    draggableRowService
      .update(tableSlug, {
        data,
      })
      .then((res) => {
        console.log("resssssssssssss", res);
      });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(data, dropResult);

    if (result) {
      updateRowIndex(result);
    }
  };

  const getContainerOptions = () => ({
    orientation: "vertical",
    getContainer: () => document.createElement("tbody"),
  });

  return (
    <CTable
      disablePagination={disablePagination}
      removableHeight={removableHeight}
      count={pagesCount}
      page={currentPage}
      isTableView={isTableView}
      setCurrentPage={onPaginationChange}
      loader={loader}
      multipleDelete={multipleDelete}
      selectedObjectsForDelete={selectedObjectsForDelete}
      tableStyle={tableStyle}
      wrapperStyle={wrapperStyle}
      paginationExtraButton={paginationExtraButton}
      limit={limit}
      setLimit={setLimit}
      isRelationTable={isRelationTable}
      selectedTab={selectedTab}
      defaultLimit={defaultLimit}
      view={view}
      filterVisible={filterVisible}
      navigateToEditPage={navigateToEditPage}
      parentRef={parentRef}>
      <CTableHead>
        {formVisible && selectedRow.length > 0 && (
          <MultipleUpdateRow
            columns={data}
            fields={columns}
            watch={watch}
            setFormValue={setFormValue}
            control={control}
          />
        )}
        <CTableRow>
          <CellCheckboxNoSign formVisible={formVisible} data={data} />
          {columns.map(
            (column, index) =>
              column?.attributes?.field_permission?.view_permission && (
                <TableHeadForTableView
                  currentView={currentView}
                  relationAction={relationAction}
                  column={column}
                  isRelationTable={isRelationTable}
                  index={index}
                  pageName={pageName}
                  sortedDatas={sortedDatas}
                  setSortedDatas={setSortedDatas}
                  setDrawerState={setDrawerState}
                  setDrawerStateField={setDrawerStateField}
                  tableSize={tableSize}
                  tableSettings={tableSettings}
                  view={view}
                  selectedView={selectedView}
                  calculateWidthFixedColumn={calculateWidthFixedColumn}
                  handlePin={handlePin}
                  handleAutoSize={handleAutoSize}
                  popupRef={popupRef}
                  columnId={columnId}
                  setColumnId={setColumnId}
                  setCurrentColumnWidth={setCurrentColumnWidth}
                  isTableView={isTableView}
                  FilterGenerator={FilterGenerator}
                  filterChangeHandler={filterChangeHandler}
                  filters={filters}
                  tableSlug={tableSlug}
                  disableFilters={disableFilters}
                  setFieldCreateAnchor={setFieldCreateAnchor}
                  setFieldData={setFieldData}
                  refetch={refetch}
                  getAllData={getAllData}
                />
              )
          )}

          {!isRelationTable && (
            <PermissionWrapperV2
              tableSlug={isRelationTable ? relatedTableSlug : tableSlug}
              type={"add_field"}>
              <FieldButton
                openFieldSettings={openFieldSettings}
                view={view}
                mainForm={mainForm}
                fields={fields}
                setFieldCreateAnchor={setFieldCreateAnchor}
                fieldCreateAnchor={fieldCreateAnchor}
                fieldData={fieldData}
                setFieldData={setFieldData}
                setDrawerState={setDrawerState}
                setDrawerStateField={setDrawerStateField}
                menuItem={menuItem}
              />
            </PermissionWrapperV2>
          )}
        </CTableRow>
      </CTableHead>

      <Container
        lockAxis="y"
        onDrop={onDrop}
        orientation="vertical"
        getOptions={getContainerOptions}
        render={(ref) => (
          <CTableBody
            columnsCount={columns.length}
            dataLength={dataLength || data?.length}
            title={title}
            ref={ref}>
            {(isRelationTable ? fields : data).map(
              (virtualRowObject, index) => {
                return (
                  columns && (
                    <Draggable
                      key={virtualRowObject?.id}
                      render={() => (
                        <CTableRow
                          ref={parentRef}
                          style={{
                            cursor: "grab",
                          }}>
                          <DragTableRow
                            key={virtualRowObject?.id}
                            relOptions={relOptions}
                            tableView={tableView}
                            width={"80px"}
                            remove={remove}
                            watch={watch}
                            getValues={getValues}
                            control={control}
                            row={virtualRowObject}
                            mainForm={mainForm}
                            formVisible={formVisible}
                            rowIndex={index}
                            isTableView={isTableView}
                            selectedObjectsForDelete={selectedObjectsForDelete}
                            setSelectedObjectsForDelete={
                              setSelectedObjectsForDelete
                            }
                            isRelationTable={isRelationTable}
                            relatedTableSlug={relatedTableSlug}
                            onRowClick={onRowClick}
                            isChecked={isChecked}
                            calculateWidthFixedColumn={
                              calculateWidthFixedColumn
                            }
                            onCheckboxChange={onCheckboxChange}
                            currentPage={currentPage}
                            limit={limit}
                            setFormValue={setFormValue}
                            columns={columns}
                            tableHeight={tableHeight}
                            tableSettings={tableSettings}
                            pageName={pageName}
                            calculateWidth={calculateWidth}
                            tableSlug={tableSlug}
                            onDeleteClick={onDeleteClick}
                            relationAction={relationAction}
                            onChecked={onChecked}
                            relationFields={fields}
                            data={data}
                            view={view}
                          />
                        </CTableRow>
                      )}
                    />
                  )
                );
              }
            )}

            {addNewRow && (
              <AddDataColumn
                rows={isRelationTable ? fields : data}
                columns={columns}
                isRelationTable={isRelationTable}
                setAddNewRow={setAddNewRow}
                isTableView={isTableView}
                relOptions={relOptions}
                tableView={tableView}
                tableSlug={relatedTableSlug ?? tableSlug}
                fields={columns}
                getValues={getValues}
                mainForm={mainForm}
                originControl={control}
                setFormValue={setFormValue}
                relationfields={fields}
                data={data}
                view={view}
                onRowClick={onRowClick}
                width={"80px"}
                refetch={refetch}
              />
            )}

            <CTableRow>
              <CTableCell
                align="center"
                className="data_table__number_cell"
                style={{
                  padding: "0",
                  position: "sticky",
                  left: "0",
                  backgroundColor: "#FFF",
                  zIndex: "1",
                }}>
                <PermissionWrapperV2 tableSlug={tableSlug} type={"write"}>
                  <Button
                    variant="text"
                    style={{
                      borderColor: "#F0F0F0",
                      borderRadius: "0px",
                      width: "100%",
                    }}
                    onClick={() => {
                      setAddNewRow(true);
                    }}>
                    <AddRoundedIcon />
                  </Button>
                </PermissionWrapperV2>
              </CTableCell>
            </CTableRow>

            {!!summaries?.length && (
              <SummaryRow summaries={summaries} columns={columns} data={data} />
            )}
            {additionalRow}
          </CTableBody>
        )}></Container>
    </CTable>
  );
};

export default DragObjectDataTable;
