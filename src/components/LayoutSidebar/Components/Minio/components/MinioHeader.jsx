import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFilesDeleteMutation } from "../../../../../services/fileService";
import { store } from "../../../../../store";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { useQueryClient } from "react-query";

const MinioHeader = ({ menuItem, openModal, minios, selectedCards }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteFiles, isLoading: updateLoading } =
    useFilesDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["MINIO_OBJECT"]);
      },
    });
  const deleteFileElements = () => {
    deleteFiles({
      objects: selectedCards?.map((item) => ({
        object_id: item?.id,
        object_name: item?.file_name_disk,
      })),
    });
  };

  return (
    <>
      <Box className={style.header}>
        <Box className={style.leftside}>
          <div className={style.foldericon}>
            <FolderOpenIcon />
          </div>
          <Typography variant="h3">{menuItem?.label}</Typography>
        </Box>
        <Box className={style.rightside}>
          <Typography variant="h5" className={style.itemtitle}>
            {minios?.count || "0"} Items
          </Typography>
          <Tooltip title="Create folder">
            <div className={style.createicon}>
              <CreateNewFolderIcon />
            </div>
          </Tooltip>
          {selectedCards?.length ? (
            <Tooltip title="Delete">
              <div
                className={style.deleteicon}
                onClick={() => deleteFileElements()}
              >
                <DeleteOutlineIcon />
              </div>
            </Tooltip>
          ) : null}
          <Tooltip title="Create item">
            <div className={style.addicon} onClick={openModal}>
              <AddIcon />
            </div>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default MinioHeader;
