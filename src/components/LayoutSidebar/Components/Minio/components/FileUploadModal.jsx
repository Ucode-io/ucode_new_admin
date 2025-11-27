import { Box, Card, CircularProgress, Modal, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadWithDrag from "../../../../Upload/FileUploadWithDrag";
import fileService from "../../../../../services/fileService";
import { useState } from "react";
import { useQueryClient } from "react-query";
const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const FileUploadModal = ({ closeModal, menuItem }) => {
  const queryClient = useQueryClient();
  const [loader, setLoader] = useState(false);
  const onUpload = (data) => {
    setLoader(true);
    fileService
      .folderUpload(data, { folder_name: menuItem?.attributes?.path })
      .then(() => {
        setLoader(false);
        closeModal();
        queryClient.refetchQueries(["MINIO_OBJECT"]);
      })
      .catch(() => {})
      .finally(() => setLoader(false));
  };
  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Add file</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box padding={4} style={flex}>
            {loader ? (
              <CircularProgress />
            ) : (
              <FileUploadWithDrag onUpload={onUpload} />
            )}
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default FileUploadModal;
