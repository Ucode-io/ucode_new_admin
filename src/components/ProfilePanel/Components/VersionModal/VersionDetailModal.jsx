import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useReleasesCreateMutation } from "../../../../services/releaseService";
import { store } from "../../../../store";
import HFSelect from "../../../FormElements/HFSelect";
import FRow from "../../../FormElements/FRow";
import HFTextField from "../../../FormElements/HFTextField";
import CreateButton from "../../../Buttons/CreateButton";

const releaseTypes = [
  {
    label: "Major 1.0.0",
    value: 1,
  },
  {
    label: "Minor 0.1.0",
    value: 2,
  },
  {
    label: "Patch 0.0.1",
    value: 3,
  },
];

const VersionDetailModal = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const envId = store.getState().company.environmentId;
  const projectId = store.getState().company.projectId;

  const onSubmit = (values) => {
    createRelease({
      ...values,
      release_type: Number(values.release_type),
    });
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      is_current: false,
      project_id: projectId,
      envId: envId,
    },
  });

  const { mutate: createRelease, isLoading } = useReleasesCreateMutation({
    onSuccess: () => {
      queryClient.refetchQueries(["RELEASES"]);
      closeModal();
    },
  });

  return (
    <div>
      <Modal open className="child-position-center">
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Version create</Typography>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "8px",
              }}
            >
              <ClearIcon
                color="primary"
                onClick={closeModal}
                width="46px"
                style={{
                  cursor: "pointer",
                }}
              />
            </Box>
          </div>
          <form className="form">
            <FRow label="Release type" mb={4}>
              <HFSelect
                fullWidth
                label="Release type"
                control={control}
                name="release_type"
                required
                options={releaseTypes}
              />
            </FRow>
            <FRow label="Description" mb={4}>
              <HFTextField
                fullWidth
                control={control}
                required
                name="description"
              />
            </FRow>
            <div className="btns-row">
              <CreateButton
                onClick={handleSubmit(onSubmit)}
                loading={isLoading}
              />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default VersionDetailModal;
