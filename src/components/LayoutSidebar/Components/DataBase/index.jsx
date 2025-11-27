import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { useQueries, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import constructorTableService, {
  useTableFolderListQuery,
} from "../../../../services/constructorTableService";
import { useResourceListQuery } from "../../../../services/resourceService";
import { store } from "../../../../store";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import useComputedResource from "../../../../utils/computedTables";
import { tableFolderListToNested } from "../../../../utils/tableFolderListToNestedLIst copy";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import DataBaseRecursive from "./RecursiveBlock";
import { FaFolder } from "react-icons/fa";
import { BsTable, BsThreeDots } from "react-icons/bs";
import DataBaseFolderCreateModal from "./Modal/DataBaseFolderModal";
import DatabaseButtonMenu from "./DatabaseButtonMenu";
import { useTableFolderDeleteMutation } from "../../../../services/tableFolderService";
import DataBaseTableForm from "./Drawer/DataBaseTableForm";
import { updateLevel } from "../../../../utils/level";
import activeStyles from "../MenuUtils/activeStyles";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const dataBase = {
  label: "Databases",
  type: "USER_FOLDER",
  icon: "database.svg",
  parent_id: adminId,
  id: "15",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const DataBase = ({ level = 1, menuStyle, setSubMenuIsOpen }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [selected, setSelected] = useState({});
  const [resourceId, setResourceId] = useState("");
  const company = store.getState().company;
  const [openedFolders, setOpenedFolders] = useState([]);
  const navigate = useNavigate();
  const [selectedTableFolder, setSelectedTableFolder] = useState(null);
  const [tablefolderModalType, setTableFolderModalType] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedResource, setSelectedResource] = useState();
  const closeTableFolderModal = () => setTableFolderModalType(null);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openMenu = Boolean(menu?.event);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const menuItem = useSelector((state) => state.menu.menuItem);
  const activeStyle = activeStyles({ menuItem, element: dataBase, menuStyle, level });

  const openCreateDrawer = (resourceId) => {
    setSelectedResource(resourceId);
    setDrawerIsOpen(true);
  };

  const openEditDrawer = (tableId, resourceId) => {
    setSelectedResource(resourceId);
    setSelectedTable(tableId);
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setSelectedResource(null);
    setSelectedTable(null);
    setDrawerIsOpen(false);
  };

  const openFolderModal = (folder, type) => {
    setSelectedTableFolder(folder);
    setTableFolderModalType(type);
  };

  const handleOpenNotify = (event, type) => {
    setMenu({ event: event?.currentTarget, type: type });
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };



  const { data: { resources } = {}, refetch: refetchCategory } =
    useResourceListQuery({
      params: {
        project_id: company.projectId,
      },
    });

  const { mutate: deleteTableFolder } = useTableFolderDeleteMutation({
    onSuccess: () => {
      refetchCategory();
      queryClient.refetchQueries(["TABLE_FOLDER"]);
    },
  });

  const onDeleteTableFolder = (id) => {
    deleteTableFolder(id);
  };

  const { data: folders, isLoading: loading } = useTableFolderListQuery();

  const fetchTable = useMemo(() => {
    return openedFolders.map((folderId) => ({
      queryKey: [
        "TABLES",
        {
          "folder-id": folderId,
        },
      ],
      queryFn: () =>
        constructorTableService.getList({
          folder_id: folderId,
        }),
    }));
  }, [openedFolders]);

  const tableResults = useQueries(fetchTable);

  const computedTables = useMemo(() => {
    const list = [];
    tableResults?.forEach((table) => {
      table.data?.tables?.forEach((table) => {
        list.push({
          ...table,
          name: table.label,
          icon: BsTable,
          parent_id: table.folder_id,
          type: "TABLE",
        });
      });
    });
    return list;
  }, [tableResults]);

  const computedFolders = useMemo(() => {
    const list = [];
    folders?.folders?.forEach((item) => {
      list.push({
        name: item?.title,
        icon: FaFolder,
        parent_id: item?.parent_id,
        id: item?.id,
        type: "FOLDER",
        hasChild: true,
        buttons: (
          <BsThreeDots
            size={13}
            onClick={(e) => {
              e?.stopPropagation();
              handleOpenNotify(e, "FOLDER");
              setSelected(item);
            }}
            style={{
              color:
                menuItem?.id === item?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text || "",
            }}
          />
        ),
      });
    });
    return list;
  }, [folders?.folders]);

  const computedTableList = useMemo(() => {
    return tableFolderListToNested(
      [...(computedFolders ?? []), ...computedTables],
      {
        undefinedChildren: true,
      }
    );
  }, [computedFolders, computedTables]);

  const sidebarElements = useMemo(() => computedTableList, [computedTableList]);

  const createFolder = () => {
    setTableFolderModalType("CREATE");
  };

  const computedResourceFromUtils = useComputedResource(
    resources,
    sidebarElements,
    menuItem,
    menuStyle,
    createFolder,
    openEditDrawer
  );
  
  const rowClickHandler = (id, element) => {
    setSelected(element);
    element.type === "FOLDER" && navigate(`/main/${adminId}`);
    if (element.resource_type) setResourceId(element.id);
    if (element.type !== "FOLDER" || openedFolders.includes(id)) return;
    setOpenedFolders((prev) => [...prev, id]);
  };

  const onSelect = (id, element) => {
    if (element.type === "TABLE") {
      navigate(
        `/main/${adminId}/database/${resourceId}/${element.slug}/${element.id}`
      );
    }
  };

  return (
    <Box>
    
      <Collapse in={childBlockVisible} unmountOnExit>
        {computedResourceFromUtils?.map((childElement) => (
          <DataBaseRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onRowClick={rowClickHandler}
            onSelect={onSelect}
            selected={selected}
            resourceId={resourceId}
            menuItem={menuItem}
          />
        ))}
      </Collapse>

      <DatabaseButtonMenu
        selected={selected}
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        handleCloseNotify={handleCloseNotify}
        onDeleteTableFolder={onDeleteTableFolder}
        openFolderModal={openFolderModal}
        openCreateDrawer={openCreateDrawer}
      />

      {tablefolderModalType && (
        <DataBaseFolderCreateModal
          closeModal={closeTableFolderModal}
          tableFolder={selectedTableFolder}
          formType={tablefolderModalType}
        />
      )}
      <DataBaseTableForm
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        selectedResource={selectedResource}
        selectedTable={selectedTable}
        closeDrawer={closeDrawer}
      />
    </Box>
  );
};

export default DataBase;
