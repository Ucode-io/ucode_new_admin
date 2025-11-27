import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useScenarioCategoryCreateMutation,
  useScenarioCategoryUpdateMutation,
} from "../../../../../../services/scenarioCategory";
import { store } from "../../../../../../store";
import CreateButton from "../../../../../Buttons/CreateButton";
import SaveButton from "../../../../../Buttons/SaveButton";
import HFTextField from "../../../../../FormElements/HFTextField";

const FolderCreateModal = ({ closeModal, modalType, folder }) => {
  const createType = modalType === "CREATE";
  const company = store.getState().company;
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm({
    defaultValues: createType
      ? {
          project_id: company.projectId,
          attributes: {},
          envId: company.environmentId,
        }
      : {
          ...folder,
        },
  });

  const { mutate: create, isLoading: createLoading } =
    useScenarioCategoryCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["SCENARIO_CATEGORIES"]);
        closeModal();
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    useScenarioCategoryUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["SCENARIO_CATEGORIES"]);
        closeModal();
      },
    });

  const onSubmit = (values) => {
    if (!createType) update(values);
    else create(values);
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

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <HFTextField
              autoFocus
              fullWidth
              label="Title"
              control={control}
              name="name"
              required
            />

            <div className="btns-row">
              {modalType === "crete" ? (
                <CreateButton
                  type="submit"
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  type="submit"
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

export default FolderCreateModal;
