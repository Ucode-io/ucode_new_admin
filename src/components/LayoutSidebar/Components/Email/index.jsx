import { useLocation, useNavigate } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import HeaderSettings from "../../../../components/HeaderSettings";
import TableCard from "../../../../components/TableCard";
import TableRowButton from "../../../../components/TableRowButton";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import {
  useEmailDeleteMutation,
  useEmailListQuery,
} from "../../../../services/emailService";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { store } from "../../../../store";

const EmailPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const company = store.getState().company;
  const {
    data: email,
    isLoading,
    remove,
  } = useEmailListQuery({
    params: { project_id: company.projectId },
  });

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };
  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { mutate: deleteEmail, isLoading: deleteLoading } =
    useEmailDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Success deleted", "success"));
        remove();
      },
    });

  const onDeleteClick = (id) => {
    deleteEmail(id);
  };

  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <HeaderSettings
        title={"Email settings"}
        disabledMenu={false}
        backButtonLink={-1} 
        line={false}
      />
      <TableCard>
        <CTable disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Email</CTableCell>
            <CTableCell>Password</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={2}
            dataLength={email?.items?.length}
          >
            {email?.items?.map((element, index) => (
              <CTableRow
                key={element?.id}
                onClick={() => navigateToEditForm(element?.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.email}</CTableCell>
                <CTableCell>{element?.password}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      onDeleteClick(element?.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <TableRowButton colSpan={4} onClick={navigateToCreateForm} />
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default EmailPage;
