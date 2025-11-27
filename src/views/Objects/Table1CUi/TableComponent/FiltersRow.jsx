import React from "react";
import styles from "./style.module.scss";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import {useNavigate, useParams} from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useQueryClient} from "react-query";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

function FiltersRow({
  columns,
  tableSettings,
  pageName,
  view,
  item,
  menuItem,
  index,
}) {
  const {tableSlug, appId} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteHandler = async (row) => {
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      dispatch(showAlert("Successfully created!", "success"));
    } finally {
    }
  };

  return (
    <tr
      key={item.guid}
      className={styles.child_row}
      style={{paddingLeft: "40px", cursor: "pointer"}}>
      <td
        style={{
          textAlign: "center",
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
        {index + 1}
      </td>
      {columns.map((col, index) => (
        <td
          onClick={() => {
            navigate(
              `/main/${appId}/1c/${tableSlug}/${item?.guid}?menuId=${menuItem?.id}`,
              {
                state: {
                  label: item[col?.slug],
                },
              }
            );
          }}
          style={{
            cursor: "pointer",
            position: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "sticky"
                : "relative"
            }`,
            left: view?.attributes?.fixedColumns?.[col?.id]
              ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
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
              <p>{item[col.slug]}</p>
            </div>
          ) : (
            item[col.slug]
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
              `/main/${appId}/object/${tableSlug}/templates?id=${item?.guid}&menuId=${menuItem?.id}`
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

export default FiltersRow;
