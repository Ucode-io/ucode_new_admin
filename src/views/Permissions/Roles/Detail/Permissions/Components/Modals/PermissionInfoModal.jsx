import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Modal, Typography } from "@mui/material";
import styles from './styles.module.scss'

const PermissionInfoModal = ({
    modalData,
  closeModal,
}) => {
  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">{modalData.title}</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box className="form" style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {modalData.image && (<img src={modalData.image} alt="admin" style={{maxWidth: "600px"}} />)}
            <div
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: modalData.content,
            }}
          />
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default PermissionInfoModal;
