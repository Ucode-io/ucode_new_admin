import { useTranslation } from "react-i18next";
import { CTable, CTableBody, CTableHead, CTableRow } from "../CTable";
import TableCard from "../TableCard";
import RecursiveTable from "./RecursiveTable";
import TableHeadForTableView from "./TableHeadForTableView";

const SecondGroupTable = ({
  data,
  columns,
  pageName,
  tableSize,
  tableSettings,
  sortedDatas,
  selectedView,
  setDrawerState,
  setSortedDatas,
  view,
  calculateWidthFixedColumn,
  handlePin,
  handleAutoSize,
  popupRef,
  columnId,
  setColumnId,
  setCurrentColumnWidth,
  isTableView,
  FilterGenerator,
  filterChangeHandler,
  filters,
  tableSlug,
  disableFilters,
  width,
}) => {
  return (
    <TableCard>
      <CTable removableHeight={140}>
        <CTableHead>
          <CTableRow>
            {columns.map(
              (column, index) =>
                column?.attributes?.field_permission?.view_permission && (
                  <TableHeadForTableView
                    column={column}
                    index={index}
                    pageName={pageName}
                    sortedDatas={sortedDatas}
                    setSortedDatas={setSortedDatas}
                    setDrawerState={setDrawerState}
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
                  />
                )
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody columnsCount={6} dataLength={data?.length}>
          {data?.map((element, index) => (
            <RecursiveTable
              element={element}
              index={index}
              columns={columns}
              width={width}
            />
          ))}
        </CTableBody>
      </CTable>
    </TableCard>
  );
};

export default SecondGroupTable;
