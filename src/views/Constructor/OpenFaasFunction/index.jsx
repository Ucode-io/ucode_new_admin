import { Delete } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
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
import constructorFunctionService from "../../../services/constructorFunctionService";
import StatusPipeline from "../Microfrontend/StatusPipeline";
import { useQueryClient } from "react-query";
import { useFunctionDeleteMutation } from "../../../services/functionService";

export default function OpenFaasFunctionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const queryClient = useQueryClient();

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    constructorFunctionService.delete(id).then(() => {
      getList();
    });
  };

  const { mutate: deleteFunction, isLoading: deleteFunctionLoading } =
    useFunctionDeleteMutation({
      onSuccess: () => queryClient.refetchQueries("FUNCTIONS"),
    });

  const getList = () => {
    setLoader(true);
    constructorFunctionService
      .getList()
      .then((res) => {
        setList(res);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <HeaderSettings title={"Open faas функции"} backButtonLink={-1} />

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
            <CTableCell>Path</CTableCell>
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
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteFunction(element.id)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={5} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
}
