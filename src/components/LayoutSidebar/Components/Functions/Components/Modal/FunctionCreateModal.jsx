import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import CreateButton from "../../../../../Buttons/CreateButton";
import SaveButton from "../../../../../Buttons/SaveButton";
import HFTextField from "../../../../../FormElements/HFTextField";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../../store/alert/alert.thunk";
import {
  useFunctionCreateMutation,
  useFunctionUpdateMutation,
} from "../../../../../../services/functionService";
import HFTextArea from "../../../../../FormElements/HFTextArea";
import FRow from "../../../../../FormElements/FRow";

const FunctionCreateModal = ({ folder, func, closeModal }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      function_folder_id: folder?.id,
      ...func,
    },
  });

  const { mutate: createFunction, isLoading: createLoading } =
    useFunctionCreateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successful added new function", "success"));
        queryClient.refetchQueries("FUNCTIONS");
        closeModal();
      },
    });

  const { mutate: updateFunction, isLoading: updateLoading } =
    useFunctionUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successful update function", "success"));
        queryClient.refetchQueries("FUFUNCTIONS");
        closeModal();
      },
    });

  const onSubmit = (values) => {
    if (func?.id) updateFunction(values);
    else createFunction(values);
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {!folder ? "Create function" : "Edit function"}
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
            <FRow label="Name">
              <HFTextField autoFocus fullWidth control={control} name="name" />
            </FRow>
            <FRow label="Description">
              <HFTextArea
                autoFocus
                fullWidth
                control={control}
                name="description"
              />
            </FRow>
            <FRow label="Path">
              <HFTextField autoFocus fullWidth control={control} name="path" />
            </FRow>

            <div className="btns-row">
              {!folder ? (
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

export default FunctionCreateModal;
