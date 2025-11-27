import { Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import FiltersBlock from "../../components/FiltersBlock";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import { useEffect, useState } from "react";
import smsOtpService from "../../services/auth/smsOtpService";
import HeaderSettings from "../../components/HeaderSettings";

const SmsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const list = useSelector((state) => state.application.list);
  const loader = useSelector((state) => state.application.loader);
  const projectId = useSelector((state) => state.auth.projectId);
  const [smsOtp, setSmsOtp] = useState();
  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const params = {
    "project-id": projectId,
  };

  const deleteTable = (id) => {
    smsOtpService.delete(params, id).then(() => {
      getList();
    });
  };

  const getList = () => {
    const params = {
      "project-id": projectId,
    };
    smsOtpService
      .getList(params)
      .then((res) => {
        setSmsOtp(res.items);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <HeaderSettings
        title={"Sms OTP"}
        line={false}
      />

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Login</CTableCell>
            <CTableCell>Password</CTableCell>
            <CTableCell>Number of Otp </CTableCell>
            <CTableCell>Default Otp</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={false} columnsCount={5} dataLength={list.length}>
            {smsOtp?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.login}</CTableCell>
                <CTableCell>{element?.password}</CTableCell>
                <CTableCell>{element?.number_of_otp}</CTableCell>
                <CTableCell>{element?.default_otp}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteTable(element?.id)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={6} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default SmsPage;
