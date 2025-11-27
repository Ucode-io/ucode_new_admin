import {Paper} from "@mui/material";
import {forwardRef} from "react";
import CPagination from "../CPagination";
import EmptyDataComponent from "../EmptyDataComponent";
import TableLoader from "../TableLoader/index";
import "./style.scss";
import PageFallback from "../PageFallback";

export const CTable = ({
  dataCount,
  children,
  count,
  selectedObjectsForDelete,
  page,
  setCurrentPage,
  currentPage,
  removableHeight = 186,
  disablePagination,
  isTableView = false,
  isGroupByTable = false,
  loader = false,
  multipleDelete,
  tableStyle = {},
  wrapperStyle = {},
  paginationExtraButton,
  limit,
  setLimit,
  defaultLimit,
  view,
  selectedTab,
  isRelationTable,
  filterVisible,
  navigateToEditPage,
  parentRef,
}) => {
  return (
    <Paper className="CTableContainer" style={wrapperStyle}>
      <div
        className="table"
        style={{
          ...tableStyle,
          height: removableHeight
            ? `calc(100vh - ${removableHeight}px)`
            : "auto",
          overflow: loader ? "hidden" : "auto",
          width: "100%",
        }}
        ref={parentRef}>
        {loader ? <PageFallback /> : <table id="resizeMe">{children}</table>}
      </div>

      {!disablePagination && (
        <CPagination
          dataCount={dataCount}
          filterVisible={filterVisible}
          count={count}
          isGroupByTable={isGroupByTable}
          selectedObjectsForDelete={selectedObjectsForDelete}
          page={page}
          isTableView={isTableView}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          paginationExtraButton={paginationExtraButton}
          limit={limit}
          multipleDelete={multipleDelete}
          setLimit={setLimit}
          defaultLimit={defaultLimit}
          view={view}
          selectedTab={selectedTab}
          isRelationTable={isRelationTable}
          navigateToEditPage={navigateToEditPage}
        />
      )}
    </Paper>
  );
};

export const CTableHead = ({children}) => {
  return <thead className="CTableHead">{children}</thead>;
};

export const CTableHeadRow = ({children, className}) => {
  return <tr className={`CTableHeadRow ${className}`}>{children}</tr>;
};

export const CTableHeadCell = ({
  children,
  className = "",
  buttonsCell = false,
  ...props
}) => {
  return (
    <th {...props} className={className}>
      {children}
    </th>
  );
};

export const CTableBody = forwardRef(
  (
    {
      children,
      columnsCount,
      loader = false,
      title,
      selectedObjectsForDelete,
      dataLength,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <TableLoader
          isVisible={loader}
          columnsCount={columnsCount}
          rowsCount={dataLength || 3}
        />

        <tbody className="CTableBody" {...props} ref={ref}>
          {children}
        </tbody>
      </>
    );
  }
);

export const CTableRow = ({children, className, parentRef, ...props}) => {
  return (
    <tr className={`CTableRow ${className}`} {...props} ref={parentRef}>
      {children}
    </tr>
  );
};

export const CTableCell = ({
  children,
  className = "",
  buttonsCell = false,
  ...props
}) => {
  return (
    <td
      className={`CTableCell ${className} ${buttonsCell ? "buttonsCell" : ""}`}
      {...props}>
      {children}
    </td>
  );
};
