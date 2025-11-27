import React from "react";
import styles from "./style.module.scss";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import DeleteIcon from "@mui/icons-material/Delete";
import newTableService from "../../../../services/newTableService";
import {useQueryClient} from "react-query";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";

function FolderRow({
  pageName,
  tableSettings,
  view,
  level,
  columns,
  item,
  handleFolderDoubleClick,
  index,
  offset,
}) {
  const queryClient = useQueryClient();
  const deleteHandler = (id) => {
    return newTableService.deleteFolder(id).then((res) => {
      queryClient.refetchQueries(["GET_FOLDER_LIST"]);
    });
  };
  return (
    <tr
      onClick={() => handleFolderDoubleClick(item, level)}
      className={styles.group_row}
      style={{paddingLeft: `${(level + 1) * 20}px`}}>
      <td
        style={{
          textAlign: "center",
          position: "sticky",
          left: "0",
          zIndex: 2,
          outline: "#EAECF0 1px solid",
          border: "none",
          background: "#F9FAFB",
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
                ? "#F9FAFB"
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
            <div className={styles.td_row}>
              <span
                style={{marginLeft: `${level * 30}px`}}
                className={styles.folder_icon}>
                <img src="/img/folder_icon.svg" alt="" />
              </span>
              <p>{item.name}</p>
            </div>
          ) : (
            item[col.slug]
          )}
        </td>
      ))}

      <td
        style={{
          padding: "5px",
          borderRight: "none",
          position: "sticky",
          right: 0,
          outline: "#EAECF0 1px solid",
          border: "none",
          textAlign: "center",
        }}>
        <RectangleIconButton
          color="error"
          onClick={() => deleteHandler(item?.id)}>
          <DeleteIcon color="error" />
        </RectangleIconButton>
      </td>
    </tr>
  );
}

export default FolderRow;
