import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useQueryFolderCreateMutation,
  useQueryFolderUpdateMutation,
} from "../../../../../services/query.service";
import HFTextField from "../../../../FormElements/HFTextField";
import CreateButton from "../../../../Buttons/CreateButton";
import SaveButton from "../../../../Buttons/SaveButton";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { store } from "../../../../../store";

const QueryFolderCreateModal = ({ folder, closeModal, formType }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const createType = formType === "CREATE";  
  const company = store.getState().company;


  const { control, handleSubmit } = useForm({
    defaultValues: createType
      ? {
          parent_id: folder?.id,
        }
      : folder,
  });

  const { mutate: create, isLoading: createLoading } =
    useQueryFolderCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["QUERY_FOLDERS"]);
        dispatch(showAlert("Success", "success"));
        closeModal();
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    useQueryFolderUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Success", "success"));
        queryClient.refetchQueries(["QUERY_FOLDERS"]);
        closeModal();
      },
    });

  const onSubmit = (values) => {
    if (!createType) update(values);
    else create({...values, project_id:company.project_id });
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {createType ? "Create folder" : "Edit folder"}
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
              {createType ? (
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

export default QueryFolderCreateModal;
