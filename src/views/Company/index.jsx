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
import TableCard from "../../components/TableCard";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { store } from "../../store";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";
import {
  useCompanyDeleteMutation,
  useCompanyListQuery,
} from "../../services/companyService";

const CompanyPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = store.getState().auth.userId;

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const { data: companies, isLoading } = useCompanyListQuery({
    params: {
      owner_id: user_id,
    },
  });

  const { mutateAsync: deteleCompany, isLoading: createLoading } =
    useCompanyDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["COMPANY"]);
      },
    });

  const deteleCompanyElement = (id) => {
    deteleCompany(id);
  };

  return (
    <div>
      <HeaderSettings title={"Companies"} />

      <FiltersBlock>
        <div className="p-1">{/* <SearchInput /> */}</div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={4}
            dataLength={companies?.companies?.length}
          >
            {companies?.companies?.map((element, index) => (
              <CTableRow
                key={element?.id}
                onClick={() => navigateToEditForm(element?.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deteleCompanyElement(element?.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default CompanyPage;
