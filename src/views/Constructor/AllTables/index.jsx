import {Delete} from "@mui/icons-material";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import constructorTableService, {
  useTablesListQuery,
} from "../../../services/constructorTableService";
import HeaderSettings from "../../../components/HeaderSettings";
import SearchInput from "../../../components/SearchInput";
import FiltersBlock from "../../../components/FiltersBlock";
import {useQueryClient} from "react-query";

const TablesPage = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState();
  const projectId = useSelector((state) => state.auth.projectId);
  const queryClient = useQueryClient();
  const {data: tables, isLoading} = useTablesListQuery({
    params: {
      search: searchText,
    },
  });
  const navigateToEditForm = (id, slug) => {
    navigate(`${location.pathname}/${id}/`);
  };

  const navigateToCreateForm = () => {
    navigate(`/main/:appId/tables`);
  };

  const openImportModal = () => {
    setImportModalVisible(true);
  };

  const closeImportModal = () => {
    setImportModalVisible(false);
  };

  const deleteTable = async (id) => {
    setLoader(true);
    constructorTableService
      .delete(id, projectId)
      .then(() => {
        queryClient.refetchQueries(["TABLES"]);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <div>
        <HeaderSettings title={"Таблицы"} line={false} />

        <FiltersBlock>
          <div className="p-1">
            <SearchInput
              onChange={(val) => {
                setSearchText(val);
              }}
            />
          </div>
        </FiltersBlock>
        <TableCard type={"withoutPadding"}>
          <CTable
            tableStyle={{
              borderRadius: "0px",
              border: "none",
            }}
            disablePagination
            removableHeight={120}>
            <CTableHead>
              {/* <CTableCell></CTableCell> */}
              <CTableCell width={10}>№</CTableCell>
              <CTableCell>Name</CTableCell>
              <CTableCell>Description</CTableCell>
              {/* <CTableCell width={60}>Показать в меню</CTableCell> */}
              <CTableCell width={60} />
            </CTableHead>
            <CTableBody columnsCount={4} dataLength={1} loader={loader}>
              {tables?.tables?.map((element, index) => (
                <CTableRow
                  key={element.id}
                  onClick={() => navigateToEditForm(element.id, element.slug)}>
                  <CTableCell>{index + 1}</CTableCell>
                  <CTableCell>{element.label}</CTableCell>
                  <CTableCell>{element.description}</CTableCell>

                  <CTableCell>
                    <RectangleIconButton
                      color="error"
                      onClick={() => deleteTable(element.id)}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </CTableCell>
                </CTableRow>
              ))}

              {/* <TableRowButton
                colSpan={5}
                onClick={openImportModal}
                title="Импортировать из других приложений"
              /> */}
              <TableRowButton
                colSpan={5}
                onClick={navigateToCreateForm}
                title="Create new"
              />
            </CTableBody>
          </CTable>
        </TableCard>
      </div>
    </>
  );
};

export default TablesPage;
