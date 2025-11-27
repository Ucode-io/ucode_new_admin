import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import FiltersBlock from "../../components/FiltersBlock";
import HeaderSettings from "../../components/HeaderSettings";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { store } from "../../store";
import { useQuery, useQueryClient } from "react-query";

import { showAlert } from "../../store/alert/alert.thunk";
import {
  useUserDeleteMutation,
  useUserListQuery,
} from "../../services/auth/userService";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import { useState } from "react";

const UsersList = () => {
  const queryClient = useQueryClient();
  const {appId, tableSlug, userMenuId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [child, setChild] = useState();


  const navigateToEditForm = (element) => {
    navigate(`/main/${appId}/user-page/${element?.guid}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };


  const { isLoading } = useQuery(
    ["GET_CLIENT_TYPE_LIST"],
    () => {
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      onSuccess: (res) => {
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "USER",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
    }
  );


  const { mutateAsync: deleteProject, isLoading: createLoading } =
    useUserDeleteMutation({
      userMenuId: userMenuId,
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["PROJECT"]);
      },
    });

  const deleteProjectElement = (id) => {
    deleteProject(id);
  };
  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <HeaderSettings
        title={"Users"}
        disabledMenu={false}
        line={false}
        backButtonLink={-1}
      />

      <TableCard type={"withoutPadding"}>
        <CTable  tableStyle={{border: 'none'}} disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell  width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={6}
            dataLength={child?.length}
          >
            {child?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell style={{height:'50px'}}>{element?.name}</CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default UsersList;
