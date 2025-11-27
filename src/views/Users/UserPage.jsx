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
import { useQueryClient } from "react-query";

import { showAlert } from "../../store/alert/alert.thunk";
import {
  useUserDeleteMutation,
  useUserListQuery,
} from "../../services/auth/userService";

const ClientUserPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { userMenuId } = useParams();

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { data: users, isLoading: projectLoading } = useUserListQuery({
    params: {
      "client-type-id": userMenuId,
    },
  });

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
        <CTable tableStyle={{border: 'none'}} disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>Login</CTableCell>
            <CTableCell>Email</CTableCell>
            <CTableCell>Phone</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={projectLoading}
            columnsCount={6}
            dataLength={users?.users?.length}
          >
            {users?.users?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.login}</CTableCell>
                <CTableCell>{element?.email}</CTableCell>
                <CTableCell>{element?.phone}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteProjectElement(element.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={6} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default ClientUserPage;
