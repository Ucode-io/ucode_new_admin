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
import { store } from "../../store";
import { useQueryClient } from "react-query";
import {
  useProjectDeleteMutation,
  useProjectListQuery,
} from "../../services/projectService";
import { showAlert } from "../../store/alert/alert.thunk";

const ProjectPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = store.getState().company.companyId;

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { data: projects, isLoading: projectLoading } = useProjectListQuery({
    params: {
      company_id: companyId,
    },
  });

  const { mutateAsync: deleteProject, isLoading: createLoading } =
    useProjectDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["PROJECT"]);
      },
    });

  const deleteProjectElement = (id) => {
    deleteProject(id);
  };
  return (
    <div>
      <HeaderSettings title={"Projects"} />

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={projectLoading}
            columnsCount={2}
            dataLength={projects?.projects?.length}
          >
            {projects?.projects?.map((element, index) => (
              <CTableRow
                key={element.project_id}
                onClick={() => navigateToEditForm(element.project_id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.title}</CTableCell>
                {/* <CTableCell>{element?.description}</CTableCell> */}
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteProjectElement(element.project_id);
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

export default ProjectPage;
