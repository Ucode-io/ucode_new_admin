import ClearIcon from "@mui/icons-material/Clear";
import {Box, Card, Modal, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import SaveButton from "../../components/Buttons/SaveButton";
import constructorTableService from "../../services/constructorTableService";
import menuSettingsService from "../../services/menuSettingsService";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFTextField from "../../components/FormElements/HFTextField";
import HFAutocomplete from "../../components/FormElements/HFAutocomplete";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import menuService from "../../services/menuService";

const TableLinkModal = ({closeModal, loading, selectedFolder, getMenuList}) => {
  const {projectId} = useParams();
  const queryClient = useQueryClient();
  const [tables, setTables] = useState();
  const languages = useSelector((state) => state.languages.list);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const {control, handleSubmit, reset, watch} = useForm();

  const tableOptions = useMemo(() => {
    return tables?.tables?.map((item, index) => ({
      label: item.label,
      value: item.id,
    }));
  }, [tables]);

  const onSubmit = (data) => {
    if (selectedFolder.type === "TABLE") {
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
        type: "TABLE",
        table_id: data?.table_id,
        label: Object.values(data?.attributes).find((item) => item),
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

  const getTables = (search) => {
    constructorTableService
      .getList({
        search: search || undefined,
      })
      .then((res) => {
        setTables(res);
      });
  };

  useEffect(() => {
    if (selectedFolder.type === "TABLE")
      menuSettingsService
        .getById(selectedFolder.id, projectId)
        .then((res) => {
          reset(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [selectedFolder]);

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

  useEffect(() => {
    getTables();
  }, []);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Attach to table</Typography>
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
                    required
                    name={`attributes.label_${language?.slug}`}
                    defaultValue={fieldValue || menuItem?.label}
                  />
                );
              })}
            </Box>
            <Box display={"flex"} columnGap={"16px"} className="form-elements">
              <HFAutocomplete
                name="table_id"
                control={control}
                placeholder="Tables"
                fullWidth
                required
                options={tableOptions}
                onFieldChange={(e) => {
                  getTables(e.target.value);
                }}
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

export default TableLinkModal;
