import ClearIcon from "@mui/icons-material/Clear";
import {Box, Button, Card, Modal, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import SaveButton from "../../components/Buttons/SaveButton";
import HFSelect from "../../components/FormElements/HFSelect";
import menuSettingsService from "../../services/menuSettingsService";
import {useMicrofrontendListQuery} from "../../services/microfrontendService";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFTextField from "../../components/FormElements/HFTextField";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import styles from "./style.module.scss";
import {store} from "../../store";
import {useSelector} from "react-redux";

const MicrofrontendLinkModal = ({
  closeModal,
  loading,
  selectedFolder,
  getMenuList,
}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit, reset} = useForm();

  const company = store.getState().company;
  const languages = useSelector((state) => state.languages.list);
  const {data: microfrontend} = useMicrofrontendListQuery();

  const {
    fields: values,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: "attributes.params",
  });

  const microfrontendOptions = useMemo(() => {
    return microfrontend?.functions?.map((item, index) => ({
      label: item.name,
      value: item.id,
    }));
  }, [microfrontend]);

  const addField = () => {
    append({
      key: "",
      value: "",
    });
  };

  const onSubmit = (data) => {
    if (selectedFolder.type === "MICROFRONTEND") {
      updateType(data, selectedFolder);
    } else {
      createType(data, selectedFolder);
    }
  };

  const createType = (data, selectedFolder) => {
    menuSettingsService
      .create({
        ...data,
        parent_id: selectedFolder?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "MICROFRONTEND",
        microfrontend_id: data?.microfrontend_id,
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
  const deleteField = (index) => {
    remove(index);
  };

  useEffect(() => {
    if (selectedFolder.type === "MICROFRONTEND")
      menuSettingsService
        .getById(selectedFolder.id, company.projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Привязать microfrontend</Typography>
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
              {languages?.map((item, index) => (
                <HFTextField
                  autoFocus
                  fullWidth
                  required
                  label={`Title ${item.slug}`}
                  control={control}
                  name={`attributes.label_${item.slug}`}
                />
              ))}
            </Box>
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFSelect
                fullWidth
                label="Microfrontend"
                control={control}
                name="microfrontend_id"
                options={microfrontendOptions}
                required
              />
            </Box>
            {values?.map((elements, index) => (
              <div key={elements?.key} className={styles.navigateWrap}>
                <HFTextField
                  fullWidth
                  control={control}
                  name={`attributes.params[${index}].key`}
                  placeholder={"key"}
                />
                <HFTextField
                  fullWidth
                  control={control}
                  name={`attributes.params[${index}].value`}
                  placeholder={"value"}
                />
                <RectangleIconButton
                  onClick={() => deleteField(index)}
                  color="error">
                  <Delete color="error" />
                </RectangleIconButton>
              </div>
            ))}
            <Button
              className={styles.button}
              variant="contained"
              fullWidth
              onClick={addField}>
              Add params
            </Button>
            <div className="btns-row">
              <SaveButton title="Add" type="submit" loading={loading} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default MicrofrontendLinkModal;
