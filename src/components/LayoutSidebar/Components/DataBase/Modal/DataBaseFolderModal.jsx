import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import { store } from "../../../../../store";
import {
  useTableFolderCreateMutation,
  useTableFolderUpdateMutation,
} from "../../../../../services/tableFolderService";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import CreateButton from "../../../../Buttons/CreateButton";
import SaveButton from "../../../../Buttons/SaveButton";
import HFTextField from "../../../../FormElements/HFTextField";

const DataBaseFolderCreateModal = ({
  closeModal,
  tableFolder = {},
  formType,
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const company = store.getState().company;

  const { control, handleSubmit } = useForm({
    defaultValues:
      formType === "PARENT"
        ? {
            parent_id: tableFolder?.id,
          }
        : tableFolder,
  });

  const { mutate: create, isLoading: createLoading } =
    useTableFolderCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["TABLE_FOLDER"]);
        closeModal();
        dispatch(showAlert("Success", "success"));
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    useTableFolderUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["TABLE_FOLDER"]);
        closeModal();
        dispatch(showAlert("Success", "success"));
      },
    });

  const onSubmit = (values) => {
    if (formType === "EDIT")
      update({ ...values, envId: company.environmentId });
    else create({ ...values, envId: company.environmentId });
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {!tableFolder ? "Create folder" : "Edit folder"}
            </Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <form className="form">
            <HFTextField
              autoFocus
              fullWidth
              label="Title"
              control={control}
              name="title"
            />

            <div className="btns-row">
              {!tableFolder ? (
                <CreateButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading}
                />
              ) : (
                <SaveButton
                  onClick={handleSubmit(onSubmit)}
                  loading={updateLoading}
                />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default DataBaseFolderCreateModal;
