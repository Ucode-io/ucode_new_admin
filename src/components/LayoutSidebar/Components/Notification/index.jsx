import { useLocation, useNavigate, useParams } from "react-router-dom";

import HeaderSettings from "../../../HeaderSettings";
import TableCard from "../../../TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../CTable";
import { useNotificationListQuery } from "../../../../services/notificationsService";
import { useState } from "react";
import { pageToOffset } from "../../../../utils/pageToOffset";
import TableRowButton from "../../../TableRowButton";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const NotificationPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notification, isLoading: listLoading } =
    useNotificationListQuery({
      params: {
        "category-id": categoryId,
        limit: 10,
        offset: pageToOffset(currentPage),
      },
      queryParams: {
        onSuccess: (res) => {
          setPageCount(Math.ceil(res?.count / 10));
        },
      },
    });

  const handleNavigate = () => {
    navigate(`${location.pathname}/create`);
  };

  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <HeaderSettings
        title={"Notifications"}
        disabledMenu={false}
        backButtonLink={-1}
      />

      <TableCard>
        <CTable
          disablePagination
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <CTableHead>
            <CTableCell width={10}>No</CTableCell>
            <CTableCell>Title</CTableCell>
            {/* <CTableCell>Created at</CTableCell> */}
            <CTableCell>Success sends</CTableCell>
            <CTableCell>Fail sends</CTableCell>
            {/* <CTableCell>Status</CTableCell> */}
          </CTableHead>
          <CTableBody
            loader={listLoading}
            columnsCount={7}
            dataLength={notification?.notifications?.length}
          >
            {notification?.notifications?.map((row, index) => (
              <CTableRow key={row.id}>
                <CTableCell>{(currentPage - 1) * 10 + index + 1}</CTableCell>
                <CTableCell>{row.title}</CTableCell>
                <CTableCell>{row?.success_sends || 0}</CTableCell>
                <CTableCell>{row?.failed_sends || 0}</CTableCell>
              </CTableRow>
            ))}
            <TableRowButton colSpan={7} onClick={handleNavigate} />
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default NotificationPage;
