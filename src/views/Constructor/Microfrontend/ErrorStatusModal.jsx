import { Box, Button, Modal } from '@mui/material';
import React, { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: '#000',
  border: '0',
  boxShadow: 24,
  p: 1,
  borderRadius: "10px",
  outline: 'none',
  zIndex: 1000,
  height: "80vh",
  overflow: "scroll"
};

export default function ErrorStatusModal({ setOpenModal, element }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(element?.error_message);
    setIsCopied(true);
  }

  return (
    <Modal
      open={true}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{
          width: "100%",
          height: "100%",
          overflow: "auto"
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
            <Button variant='outlined' onClick={copyToClipboard}>
              {isCopied ? "Copied" : "Copy"}
            </Button>
          </Box>
          <pre style={{ whiteSpace: 'pre-wrap', color: "#FFF" }}>
            {element?.error_message ?? "No data!"}
          </pre>
        </Box>
      </Box>
    </Modal>
  )
}
