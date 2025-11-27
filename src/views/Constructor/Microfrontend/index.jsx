import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import FiltersBlock from "../../../components/FiltersBlock";
import HeaderSettings from "../../../components/HeaderSettings";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../../components/SearchInput";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import { useEffect, useState } from "react";
import microfrontendService from "../../../services/microfrontendService";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import DeleteWrapperModal from "../../../components/DeleteWrapperModal";
import { Delete } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import StatusPipeline from "./StatusPipeline";

const MicrofrontendPage = () => {
  const navigate = useNavigate();
  const { appId } = useParams()
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    microfrontendService.delete(id).then(() => {
      getMicrofrontendList();
    });
  };

  const getMicrofrontendList = () => {
    microfrontendService.getList().then((res) => {
      setList(res);
    });
  };

  const navigateToGithub = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${window.location.origin}/main/${appId}/microfrontend/github/create&scope=read:user,repo`)
  }

  useEffect(() => {
    getMicrofrontendList();
  }, []);

  return (
    <div>
      <HeaderSettings title={"Микрофронтенд"} backButtonLink={-1} />

      <FiltersBlock>
        <div className="p-1">
          <SearchInput />
        </div>
      </FiltersBlock>

      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{
            borderRadius: "0px",
            border: "none",
          }}
          disablePagination
          removableHeight={140}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>Status</CTableCell>
            <CTableCell>Description</CTableCell>
            <CTableCell>Link</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}
          >
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <StatusPipeline element={element} />
                </CTableCell>
                <CTableCell>{element?.description}</CTableCell>
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>
                  <RectangleIconButton color="error" onClick={() => deleteTable(element.id)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={5} onClick={navigateToCreateForm} />
              {/*<TableRowButton colSpan={5} onClick={navigateToGithub} title="Подключить из GitHub" />*/}
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default MicrofrontendPage;
