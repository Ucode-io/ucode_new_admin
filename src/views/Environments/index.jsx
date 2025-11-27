import { useLocation, useNavigate } from "react-router-dom";
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
import {
  useEnvironmentDeleteMutation,
  useEnvironmentListQuery,
} from "../../services/environmentService";
import { store } from "../../store";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";

const EnvironmentPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = store.getState().company.projectId;

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { data: environments, isLoading: environmentLoading } =
    useEnvironmentListQuery({
      params: {
        project_id: projectId,
      },
    });

  const { mutateAsync: deleteEnv, isLoading: createLoading } =
    useEnvironmentDeleteMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["ENVIRONMENT"]);
        store.dispatch(showAlert("Успешно", "success"));
      },
    });

  const deleteEnvironment = (id) => {
    deleteEnv(id);
  };
  return (
    <div>
      <HeaderSettings title={"Environments"} />

      <FiltersBlock>
        <div className="p-1">{/* <SearchInput /> */}</div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>Description</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={environmentLoading}
            columnsCount={4}
            dataLength={environments?.environments?.length}
          >
            {environments?.environments?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "8px",
                    }}
                  >
                    <span
                      style={{
                        background: element.display_color,
                        width: "10px",
                        height: "10px",
                        display: "block",
                        borderRadius: "50%",
                      }}
                    ></span>
                    {element?.name}
                  </div>
                </CTableCell>
                <CTableCell>{element?.description}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteEnvironment(element.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={4} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default EnvironmentPage;
