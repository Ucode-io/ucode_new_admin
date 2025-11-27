import ClearIcon from "@mui/icons-material/Clear";
import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import {
  useApiCategoryCreateMutation,
  useApiCategoryUpdateMutation,
} from "../../../../../services/apiCategoryService";
import { store } from "../../../../../store";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import CreateButton from "../../../../Buttons/CreateButton";
import SaveButton from "../../../../Buttons/SaveButton";
import FRow from "../../../../FormElements/FRow";
import HFTextField from "../../../../FormElements/HFTextField";

const ApiFolderCreateModal = ({ folder, closeModal, formType }) => {
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const dispatch = useDispatch();
  const createType = formType === "CREATE";

  const { control, handleSubmit } = useForm({
    defaultValues: createType
      ? { project_id: company.projectId, environment_id: company.environmentId }
      : folder,
  });

  const { mutate: createCategory, isLoading: createLoading } =
    useApiCategoryCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["API_CATEGORIES"]);
        dispatch(showAlert("Successfully created", "success"));
        closeModal();
      },
    });

  const { mutate: updateKey, isLoading: updateLoading } =
    useApiCategoryUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["API_CATEGORIES"]);
        dispatch(showAlert("Successfully update", "success"));
        closeModal();
      },
    });

  const onSubmit = (values) => {
    if (createType)
      createCategory({
        ...values,
        projectId: company.projectId,
      });
    else updateKey(values);
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
            <FRow label={"Title"}>
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="name"
              />
            </FRow>
            <FRow label={"Base url"}>
              <HFTextField
                autoFocus
                fullWidth
                label="Base url"
                control={control}
                name="base_url"
              />
            </FRow>

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

export default ApiFolderCreateModal;
