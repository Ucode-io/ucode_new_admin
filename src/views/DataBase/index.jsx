import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import TableCard from "../../components/TableCard";
import {
  useObjectDeleteMutation,
  useObjectsListQuery,
} from "../../services/constructorObjectService";
import { useState } from "react";
import { pageToOffset } from "../../utils/pageToOffset";
import { Box, Button } from "@mui/material";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import DataBaseDetailPage from "./DetailPage";
import { BiPencil } from "react-icons/bi";
import "./style.scss";
import { store } from "../../store";
import HeaderSettings from "../../components/HeaderSettings";

const DatabasePage = () => {
  const { resourceId, tableSlug } = useParams();
  const envId = store.getState().company.environmentId;
  const location = useLocation();
  const navigate = useNavigate();
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerState, setDrawerState] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  const openEditDrawer = (id) => {
    setSelectedObject(id);
    setDrawerState(true);
  };

  const openCreateDrawer = () => {
    setDrawerState(true);
  };

  const closeDrawer = () => {
    setSelectedObject(null);
    setDrawerState(false);
  };

  const {
    data = {},
    isLoading,
    remove,
  } = useObjectsListQuery({
    params: {
      tableSlug: tableSlug,
      resource_Id: resourceId,
    },
    data: {
      limit: 10,
      offset: pageToOffset(currentPage),
    },
    queryParams: {
      select: (res) => res.data,
      onSuccess: (res) => {
        setPageCount(Math.ceil(res?.count / 10));
      },
    },
  });

  const { mutate: deleteObject, isLoading: deleteLoading } =
    useObjectDeleteMutation({
      onSuccess: () => {
        remove();
      },
    });

  const deleteClickHandler = (id) => {
    deleteObject({
      tableSlug,
      resourceId,
      objectId: id,
      env: envId,
    });
  };

  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <HeaderSettings
        title="Data base"
        backButtonLink={-1}
        line={false}
        disabledMenu={false}
        extraButtons={
          <>
            <Button variant="contained" onClick={openCreateDrawer}>
              Create object
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigate(`${location.pathname}/configuration`);
              }}
            >
              Configure fields
            </Button>
          </>
        }
      />

      <TableCard>
        <CTable
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            {data.fields?.map((field) => (
              <CTableCell key={field.id}>{field.slug}</CTableCell>
            ))}
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={5}
            dataLength={data?.response?.length}
          >
            {data?.response?.map((row, index) => (
              <CTableRow key={row.guid}>
                <CTableCell>{(currentPage - 1) * 10 + index + 1}</CTableCell>
                {data?.fields?.map((field) => (
                  <CTableCell key={field.id}>{row[field.slug]}</CTableCell>
                ))}
                <CTableCell>
                  <Box className="btns-block">
                    <RectangleIconButton
                      onClick={() => openEditDrawer(row.guid)}
                    >
                      <BiPencil color="error" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      onClick={() => deleteClickHandler(row.guid)}
                      color="error"
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </Box>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
      <DataBaseDetailPage
        objectId={selectedObject}
        open={drawerState}
        initialValues={drawerState}
        formIsVisible={drawerState}
        closeDrawer={closeDrawer}
        fields={data.fields}
      />
    </div>
  );
};

export default DatabasePage;
