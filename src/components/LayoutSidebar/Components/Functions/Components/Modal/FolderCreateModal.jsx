import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import CreateButton from "../../../../../Buttons/CreateButton";
import SaveButton from "../../../../../Buttons/SaveButton";
import HFTextField from "../../../../../FormElements/HFTextField";
import {
  useFunctionFolderCreateMutation,
  useFunctionFolderUpdateMutation,
} from "../../../../../../services/functionFolderService";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../../store/alert/alert.thunk";

const FunctionFolderCreateModal = ({ folder, closeModal }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm({
    defaultValues: folder,
  });

  const { mutate: createFolder, isLoading: createLoading } =
    useFunctionFolderCreateMutation({
      onSuccess: () => {
        closeModal();
        dispatch(showAlert("Successful added new folder", "success"));
        queryClient.refetchQueries("FUNCTION_FOLDERS");
      },
    });

  const { mutate: updateFolder, isLoading: updateLoading } =
    useFunctionFolderUpdateMutation({
      onSuccess: () => {
        closeModal();
        dispatch(showAlert("Successful updated folder", "success"));
        queryClient.refetchQueries("FUNCTION_FOLDERS");
      },
    });

  const onSubmit = (values) => {
    if (!folder) createFolder(values);
    else updateFolder(values);
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {!folder ? "Create folder" : "Edit folder"}
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
              {!folder ? (
                <CreateButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default FunctionFolderCreateModal;
