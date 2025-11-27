import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Modal, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import SaveButton from "../../components/Buttons/SaveButton";
import HFSelect from "../../components/FormElements/HFSelect";
import menuSettingsService from "../../services/menuSettingsService";
import { useWebPagesListQuery } from "../../services/webpageService";
import { store } from "../../store";
import HFTextField from "../../components/FormElements/HFTextField";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import { useSelector } from "react-redux";

const WebPageLinkModal = ({
  closeModal,
  loading,
  selectedFolder,
  getMenuList,
}) => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const authStore = store.getState().auth;

  const onSubmit = (data) => {
    if (selectedFolder.type === "WEBPAGE") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (selectedFolder.type === "WEBPAGE")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "WEBPAGE",
        webpage_id: data?.webpage_id,
      })
      .then(() => {
        closeModal();
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        getMenuList();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateType = (data, selectedFolder) => {
    menuSettingsService
      .update({
        ...data,
      })
      .then(() => {
        closeModal();
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { data: pages } = useWebPagesListQuery({
    params: {
      "project-id": projectId,
    },
    envId: authStore.environmentId,
  });

  const microfrontendOptions = useMemo(() => {
    return pages?.web_pages?.map((item, index) => ({
      label: item.title,
      value: item.id,
    }));
  }, [pages]);

  const languages = useSelector((state) => state.languages.list);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Привязать web page</Typography>
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
              <HFIconPicker name="icon" control={control} />
              {
                languages?.map((item, index) => (
                  <HFTextField
                autoFocus
                fullWidth
                required
                label={`Title ${item.slug}`}
                control={control}
                name={`attributes.label_${item.slug}`}
              />
                ))
              }
              
            </Box>
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFSelect
                fullWidth
                label="Web pages"
                control={control}
                name="webpage_id"
                options={microfrontendOptions}
                required
              />
            </Box>

            <div className="btns-row">
              <SaveButton title="Add" type="submit" loading={loading} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default WebPageLinkModal;
