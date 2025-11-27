import {Delete, Edit} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import HeaderSettings from "../../components/HeaderSettings";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import exportToJsonService from "../../services/exportToJson";
import useDownloader from "../../hooks/useDownloader";
import {useEffect, useRef, useState} from "react";
import fileService from "../../services/fileService";
import apiKeyService from "../../services/apiKey.service";
import {numberWithSpaces} from "../../utils/formatNumbers";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ActivityFeedPage from "../../components/LayoutSidebar/Components/ActivityFeedButton/components/Activity";
import ActivityFeedTable from "../../components/LayoutSidebar/Components/ActivityFeedButton/components/ActivityFeedTable";
import EmptyDataComponent from "../../components/EmptyDataComponent";
import {Box} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ApiKeyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {download} = useDownloader();
  const list = useSelector((state) => state.application.list);
  const loader = useSelector((state) => state.application.loader);
  const projectId = useSelector((state) => state.auth.projectId);
  const clientTypeId = useSelector((state) => state.auth.clientType.id);
  const envId = useSelector((state) => state?.auth?.environmentId);
  const roleId = useSelector((state) => state.auth.roleInfo.id);
  const inputRef = useRef();
  const [apiKeys, setApiKeys] = useState();
  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    // dispatch(deleteApplicationAction(id));
    apiKeyService.delete(projectId, id).then(() => {
      getList();
    });
  };

  // const exportToJson = async (id) => {
  //   await exportToJsonService
  //     .postToJson({
  //       app_id: id,
  //     })
  //     .then((res) => {
  //       download({
  //         link: "https://" + res?.link,
  //         fileName: res?.link.split("/").pop(),
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("exportToJson error", err);
  //     });
  // };

  const getList = () => {
    const params = {
      client_type_id: clientTypeId,
      role_id: roleId,
      "environment-id": envId,
    };
    apiKeyService
      .getList(projectId, params)
      .then((res) => {
        setApiKeys(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const inputChangeHandler = (e) => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService.upload(data).then((res) => {
      fileSend(res?.filename);
    });
  };

  const fileSend = (value) => {
    exportToJsonService.uploadToJson({
      file_name: value,
      // app_id: appId,
    });
  };

  const URLFILE = window.location.origin + "/apikeys.zip";
  const downloadUrl = (url) => {
    const filename = url.split("/").pop();
    const aTag = document.createElement("a");

    aTag.href = url;
    aTag.setAttribute("download", filename);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          height: "56px",
          borderBottom: "1px solid #eee",
        }}>
        <HeaderSettings title={"Api keys"} sticky line={false} />
        <Box onClick={() => downloadUrl(URLFILE)} sx={{width: "300px"}}>
          <a
            target="_blank"
            style={{display: "inline-flex", alignItems: "center"}}
            href="apikeys.zip"
            download>
            <DownloadIcon style={{background: "#007af"}} />
            Download api documentation
          </a>
        </Box>
      </Box>
      <TableCard>
        <CTable loader={false} disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>AppId</CTableCell>
            <CTableCell>Monthly limit</CTableCell>
            <CTableCell>RPS limit</CTableCell>
            <CTableCell>Used count</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={false} columnsCount={4} dataLength={list.length}>
            {apiKeys?.map((element, index) => (
              <CTableRow key={element.id}>
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.app_id}</CTableCell>
                <CTableCell>
                  {numberWithSpaces(element?.monthly_request_limit)}
                </CTableCell>
                <CTableCell>{numberWithSpaces(element?.rps_limit)}</CTableCell>
                <CTableCell>{numberWithSpaces(element?.used_count)}</CTableCell>
                <CTableCell>
                  <div className="flex">
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      size="small"
                      onClick={() => navigateToEditForm(element.id)}>
                      <Edit color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton color="error" onClick={deleteTable}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </div>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={7} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default ApiKeyPage;
