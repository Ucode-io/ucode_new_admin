import {Box, Card, Modal, Typography} from "@mui/material";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import {useParams} from "react-router-dom";
import {useForm, useWatch} from "react-hook-form";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import {useQueryClient} from "react-query";
import {useEffect} from "react";
import menuSettingsService from "../../services/menuSettingsService";
import ClearIcon from "@mui/icons-material/Clear";
import {useSelector} from "react-redux";
import HFTextFieldWithMultiLanguage from "../../components/FormElements/HFTextFieldWithMultiLanguage";

const FolderCreateModal = ({
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
  getMenuList,
}) => {
  const {projectId} = useParams();
  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    if (modalType === "create") {
      createType(data, selectedFolder);
    } else if (modalType === "parent") {
      createType(data, selectedFolder);
    } else if (modalType === "update") {
      updateType(data);
    }
  };

  const {control, handleSubmit, reset, watch} = useForm({
    defaultValues: {
      app_id: appId,
    },
  });
  const tableName = useWatch({
    control,
    name: "label",
  });

  const languages = useSelector((state) => state.languages.list);

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type:
          selectedFolder?.id === "744d63e6-0ab7-4f16-a588-d9129cf959d1" ||
          selectedFolder?.type === "WIKI_FOLDER"
            ? "WIKI_FOLDER"
            : selectedFolder?.type === "MINIO_FOLDER"
              ? "MINIO_FOLDER"
              : "FOLDER",
        label: Object.values(data?.attributes).find((item) => item),
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        getMenuList();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateType = (data, selectedFolder) => {
    menuSettingsService
      .update({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        getMenuList();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (modalType === "update")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [modalType]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "create" || modalType === "parent"
                ? "Create folder"
                : "Edit folder"}
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
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFIconPicker name="icon" control={control} />

              <Box
                style={{
                  display: "flex",
                  gap: "6px",
                  height: "100%",
                  width: "100%",
                }}>
                <HFTextFieldWithMultiLanguage
                  control={control}
                  name="attributes.label"
                  fullWidth
                  placeholder="Name"
                  defaultValue={tableName}
                  languages={languages}
                  id={"folder_create"}
                />
              </Box>
            </Box>

            <div className="btns-row">
              {modalType === "crete" ? (
                <CreateButton type="submit" loading={loading} />
              ) : (
                <SaveButton type="submit" loading={loading} />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default FolderCreateModal;
