import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import { useQueries, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useNoteFolderDeleteMutation,
  useNoteFoldersListQuery,
} from "../../../../services/noteFolderService";
import noteService from "../../../../services/noteService";
import {
  useTemplateFolderDeleteMutation,
  useTemplateFoldersListQuery,
} from "../../../../services/templateFolderService";
import templateService from "../../../../services/templateService";
import { store } from "../../../../store";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { listToNested } from "../../../../utils/listToNestedList";
import "../../style.scss";
import DocumentButtonMenu from "./Components/DocumentsButtonMenu";
import NoteFolderCreateModal from "./Components/Modals/NoteFolderCreate";
import TemplateFolderCreateModal from "./Components/Modals/TemplateFolderCreate";
import DocumentsRecursive from "./RecursiveBlock";
import { TbEdit } from "react-icons/tb";
import { FaFolder } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const docsFolder = {
  label: "Documents",
  type: "USER_FOLDER",
  icon: "documents.svg",
  parent_id: adminId,
  id: "17",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const DocumentsSidebar = ({
  level = 1,
  menuStyle,
  setSubMenuIsOpen,
  menuItem,
  setElement,
  setSelectedApp,
  sidebarIsOpen,
  setSidebarIsOpen,
}) => {
  const dispatch = useDispatch();
  const company = store.getState().company;
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [selected, setSelected] = useState({});
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const [menu, setMenu] = useState({ event: "", type: "" });
  const openMenu = Boolean(menu?.event);

  const handleOpenNotify = (event, type, element) => {
    setMenu({ event: event?.currentTarget, type: type, element });
  };

  const handleCloseNotify = () => {
    setMenu(null);
  };

  const [openedTemplateFolders, setOpenedTemplateFolders] = useState([]);
  const [openedNoteFolders, setOpenedNoteFolders] = useState([]);

  const [templateFolderModalType, setTemplateFolderModalType] = useState(null);
  const [noteFolderModalType, setNoteFolderModalType] = useState(null);

  const [selectedTemplateFolder, setSelectedTemplateFolder] = useState(null);
  const [selectedNoteFolder, setSelectedNoteFolder] = useState(null);

  const queryClient = useQueryClient();

  const openTemplateFolderModal = (folder, type) => {
    setSelectedTemplateFolder(folder);
    setTemplateFolderModalType(type);
  };

  const openNoteFolderModal = (folder, type) => {
    setSelectedNoteFolder(folder);
    setNoteFolderModalType(type);
  };

  const closeTemplateFolderModal = () => setTemplateFolderModalType(false);
  const closeNoteFolderModal = () => setNoteFolderModalType(false);

  const activeStyle = {
    borderRadius: "10px",
    backgroundColor:
      docsFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      docsFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    // paddingLeft: updateLevel(level),
  };

  const labelStyle = {
    flex: sidebarIsOpen ? 1 : 0,
    color:
      docsFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  // --TEMPLATE FOLDERS QUERY--

  const { data: templateFolders, isLoading: foldersLoading } =
    useTemplateFoldersListQuery({
      params: {
        "project-id": projectId,
      },
      envId: company.environmentId,
      queryParams: {
        select: (res) =>
          res.folders?.map((folder) => ({
            ...folder,
            icon: FaFolder,
            type: "FOLDER",
            what_is: "template",
            hasChild: true,
            name: folder?.title,
            // buttons: (
            //   <BsThreeDots
            //     size={13}
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       handleOpenNotify(e, "TEMPLATE");
            //     }}
            //   />
            // ),
          })),
      },
    });

  // --NOTE FOLDERS QUERY--

  const { data: noteFolders, isLoading: noteFoldersLoading } =
    useNoteFoldersListQuery({
      params: {
        "project-id": projectId,
      },
      envId: company.environmentId,
      queryParams: {
        select: (res) =>
          res.folders?.map((folder) => ({
            ...folder,
            icon: FaFolder,
            type: "FOLDER",
            hasChild: true,
            what_is: "note",
            name: folder?.title,
          })),
      },
    });

  // --TEMPLATE QUERIES--

  const templateQueries = useMemo(() => {
    return openedTemplateFolders.map((folderId) => ({
      queryKey: [
        "TEMPLATES",
        {
          "folder-id": folderId,
          "project-id": projectId,
          envId: company.environmentId,
        },
      ],
      queryFn: () =>
        templateService.getList(
          { "folder-id": folderId, "project-id": projectId },
          company.environmentId
        ),
    }));
  }, [openedTemplateFolders, projectId]);

  const templateQueryResults = useQueries(templateQueries);

  const templates = useMemo(() => {
    const list = [];
    templateQueryResults.forEach((query) => {
      query.data?.templates?.forEach((template) => {
        list.push({
          ...template,
          parent_id: template.folder_id,
          icon: CgFileDocument,
          what_is: "template",
          name: template?.title,
        });
      });
    });
    return list;
  }, [templateQueryResults]);

  // --NOTE QUERIES--

  const noteQueries = useMemo(() => {
    return openedNoteFolders.map((folderId) => ({
      queryKey: [
        "NOTES",
        {
          "folder-id": folderId,
          "project-id": projectId,
          envId: company.environmentId,
        },
      ],
      queryFn: () =>
        noteService.getList(
          { "folder-id": folderId, "project-id": projectId },
          company.environmentId
        ),
    }));
  }, [openedNoteFolders, projectId]);

  const noteQueryResults = useQueries(noteQueries);

  const notes = useMemo(() => {
    const list = [];
    noteQueryResults.forEach((query) => {
      query.data?.notes?.forEach((note) => {
        list.push({
          ...note,
          parent_id: note.folder_id,
          icon: CgFileDocument,
          what_is: "note",
          name: note?.title,
        });
      });
    });
    return list;
  }, [templateQueryResults]);

  // --SIDEBAR ELEMENTS--

  const computedTemplatesList = useMemo(() => {
    return listToNested([...(templateFolders ?? []), ...templates], {
      undefinedChildren: true,
    });
  }, [templateFolders, templates]);

  const computedNotesList = useMemo(() => {
    return listToNested([...(noteFolders ?? []), ...notes], {
      undefinedChildren: true,
    });
  }, [noteFolders, notes]);

  const sidebarElements = useMemo(
    () => [
      {
        id: 1,
        name: "Templates",
        icon: CgFileDocument,
        children: computedTemplatesList,
        type: "FOLDER",
        buttons: (
          <>
            <AddIcon
              size={13}
              onClick={(e) => {
                e?.stopPropagation();
                createFolder("template");
              }}
            />
          </>
        ),
        button_text: "Create Template folder",
      },
      {
        id: 2,
        name: "Wiki",
        icon: TbEdit,
        children: computedNotesList,
        type: "FOLDER",
        buttons: (
          <>
            <AddIcon
              size={13}
              onClick={(e) => {
                e?.stopPropagation();
                createFolder("note");
              }}
            />
          </>
        ),
        button_text: "Create Note folder",
      },
    ],
    [computedTemplatesList, computedNotesList]
  );

  // --IS LOADING--

  const isLoading = useMemo(() => {
    return (
      foldersLoading ||
      templateQueryResults.some((query) => query.isLoading) ||
      noteFoldersLoading ||
      noteQueryResults.some((query) => query.isLoading)
    );
  }, [
    templateQueryResults,
    foldersLoading,
    noteFoldersLoading,
    noteQueryResults,
  ]);

  const { mutate: deleteNoteFolder, isLoading: deleteNoteLoading } =
    useNoteFolderDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully deleted", "success"));
        queryClient.refetchQueries("NOTE_FOLDERS");
      },
    });
  const { mutate: deleteTemplateFolder, isLoading: deleteTemplateLoading } =
    useTemplateFolderDeleteMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully deleted", "success"));
        queryClient.refetchQueries("TEMPLATE_FOLDERS");
      },
    });

  const rowClickHandler = (id, element) => {
    dispatch(menuActions.setMenuItem(element));
    if (id === 1 || id === 2) {
      if (element.children === null) {
        element.name === "Templates"
          ? setTemplateFolderModalType("CREATE")
          : setNoteFolderModalType("CREATE");
      } else if (element.children === null) {
        element.name === "Notes"
          ? setNoteFolderModalType("CREATE")
          : setTemplateFolderModalType("CREATE");
      }
    }
    if (
      element.type !== "FOLDER" ||
      openedNoteFolders.includes(id) ||
      openedTemplateFolders.includes(id)
    )
      return;
    if (element.what_is === "template") {
      setOpenedTemplateFolders((prev) => [...prev, id]);
    } else if (element.what_is === "note") {
      setOpenedNoteFolders((prev) => [...prev, id]);
    }
    if (element.type === "FOLDER") {
      navigate(`/main/31a91a86-7ad3-47a6-a172-d33ceaebb35f`);
    }
  };

  const clickHandler = (e) => {
    e.stopPropagation();
    setSubMenuIsOpen(true);
    dispatch(menuActions.setMenuItem(docsFolder));
    setSelected(docsFolder);

    setChildBlockVisible((prev) => !prev);
    // navigate(`/main/${adminId}`);
  };

  // --CREATE FOLDERS--

  const createFolder = (element) => {
    element === "note"
      ? setNoteFolderModalType("CREATE")
      : setTemplateFolderModalType("CREATE");
  };
  const onSelect = (id, element) => {
    setSelected(element);
    if (element.type !== "FOLDER" && element.what_is === "template") {
      navigate(`/main/${adminId}/docs/template/${element?.id}/${id}`);
    } else if (element.type !== "FOLDER" && element.what_is === "note") {
      navigate(`/main/${adminId}/docs/note/${element?.id}/${id}`);
      setSubMenuIsOpen(false);
    }
  };

  return (
    <>
      {sidebarElements?.map((element) => (
        <DocumentsRecursive
          key={element.id}
          level={level + 1}
          element={element}
          menuStyle={menuStyle}
          onRowClick={rowClickHandler}
          selected={selected}
          handleOpenNotify={handleOpenNotify}
          onSelect={onSelect}
          setSelected={setSelected}
          menuItem={menuItem}
        />
      ))}

      <DocumentButtonMenu
        selected={selected}
        openMenu={openMenu}
        menu={menu?.event}
        menuType={menu?.type}
        element={menu?.element}
        handleCloseNotify={handleCloseNotify}
        templateFolderModalType={templateFolderModalType}
        deleteNoteFolder={deleteNoteFolder}
        deleteTemplateFolder={deleteTemplateFolder}
      />

      {templateFolderModalType && (
        <TemplateFolderCreateModal
          modalType={templateFolderModalType}
          folder={selectedTemplateFolder}
          closeModal={closeTemplateFolderModal}
        />
      )}
      {noteFolderModalType && (
        <NoteFolderCreateModal
          modalType={noteFolderModalType}
          folder={selectedNoteFolder}
          closeModal={closeNoteFolderModal}
        />
      )}
    </>
  );
};

export default DocumentsSidebar;
