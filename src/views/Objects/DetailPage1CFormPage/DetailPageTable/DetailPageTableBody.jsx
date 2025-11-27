import React, {useState} from "react";
import styles from "./style.module.scss";
import CPagination from "../../Table1CUi/TableComponent/NewCPagination";
import {Box} from "@mui/material";
import DetailPageHead from "./DetailPageHead";
import CellElementGenerator from "../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import AddRow from "./AddRow";
import AddIcon from "@mui/icons-material/Add";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useQueryClient} from "react-query";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

const DetailPageTableBody = ({
  fields,
  tableData,
  setLimit,
  setOffset,
  limit,
  offset = 1,
  count,
  view,
  relatedTableSlug,
  computedColumn,
  addRow,
  setAddRow,
  handleAddRowClick,
  field,
  refetch = () => {},
}) => {
  const {appId, tableSlug} = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const currentPage = offset === 0 ? 1 : offset + 1;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  const deleteHandler = async (row) => {
    try {
      await constructorObjectService.delete(relatedTableSlug, row.guid);
      refetch();
      dispatch(showAlert("Successfully created!", "success"));
    } finally {
    }
  };

  return (
    <div className={styles.table_container}>
      <table className={styles.custom_table}>
        <thead>
          <tr>
            <th style={{width: "50px", textAlign: "center"}}>№</th>
            {computedColumn?.map((column, rowIndex) => (
              <DetailPageHead
                relatedTableSlug={relatedTableSlug}
                view={view}
                column={column}
                fields={fields}
              />
            ))}
            <th style={{width: "60px"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, index) => (
            <tr
              style={{cursor: "pointer"}}
              onClick={() => {
                navigate(
                  `/main/${appId}/1c/${relatedTableSlug}/${row?.guid}?menuId=${menuItem?.id}`
                );
              }}
              key={index}>
              <td style={{textAlign: "center"}}>
                {limit === "all" ? index + 1 : currentPage + index}
              </td>
              {computedColumn?.map((field) => (
                <td>
                  <CellElementGenerator row={row} field={field} />
                </td>
              ))}
              <td style={{textAlign: "center", padding: "0"}}>
                <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteHandler(row, index)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </PermissionWrapperV2>
              </td>
            </tr>
          ))}

          {addRow && (
            <AddRow
              fields={computedColumn}
              relatedTableSlug={relatedTableSlug}
              view={view}
              data={tableData}
              setAddRow={setAddRow}
              padding={"5px"}
              field={field}
              refetch={refetch}
            />
          )}
          {!addRow && (
            <tr style={{borderBottom: "1px solid #fff", borderTop: "none"}}>
              <td
                onClick={handleAddRowClick}
                style={{
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  borderTop: "none",
                  cursor: "pointer",
                }}>
                <AddIcon sx={{fontSize: "20px", color: "#000"}} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Box
        sx={{
          position: "sticky",
          left: 0,
          bottom: 0,
          width: "100%",
        }}>
        <CPagination
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
          count={count}
        />
      </Box>
    </div>
  );
};

export default DetailPageTableBody;
