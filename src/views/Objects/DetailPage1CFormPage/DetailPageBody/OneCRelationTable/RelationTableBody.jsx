import React from "react";
import styles from "./style.module.scss";
import CellElementGenerator from "../../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams} from "react-router-dom";
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import constructorObjectService from "../../../../../services/constructorObjectService";
import {useQueryClient} from "react-query";
import {showAlert} from "../../../../../store/alert/alert.thunk";

function RelationTableBody({
  columns,
  item,
  view,
  menuItem,
  index,
  offset,
  limit,
  relatedTableSlug,
  refetch = () => {},
}) {
  const {appId, tableSlug} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentPage = offset === 0 ? 1 : offset + 1;

  const deleteHandler = async (row) => {
    try {
      await constructorObjectService.delete(relatedTableSlug, row.guid);
      refetch();
      dispatch(showAlert("Successfully created!", "success"));
    } finally {
    }
  };

  return (
    <tr
      style={{cursor: "pointer"}}
      key={item.guid}
      className={styles.child_row}>
      <td style={{textAlign: "center"}}>
        {limit === "all" ? index + 1 : currentPage + index}
      </td>
      {columns?.map((col, index) => (
        <td
          onClick={() => {
            navigate(
              `/main/${appId}/1c/${view?.relation_table_slug}/${item?.guid}?menuId=${menuItem?.id}`,
              {
                state: {
                  label: item?.[col?.slug],
                },
              }
            );
          }}
          style={{height: "35px"}}
          //   style={{
          //     position: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "sticky"
          //         : "relative"
          //     }`,
          //     left: view?.attributes?.fixedColumns?.[col?.id]
          //       ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
          //       : "0",
          //     backgroundColor: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "#F6F6F6"
          //         : "#fff"
          //     }`,
          //     zIndex: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "1"
          //         : "0"
          //     }`,
          //   }}
          key={index}>
          <CellElementGenerator row={item} field={col} />
        </td>
      ))}
      <td style={{textAlign: "center", padding: "0"}}>
        <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
          <RectangleIconButton
            color="error"
            onClick={() => deleteHandler(item, index)}>
            <Delete color="error" />
          </RectangleIconButton>
        </PermissionWrapperV2>
      </td>
    </tr>
  );
}

export default RelationTableBody;
