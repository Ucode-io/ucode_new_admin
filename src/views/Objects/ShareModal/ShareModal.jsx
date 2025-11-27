import {Button, Dialog} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import ShareContent from "./ShareModalContent/ShareContent";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styles from "./styles.module.scss";

function ShareModal({newTableView = false}) {
  const [open, setOpen] = useState(false);
  const {tableSlug} = useParams();
  const client_type_id = useSelector((state) => state.auth.clientType?.id);
  const role_id = useSelector((state) => state.auth.roleInfo?.id);
  const projectId = useSelector((state) => state.auth.projectId);

  const {control, reset, handleSubmit, watch, setValue} = useForm({
    defaultValues: {
      client_type: client_type_id,
      guid: role_id,
      project_id: projectId,
      table: {
        record_permissions: {},
        field_permissions: [],
        view_permissions: [],
        action_permissions: [],
        client_type_default: client_type_id,
        role_id_default: role_id,
        slug: tableSlug,
        id: "",
      },
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("guid", role_id);
    setValue("client_type", client_type_id);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="outlined"
        style={{
          borderColor: newTableView ? "#337E28" : "#A8A8A8",
          width: "35px",
          height: "35px",
          padding: "0px",
          minWidth: "35px",
        }}>
        <ShareIcon
          style={{
            color: newTableView ? "#337E28" : "#A8A8A8",
          }}
        />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialog}>
        <ShareContent
          handleClose={handleClose}
          control={control}
          reset={reset}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit}
        />
      </Dialog>
    </>
  );
}

export default ShareModal;
