import {Box, Card, Modal, Typography} from "@mui/material";
import CreateButton from "../../components/Buttons/CreateButton";
import SaveButton from "../../components/Buttons/SaveButton";
import {useParams, useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import HFTextField from "../../components/FormElements/HFTextField";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import {useQueryClient} from "react-query";
import {useEffect, useState} from "react";
import menuSettingsService from "../../services/menuSettingsService";
import ClearIcon from "@mui/icons-material/Clear";
import {useSelector} from "react-redux";
import HFSwitch from "../../components/FormElements/HFSwitch";
import menuService from "../../services/menuService";
const flex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  columnGap: "6px",
};
const WikiFolderCreateModal = ({
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
}) => {
  const {projectId} = useParams();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const languages = useSelector((state) => state.languages.list);

  const onSubmit = (data) => {
    updateType(data);
  };

  const {control, handleSubmit, reset, watch} = useForm({
    defaultValues: {
      app_id: appId,
    },
  });

  const updateType = (data, selectedFolder) => {
    menuSettingsService
      .update({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
        type: modalType === "WIKI_UPDATE" ? "WIKI" : "WIKI_FOLDER",
        attributes: {
          ...data.attributes,
          wiki_id: data.wiki_id,
        },
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], selectedFolder?.id);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    menuSettingsService
      .getById(selectedFolder.id, projectId)
      .then((res) => {
        reset(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [modalType]);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

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
              {languages?.map((language) => {
                const languageFieldName = `attributes.label_${language?.slug}`;
                const fieldValue = watch(languageFieldName);

                return (
                  <HFTextField
                    autoFocus
                    fullWidth
                    label={`Title (${language?.slug})`}
                    control={control}
                    name={`attributes.label_${language?.slug}`}
                    defaultValue={fieldValue || menuItem?.label}
                  />
                );
              })}
            </Box>
            <Box style={flex}>
              <Typography variant="h6">Is visible:</Typography>
              <HFSwitch
                control={control}
                name="is_visible"
                disabledHelperText
              />
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

export default WikiFolderCreateModal;
