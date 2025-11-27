import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../../components/TableCard";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import {store} from "../../../store";
import {useQuery, useQueryClient} from "react-query";
import {showAlert} from "../../../store/alert/alert.thunk";
import TableRowButton from "../../../components/TableRowButton";
import roleServiceV2, {
  useRoleDeleteMutation,
} from "../../../services/roleServiceV2";
import {useState} from "react";
import RoleCreateModal from "./RoleFormPage";
import styles from "../style.module.scss";

const RolePage = () => {
  const {clientId} = useParams();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState();
  const [roleId, setRoleId] = useState();
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const {data: roles, isLoading} = useQuery(["GET_ROLE_LIST", clientId], () => {
    return roleServiceV2.getList({"client-type-id": clientId});
  });

  const {mutateAsync: deleteRole, isLoading: createLoading} =
    useRoleDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["GET_ROLE_LIST"]);
      },
    });

  const deleteRoleElement = (id) => {
    deleteRole(id);
  };
  const closeModal = () => {
    setModalType(null);
  };

  const navigateToDetailPage = (id) => {
    navigate(`${pathname}/role/${id}`);
  };

  return (
    <div className={styles.role}>
      <TableCard type={"withBody"}>
        <CTable
          tableStyle={{
            marginTop: "10px",
          }}
          disablePagination
          removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={2}
            dataLength={roles?.data?.response?.length}>
            {roles?.data?.response?.map((element, index) => (
              <CTableRow
                key={element.guid}
                onClick={() => {
                  navigateToDetailPage(element.guid);
                }}>
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteRoleElement(element?.guid);
                    }}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton
                styles={{borderBottom: "none"}}
                colSpan={4}
                onClick={() => setModalType("NEW")}
              />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>

      {modalType && (
        <RoleCreateModal
          closeModal={closeModal}
          modalType={modalType}
          roleId={roleId}
        />
      )}
    </div>
  );
};

export default RolePage;
