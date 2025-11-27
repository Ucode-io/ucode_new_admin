import {Box} from "@mui/material";
import React from "react";
import {Controller} from "react-hook-form";
import QRCode from "react-qr-code";
import Modal from "@mui/material/Modal";

function HFQrForTableView({
  control,
  name,
  defaultValue,
  required,
  isDetailPage,
  handClick,
  qrRef,
  handModalClose,
  openModal,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Box>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Box>
            <QRCode
              ref={qrRef}
              onClick={handClick}
              style={{
                height: "auto",
                maxWidth: "100%",
                width: isDetailPage ? "50px" : "25px",
                cursor: "pointer",
              }}
              value={value ?? ""}
            />
          </Box>
        )}
      />

      <Modal open={openModal} onClose={handModalClose}>
        <Box sx={{...style}}>
          <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={{
              required: required ? "This is required field" : false,
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Box>
                <QRCode
                  ref={qrRef}
                  onClick={handClick}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  value={value ?? ""}
                />
              </Box>
            )}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default HFQrForTableView;
