import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect} from "react";
import styles from "./style.module.scss";
import {useQuery, useQueryClient} from "react-query";
import {useNavigate, useParams} from "react-router-dom";
import newTableService from "../../../../services/newTableService";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import {Box, CircularProgress} from "@mui/material";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import constructorObjectService from "../../../../services/constructorObjectService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {useDispatch} from "react-redux";

const ChildRows = ({
  columns,
  view,
  tableSettings,
  pageName,
  currentFolder,
  hasItems,
  items,
  handleBackClick,
  handleFolderDoubleClick,
  setFoldersState,
  menuItem,
  folderIds,
  setFolderIds,
}) => {
  const {tableSlug, appId} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const {data: {foldersList, count} = {data: []}, isLoading} = useQuery(
    ["GET_FOLDER_LIST_SINGLE", {tableSlug, currentFolder}],
    () => {
      return newTableService.getFolderList({
        table_id: menuItem?.table_id,
        parent_id: folderIds?.[folderIds?.length - 1],
      });
    },
    {
      enabled: Boolean(currentFolder?.id),
      cacheTime: 10,
      select: (res) => {
        const foldersList = res?.folder_groups ?? [];
        const count = res?.count;
        return {
          foldersList,
          count,
        };
      },
    }
  );

  const deleteHandler = async (row) => {
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      queryClient.refetchQueries(["GET_FOLDER_LIST"]);
      queryClient.refetchQueries(["GET_FOLDER_LIST_SINGLE"]);
      dispatch(showAlert("Successfully created!", "success"));
    } finally {
    }
  };

  const deleteHandlerFolder = (id) => {
    return newTableService.deleteFolder(id).then((res) => {
      queryClient.refetchQueries(["GET_FOLDER_LIST_SINGLE"]);
    });
  };

  useEffect(() => {
    if (foldersList?.length) {
      setFoldersState((prevFolders) => {
        const existingIds = new Set(prevFolders.map((folder) => folder.id));
        const uniqueNewFolders = foldersList.filter(
          (folder) => !existingIds.has(folder.id)
        );
        return [...prevFolders, ...uniqueNewFolders];
      });
    }
  }, [foldersList]);

  return (
    <>
      <tr
        onClick={() => {
          handleBackClick();
          setFolderIds((prevIds) => prevIds.slice(0, -1));
        }}
        style={{cursor: "pointer"}}
        className={styles.back_row}>
        <td colSpan={columns.length}>
          <button className={styles.back_btn}>
            <span>
              <ArrowBackIcon />
            </span>
            <div className={styles.current_folder_name}>
              <span className={styles.folder_icon}>
                <img src="/img/folder_icon.svg" alt="" />
              </span>
              {currentFolder.name}
            </div>
          </button>
        </td>
      </tr>
      {hasItems ? (
        !isLoading ? (
          <>
            {foldersList?.map((item) => (
              <tr
                onClick={() => handleFolderDoubleClick(item)}
                className={styles.group_row}
                style={{paddingLeft: `20px`, cursor: "pointer"}}>
                <td></td>
                {columns.map((col, index) => (
                  <td
                    style={{
                      position: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[col?.id]
                        ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
                        : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                          ? "#F6F6F6"
                          : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                          ? "1"
                          : "0"
                      }`,
                    }}
                    key={index}>
                    {index === 0 ? (
                      <div className={styles.td_row}>
                        <span
                          style={{marginLeft: `30px`}}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "5px",
                    backgroundColor: "#fff",
                    position: "sticky",
                    right: 0,
                    outline: "#EAECF0 1px solid",
                    border: "none",
                    height: "45px",
                  }}>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteHandlerFolder(item?.id)}>
                    <DeleteIcon color="error" />
                  </RectangleIconButton>
                </td>
              </tr>
            ))}
            {items.response.map((item) => (
              <tr
                onClick={() => {
                  navigate(
                    `/main/${appId}/1c/${tableSlug}/${item?.guid}?menuId=${menuItem?.id}`
                  );
                }}
                key={item.guid}
                className={styles.child_row}
                style={{paddingLeft: "40px", cursor: "pointer"}}>
                <td></td>
                {columns.map((col, index) => (
                  <td
                    style={{
                      position: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                          ? "sticky"
                          : "relative"
                      }`,
                      left: view?.attributes?.fixedColumns?.[col?.id]
                        ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
                        : "0",
                      backgroundColor: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                          ? "#F6F6F6"
                          : "#fff"
                      }`,
                      zIndex: `${
                        tableSettings?.[pageName]?.find(
                          (item) => item?.id === col?.id
                        )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
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
                    position: "sticky",
                    right: 0,
                    outline: "#EAECF0 1px solid",
                    border: "none",
                    height: "45px",
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
                      // navigate(
                      //   `/main/${appId}/object/${tableSlug}/templates?id=${item?.guid}&menuId=${menuItem?.id}`
                      // );
                    }}>
                    <ArticleIcon style={{color: "#429424"}} />
                  </button>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteHandler(item)}>
                    <DeleteIcon color="error" />
                  </RectangleIconButton>
                </td>
              </tr>
            ))}
          </>
        ) : (
          <Box
            sx={{
              position: "absolute",
              height: "50%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CircularProgress sx={{color: "#449424"}} size={50} />
          </Box>
        )
      ) : (
        <tr>
          <td
            style={{paddingLeft: "60px"}}
            colSpan={columns.length}
            className={styles.empty_state}>
            No items found in this folder.
          </td>
        </tr>
      )}
    </>
  );
};

export default ChildRows;
