import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import { Box, Card, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useMenuUpdateMutation } from "../../services/menuService";
import CancelButton from "../Buttons/CancelButton";
import CreateButton from "../Buttons/CreateButton";
import SaveButton from "../Buttons/SaveButton";
import FolderTreeView from "./TreeView";
import "./style.scss";

const FolderModal = ({
  closeModal,
  modalType,
  loading,
  menuList,
  element,
  getMenuList,
}) => {
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState();
  const [check, setCheck] = useState(false);

  const { mutateAsync: updateMenu, isLoading: createLoading } =
    useMenuUpdateMutation({
      onSuccess: () => {
        closeModal();
        queryClient.refetchQueries(["MENU"], element?.id);
        getMenuList();
      },
    });
  const createType = () => {
    updateMenu({
      parent_id: folder,
      id: element?.id,
      type: element?.type,
      icon: element?.icon || undefined,
      label: element?.label || undefined,
      table: element?.data?.table || undefined,
      microfrontend: element?.data?.microfrontend || undefined,
      table_id: element?.table_id || undefined,
      microfrontend_id: element?.microfrontend_id || undefined,
    });
  };

  const handleSelect = (e, itemId) => {
    setFolder(itemId);
    setCheck(true);
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "create" ? "Select folder" : "Select folder"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>
          <Box className="tree_view">
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{
                height: "100%",
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
                padding: "10px",
              }}
              onNodeSelect={handleSelect}
            >
              {/* {renderTree(menuList?.menus[0])} */}
              <TreeItem
                nodeId={"c57eedc3-a954-4262-a0af-376c65b5a284"}
                label={"Root"}
              >
                {menuList?.map((item) => (
                  <FolderTreeView
                    element={item}
                    setCheck={setCheck}
                    check={check}
                    folder={folder}
                  />
                ))}
              </TreeItem>
            </TreeView>
          </Box>
          <div className="folder_btns-row">
            <CancelButton onClick={closeModal} />
            {modalType === "typeCreate" ? (
              <CreateButton onClick={() => createType()} loading={loading} />
            ) : (
              <SaveButton
                onClick={() => createType()}
                loading={loading}
                disabled={!folder}
              />
            )}
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default FolderModal;
