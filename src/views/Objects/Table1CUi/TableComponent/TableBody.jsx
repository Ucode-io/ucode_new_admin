import {CircularProgress} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useFilters from "../../../../hooks/useFilters";
import useTabRouter from "../../../../hooks/useTabRouter";
import hasValidFilters from "../../../../utils/hasValidFilters";
import {mergeStringAndState} from "../../../../utils/jsonPath";
import ChildRows from "./ChildRows";
import FiltersRow from "./FiltersRow";
import FolderRow from "./FolderRow";
import ItemsRow from "./ItemsRow";
import AddRow from "../../DetailPage1CFormPage/DetailPageTable/AddRow";
import AddIcon from "@mui/icons-material/Add";

function TableBody({
  folders,
  columns,
  view,
  menuItem,
  searchText,
  setFolderIds,
  folderIds,
  offset,
  control,
  refetch = () => {},
}) {
  const {tableSlug, appId} = useParams();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [folderHierarchy, setFolderHierarchy] = useState([]);
  const [foldersState, setFoldersState] = useState(folders);
  const [addRow, setAddRow] = useState(false);

  const {filters} = useFilters(tableSlug, view.id);
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const location = useLocation();
  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();

  const pageName =
    location?.pathname.split("/")[location.pathname.split("/")?.length - 1];

  const handleFolderDoubleClick = (folder) => {
    setFolderIds((prev) => [...prev, folder?.id]);
    setCurrentFolder(folder);
    setBreadcrumbs([...breadcrumbs, folder]);
    if (folder?.id) {
      localStorage.setItem("folder_id", folder?.id);
    }
  };

  const handleBackClick = () => {
    const updatedBreadcrumbs = breadcrumbs.slice(0, -1);
    setBreadcrumbs(updatedBreadcrumbs);
    setCurrentFolder(
      updatedBreadcrumbs[updatedBreadcrumbs?.length - 1] || null
    );
    if (!updatedBreadcrumbs?.length) {
      localStorage.removeItem("folder_id");
    }
  };

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      navigate(
        `/main/${appId}/1c/${tableSlug}/${row?.guid}?menuId=${menuItem?.id}`,
        {
          state: {
            label: row?.label || row?.title,
          },
        }
      );
    }
  };

  const addNewRow = () => {
    setAddRow(!addRow);
  };

  useEffect(() => {
    const folderMap = {};
    const rootFolders = [];
    const rootItems = [];

    foldersState?.forEach((folder) => {
      folderMap[folder.id] = {...folder, children: [], items: {response: []}};
    });

    foldersState
      ?.filter((item) => item?.id)
      ?.forEach((folder) => {
        if (folder.parent_id) {
          if (folderMap[folder.parent_id]) {
            folderMap[folder.parent_id].children.push(folderMap[folder.id]);
          }
        } else {
          rootFolders.push(folderMap[folder.id]);
        }
      });

    foldersState?.forEach((folder) => {
      if (folder.items?.response) {
        folder.items.response.forEach((item) => {
          if (item.folder_id && folderMap[item.folder_id]) {
            folderMap[item.folder_id].items.response.push(item);
          } else {
            rootItems.push(item);
          }
        });
      }
    });

    setFolderHierarchy([...rootFolders, ...rootItems]);
  }, [foldersState]);

  useEffect(() => {
    if (!currentFolder?.id) {
      localStorage.removeItem("folder_id");
    }
  }, [currentFolder]);

  useEffect(() => {
    setFoldersState(folders);
  }, [folders]);

  const renderRows = (items, level = 0) => {
    return items?.map((item, index) => {
      if (item.type === "FOLDER") {
        return (
          <React.Fragment key={item.id}>
            <FolderRow
              pageName={pageName}
              tableSettings={tableSettings}
              view={view}
              level={level}
              columns={columns}
              item={item}
              handleFolderDoubleClick={handleFolderDoubleClick}
              index={index}
              offset={offset}
            />
          </React.Fragment>
        );
      } else {
        return (
          <ItemsRow
            view={view}
            tableSettings={tableSettings}
            pageName={pageName}
            navigateToDetailPage={navigateToDetailPage}
            columns={columns}
            level={level}
            item={item}
            menuItem={menuItem}
            index={index}
            offset={offset}
            control={control}
          />
        );
      }
    });
  };

  if (hasValidFilters(filters) || Boolean(searchText)) {
    return (
      <tbody>
        {foldersState?.length ? (
          foldersState?.map((item, index) => (
            <FiltersRow
              navigateToDetailPage={navigateToDetailPage}
              columns={columns}
              tableSettings={tableSettings}
              pageName={pageName}
              view={view}
              item={item}
              menuItem={menuItem}
              index={index}
            />
          ))
        ) : (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CircularProgress sx={{color: "#449424"}} size={50} />
          </div>
        )}
      </tbody>
    );
  }

  if (currentFolder) {
    const {children, items} = currentFolder;
    const hasItems = items && items.response && items.response.length > 0;
    const hasChildren = children && children.length > 0;

    return (
      <tbody>
        <ChildRows
          handleBackClick={handleBackClick}
          currentFolder={currentFolder}
          renderRows={renderRows}
          navigateToDetailPage={navigateToDetailPage}
          columns={columns}
          hasChildren={hasChildren}
          hasItems={hasItems}
          items={items}
          children={children}
          tableSettings={tableSettings}
          pageName={pageName}
          handleFolderDoubleClick={handleFolderDoubleClick}
          setFoldersState={setFoldersState}
          menuItem={menuItem}
          folderIds={folderIds}
          setFolderIds={setFolderIds}
        />
      </tbody>
    );
  }

  return (
    <>
      <tbody>
        {foldersState?.length ? (
          <>{renderRows(folderHierarchy)}</>
        ) : (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CircularProgress sx={{color: "#449424"}} size={50} />
          </div>
        )}
        {!addRow && (
          <tr>
            <td
              onClick={addNewRow}
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
        {addRow && (
          <AddRow
            fields={columns}
            relatedTableSlug={tableSlug}
            view={view}
            data={[]}
            setAddRow={setAddRow}
            padding={"6px"}
            refetch={refetch}
          />
        )}
      </tbody>
    </>
  );
}

export default TableBody;
