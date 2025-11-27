import { Box, Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import SaveButton from "../../components/Buttons/SaveButton";
import HFTextField from "../../components/FormElements/HFTextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useCompanyCreateMutation } from "../../services/companyService";
import { useQueryClient } from "react-query";
const CompanyModal = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm();

  const { mutateAsync: createCompany, isLoading: createLoading } =
    useCompanyCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["COMPANY"]);
        closeModal();
      },
    });

  const onSubmit = (value) => {
    createCompany(value);
  };
  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Create company</Typography>
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
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="name"
              />
            </Box>
            <div className="btns-row">
              <SaveButton title="Add" type="submit" />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default CompanyModal;
