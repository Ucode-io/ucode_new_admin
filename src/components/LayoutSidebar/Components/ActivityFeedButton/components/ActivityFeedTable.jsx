import TableCard from "../../../../TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../CTable";
import Tag from "../../../../Tag";
import {ActivityFeedColors} from "../../../../Status";
import style from "../style.module.scss";
import {store} from "../../../../../store";
import {useState} from "react";
import ActivitySinglePage from "./ActivitySinglePage";
import {
  useVersionHistoryByIdQuery,
  useVersionHistoryListQuery,
} from "../../../../../services/environmentService";
import EmptyDataComponent from "../../../../EmptyDataComponent";
import {pageToOffset} from "../../../../../utils/pageToOffset";
import {Backdrop} from "@mui/material";
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";
import {format} from "date-fns";

const ActivityFeedTable = ({
  setHistories,
  type = "withoutPadding",
  requestType = "GLOBAL",
  apiKey,
  actionByVisible = true,
  dateFilters,
}) => {
  const company = store.getState().company;
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [id, setId] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const openDrawer = (id) => {
    setId(id);
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  const {data: histories, isLoading: versionHistoryLoader} =
    useVersionHistoryListQuery({
      envId: company.environmentId,
      params: {
        type: requestType,
        limit: 10,
        offset: pageToOffset(currentPage),
        api_key: apiKey,
        from_date: dateFilters?.$gte
          ? format(dateFilters?.$gte, "yyyy-MM-dd")
          : undefined,
        to_date: dateFilters?.$lt
          ? format(dateFilters?.$lt, "yyyy-MM-dd")
          : undefined,
      },
      queryParams: {
        onSuccess: (res) => {
          setHistories(res);
          setPageCount(Math.ceil(res?.count / 10));
        },
      },
    });

  const {data: history, isLoading: versionHistoryByIdLoader} =
    useVersionHistoryByIdQuery({
      envId: company.environmentId,
      id: id,
      queryParams: {
        enabled: !!Boolean(id),
      },
    });

  if (versionHistoryLoader)
    return (
      <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 999}} open={true}>
        <RingLoaderWithWrapper />
      </Backdrop>
    );

  return (
    <>
      <TableCard type={type}>
        <CTable
          loader={false}
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell width={130}>Action</CTableCell>
            <CTableCell>Collection</CTableCell>
            <CTableCell>Action On</CTableCell>
            {actionByVisible && <CTableCell>Action By</CTableCell>}
          </CTableHead>
          <CTableBody
            loader={false}
            columnsCount={5}
            dataLength={histories?.histories?.length}>
            {histories?.histories?.map((element, index) => {
              return (
                <CTableRow
                  height="50px"
                  className={style.row}
                  key={element.id}
                  onClick={() => {
                    openDrawer(element?.id);
                  }}
                  style={{
                    width: "80px",
                  }}>
                  <CTableCell>{(currentPage - 1) * 10 + index + 1}</CTableCell>
                  <CTableCell>
                    <Tag
                      shape="subtle"
                      color={ActivityFeedColors(element?.action_type)}
                      size="large"
                      style={{
                        background: `${ActivityFeedColors(element?.action_type)}`,
                      }}
                      className={style.tag}>
                      {element?.action_type?.charAt(0).toUpperCase() +
                        element?.action_type.slice(1).toLowerCase()}
                    </Tag>
                  </CTableCell>
                  <CTableCell>{element?.table_slug}</CTableCell>
                  <CTableCell>
                    {format(new Date(element?.date), "yyyy-MM-dd HH:mm:ss")}
                  </CTableCell>
                  {actionByVisible && (
                    <CTableCell>{element?.user_info}</CTableCell>
                  )}
                </CTableRow>
              );
            })}
            <EmptyDataComponent
              columnsCount={5}
              isVisible={!histories?.histories}
            />
          </CTableBody>
        </CTable>
      </TableCard>

      <ActivitySinglePage
        open={drawerIsOpen}
        closeDrawer={closeDrawer}
        history={history}
        versionHistoryByIdLoader={versionHistoryByIdLoader}
      />
    </>
  );
};

export default ActivityFeedTable;
