import {Close} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import {useEffect, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFAutocomplete from "../../../../../components/FormElements/HFAutocomplete";
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import constructorCustomEventService from "../../../../../services/constructorCustomEventService";
import listToOptions from "../../../../../utils/listToOptions";
import request from "../../../../../utils/request";
import styles from "./style.module.scss";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import TableActions from "./TableActions";
import requestV2 from "../../../../../utils/requestV2";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import constructorFunctionService from "../../../../../services/constructorFunctionService";

const actionTypeList = [
  {label: "HTTP", value: "HTTP"},
  {label: "after", value: "after"},
  {label: "before", value: "before"},
];
const methodList = [
  {label: "GETLIST", value: "GETLIST"},
  {label: "UPDATE", value: "UPDATE"},
  {label: "CREATE", value: "CREATE"},
  {label: "DELETE", value: "DELETE"},
  {label: "MULTIPLE_UPDATE", value: "MULTIPLE_UPDATE"},
  {label: "APPEND_MANY2MANY", value: "APPEND_MANY2MANY"},
  {label: "DELETE_MANY2MANY", value: "DELETE_MANY2MANY"},
];

const typeList = [
  {label: "TABLE", value: "TABLE"},
  {label: "OBJECTID", value: "OBJECTID"},
  {label: "HARDCODE", value: "HARDCODE"},
];

const ActionSettings = ({
  closeSettingsBlock = () => {},
  onUpdate = () => {},
  onCreate = () => {},
  action,
  formType,
  height,
}) => {
  const {tableSlug} = useParams();

  const languages = useSelector((state) => state.languages.list);

  const [loader, setLoader] = useState(false);

  const {handleSubmit, control, reset, watch, setValue} = useForm({
    defaultValues: {
      table_slug: tableSlug,
    },
  });

  const action_type = watch("action_type");

  const {data: functions = []} = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      onError: (err) => {
        console.log("ERR =>", err);
      },
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    }
  );

  const createAction = (data) => {
    setLoader(true);

    constructorCustomEventService
      .create(data, tableSlug)
      .then((res) => {
        closeSettingsBlock();
        onCreate(res);
      })
      .catch(() => setLoader(false));
  };

  const updateAction = (data) => {
    setLoader(true);

    constructorCustomEventService
      .update(data, tableSlug)
      .then((res) => {
        closeSettingsBlock();
        onUpdate(data);
      })
      .catch(() => setLoader(false));
  };
  const {i18n} = useTranslation();
  const submitHandler = (values) => {
    const computedValues = {
      ...values,
      label:
        values?.attributes?.[`label_${i18n.language}`] ??
        Object.values(values?.attributes).find(
          (item) => typeof item === "string"
        ),
    };
    if (formType === "CREATE") createAction(computedValues);
    else updateAction(computedValues);
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset(action);
  }, [action, formType, reset]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create" : "Edit"} action</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{height}}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}>
          <div className="p-2">
            <FRow label="Icon" required>
              <HFIconPicker control={control} required name="icon" />
            </FRow>
            <FRow label="Label" required>
              <Box
                style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                {languages?.map((lang) => (
                  <HFTextField
                    name={`attributes.label_${lang?.slug}`}
                    control={control}
                    placeholder={`Label (${lang?.slug})`}
                    fullWidth
                  />
                ))}
              </Box>
            </FRow>
            <FRow label="Function" required>
              <HFAutocomplete
                name="event_path"
                control={control}
                placeholder="Event path"
                options={functions}
                disabled={false}
                required
              />
            </FRow>
            <FRow label="Redirect url">
              <HFTextField
                name="url"
                control={control}
                placeholder="Redirect url"
                options={functions}
                fullWidth
              />
            </FRow>
            <FRow label="Action type">
              <HFSelect
                name="action_type"
                control={control}
                placeholder="action type"
                options={actionTypeList}
                fullWidth
              />
            </FRow>
            <FRow label="Method">
              <HFSelect
                name="method"
                control={control}
                placeholder="Redirect url"
                options={methodList}
                fullWidth
              />
            </FRow>
            {action_type === "HTTP" && (
              <FRow label="Refresh">
                <HFSwitch name="attributes.use_refresh" control={control} />
              </FRow>
            )}

            <FRow label="No limit">
              <HFSwitch name="attributes.use_no_limit" control={control} />
            </FRow>

            <FRow label="Disabled">
              <HFSwitch name="disabled" control={control} />
            </FRow>

            <TableActions
              control={control}
              typeList={typeList}
              slug={tableSlug}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{width: "100%"}}
              onClick={handleSubmit(submitHandler)}
              loader={loader}>
              Save
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionSettings;
