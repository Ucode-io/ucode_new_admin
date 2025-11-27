import { Box, Card, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import HFTextField from "../../../components/FormElements/HFTextField";
import CreateButton from "../../../components/Buttons/CreateButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { store } from "../../../store";
import { showAlert } from "../../../store/alert/alert.thunk";
import {
  useRoleCreateMutation,
  useRoleGetByIdQuery,
  useRoleUpdateMutation,
} from "../../../services/roleServiceV2";

const RoleCreateModal = ({ closeModal, modalType, roleId }) => {
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const projectId = store.getState().company.projectId;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      client_type_id: clientId,
      "project-id": projectId,
    },
  });

  const { isLoading } = useRoleGetByIdQuery({
    id: roleId,
    queryParams: {
      enabled: Boolean(modalType === "UPDATE"),
      onSuccess: (res) => {
        reset(res.data.response);
      },
    },
  });

  const { mutateAsync: createRole, isLoading: createLoading } =
    useRoleCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_ROLE_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });
  const { mutateAsync: updateRole, isLoading: updateLoading } =
    useRoleUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_ROLE_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });

  const onSubmit = (data) => {
    if (modalType === "NEW") {
      createRole(data);
    } else {
      updateRole({ ...data, roleId: roleId });
    }
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "NEW" ? "Create role" : "Edit role"}
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

          <form action="" className="form">
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="name"
                required
              />
            </Box>

            <div className="btns-row">
              {modalType === "NEW" ? (
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

export default RoleCreateModal;
