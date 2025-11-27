import React from "react";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import styles from "./style.module.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {useQueryClient} from "react-query";
import CellElementGeneratorForTable from "../../../../components/ElementGenerators/CellElementGeneratorForTable";

function ItemsRow({
  view,
  pageName,
  tableSettings,
  columns,
  level,
  item,
  menuItem,
  index,
  offset,
  control,
  navigateToDetailPage,
}) {
  const {tableSlug, appId} = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteHandler = async (row) => {
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      queryClient.refetchQueries(["GET_FOLDER_LIST"]);
      dispatch(showAlert("Successfully created!", "success"));
    } finally {
    }
  };

  return (
    <tr
      onClick={() => {
        navigateToDetailPage(item);
      }}
      key={item.guid}
      className={styles.child_row}
      style={{paddingLeft: `${(level + 1) * 40}px`, cursor: "pointer"}}>
      <td
        style={{
          textAlign: "center",
          background: "#F9FAFB",
          position: "sticky",
          left: 0,
          zIndex: 2,
          outline: "#EAECF0 1px solid",
          border: "none",
          background: "#F9FAFB",
          color: "#212B36",
        }}>
        {offset + (index + 1)}
      </td>
      {columns.map((col, index) => (
        <td
          style={{
            position: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "sticky"
                : "relative"
            }`,
            left: view?.attributes?.fixedColumns?.[col?.id]
              ? `${calculateWidthFixedColumn(col.id, columns) + 50}px`
              : "0",
            backgroundColor: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "#F6F6F6"
                : "#fff"
            }`,
            zIndex: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "1"
                : "0"
            }`,
          }}
          key={index}>
          {index === 0 ? (
            <div className={styles.childTd}>
              <p>{<CellElementGeneratorForTable field={col} row={item} />}</p>
            </div>
          ) : (
            <CellElementGeneratorForTable field={col} row={item} />
          )}
        </td>
      ))}
      <td
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "5px",
          backgroundColor: "#fff",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          position: "sticky",
          right: 0,
          outline: "#EAECF0 1px solid",
          border: "none",
        }}>
        <button
          style={{
            width: "34px",
            minHeight: "34px",
            border: "1px solid #D0D5DD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/main/${appId}/object/${tableSlug}/templates?id=${item?.guid}&menuId=${menuId}`
            );
          }}>
          <ArticleIcon style={{color: "#429424"}} />
        </button>
        <RectangleIconButton color="error" onClick={() => deleteHandler(item)}>
          <DeleteIcon color="error" />
        </RectangleIconButton>
      </td>
    </tr>
  );
}

export default ItemsRow;
