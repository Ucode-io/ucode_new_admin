import {Close} from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {TreeView} from "@mui/x-tree-view";
import {useEffect, useMemo, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect";
import HFRelationFieldSetting from "../../../../../components/FormElements/HFRelationFieldSetting";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import HFTextFieldWithMultiLanguage from "../../../../../components/FormElements/HFTextFieldWithMultiLanguage";
import constructorFieldService, {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "../../../../../services/constructorFieldService";
import constructorTableService from "../../../../../services/constructorTableService";
import constructorViewService from "../../../../../services/constructorViewService";
import {useMenuListQuery} from "../../../../../services/menuService";
import {
  fieldButtons,
  fieldTypesOptions,
} from "../../../../../utils/constants/fieldTypes";
import {generateGUID} from "../../../../../utils/generateID";
import Attributes from "./Attributes";
import AttributesButton from "./Attributes/AttributesButton";
import DefaultValueBlock from "./Attributes/DefaultValueBlock";
import FieldTreeView from "./FieldTreeView";
import styles from "./style.module.scss";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";

const FieldSettings = ({
  closeSettingsBlock,
  mainForm,
  selectedTabIndex,
  field,
  formType,
  height,
  isTableView = false,
  onSubmit = () => {},
  getRelationFields,
  slug,
  menuItem,
}) => {
  const {id, appId, tableSlug} = useParams();
  const {handleSubmit, control, reset, watch, setValue} = useForm();
  const [formLoader, setFormLoader] = useState(false);

  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const {i18n} = useTranslation();
  const [check, setCheck] = useState(false);
  const [folder, setFolder] = useState("");
  const [drawerType, setDrawerType] = useState("SCHEMA");
  const [selectedField, setSelectedField] = useState(null);

  const detectorID = useMemo(() => {
    if (id) {
      return id;
    } else {
      return menuItem?.table_id;
    }
  }, [id, slug]);

  const updateFieldInform = (field) => {
    const fields = mainForm.getValues("fields");
    const index = fields.findIndex((el) => el.id === field.id);

    mainForm.setValue(`fields[${index}]`, field);
    onSubmit(index, field);
  };

  const prepandFieldInForm = (field) => {
    const fields = mainForm.getValues("fields") ?? [];
    mainForm.setValue(`fields`, [field, ...fields]);
  };
  const tableName = useWatch({
    control,
    name: "label",
  });

  const {
    data: {views, columns, relationColumns} = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", {tableSlug}],
    () => {
      if (!tableSlug) return false;
      return constructorTableService.getTableInfo(tableSlug, {
        data: {limit: 10, offset: 0, app_id: appId},
      });
    },
    {
      enabled: Boolean(!!tableSlug),
      select: ({data}) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const computedFilteredFields = useMemo(() => {
    return columns?.map((item) => ({
      label: item?.label || item?.attributes?.[`label_${i18n?.language}`],
      value: item?.slug,
      type: item?.type,
      options: item?.type === "MULTISELECT" ? item?.attributes?.options : [],
      table_slug: item?.table_slug,
      attributes: {...item?.attributes},
    }));
  }, [columns]);

  const {mutate: createNewField, isLoading: createLoading} =
    useFieldCreateMutation({
      onSuccess: (res) => {
        prepandFieldInForm(res);
        closeSettingsBlock(null);
        getRelationFields();
        addColumnToView(res);
      },
    });
  const {mutate: updateOldField, isLoading: updateLoading} =
    useFieldUpdateMutation({
      onSuccess: (res) => {
        updateFieldInform(field);
        closeSettingsBlock(null);
        getRelationFields();
      },
    });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
      label: field?.attributes?.[`label_${i18n?.language}`],
      show_label: true,
    };
    if (id || menuItem?.table_id) {
      createNewField({data, tableSlug: slug || tableSlug});
    } else {
      prepandFieldInForm(data);
      closeSettingsBlock();
    }
  };

  const addColumnToView = (data) => {
    if (isTableView) {
      const computedValues = {
        ...views[selectedTabIndex],
        columns: [...views[selectedTabIndex].columns, data?.id],
      };

      constructorViewService.update(slug, computedValues).then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
    }
  };

  const {data: backetOptions} = useMenuListQuery({
    params: {
      parent_id: "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9",
    },
  });
  const updateField = (field) => {
    if (id || menuItem?.table_id) {
      updateOldField({data: field, tableSlug: tableSlug});
    } else {
      updateFieldInform(field);
      closeSettingsBlock();
    }
  };

  const handleSelect = (e, item) => {
    setValue("attributes.path", item);
    setCheck(true);
    setFolder(item);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      attributes: {
        ...values?.attributes,
        number_of_rounds: parseInt(values?.attributes?.number_of_rounds),
      },
    };

    if (formType === "CREATE") createField(data);
    else updateField(data);
  };

  const selectedAutofillTableSlug = useWatch({
    control,
    name: "autofill_table",
  });

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  });
  const fieldType = useWatch({
    control: control,
    name: "type",
  });

  const selectedAutofillSlug = selectedAutofillTableSlug?.split("#")?.[0];
  const selectedAutofillFieldSlug = selectedAutofillTableSlug?.split("#")?.[1];

  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map((table) => ({
      value: `${table.id?.split("#")?.[0]}#${table?.field_from}`,
      label: table.label,
    }));
  }, [layoutRelations]);

  const computedMultiSelectOptions =
    selectedField?.options ?? selectedField?.attributes?.options;

  const {data: computedRelationFields} = useQuery(
    ["GET_TABLE_FIELDS", selectedAutofillSlug],
    () => {
      if (!selectedAutofillSlug) return [];
      return constructorFieldService.getList({
        table_slug: selectedAutofillSlug,
        with_one_relation: true,
      });
    },
    {
      select: (res) => {
        const fields = res?.fields ?? [];
        const oneRelationFields = res?.data?.one_relation_fields ?? [];

        return [...fields, ...oneRelationFields]
          .filter(
            (field) => field.type !== "LOOKUPS" && field?.type !== "LOOKUP"
          )
          .map((el) => ({
            value: el?.path_slug ? el?.path_slug : el?.slug,
            label: el?.label,
          }));
      },
    }
  );

  useEffect(() => {
    const values = {
      attributes: {},
      default: "",
      index: "string",
      label: "",
      required: false,
      slug: "",
      table_id: detectorID,
      type: "",
      relation_field: selectedAutofillFieldSlug,
    };
    if (formType !== "CREATE") {
      reset({
        ...values,
        ...field,
      });
      setFolder(field?.attributes?.path);
    } else {
      reset(values);
    }
  }, [field, formType, id, menuItem?.table_id, reset]);

  const getOnchangeField = (element) => {
    setSelectedField(element);
  };

  useEffect(() => {
    setSelectedField(() =>
      columns?.find((item) => item?.slug === field?.attributes?.hide_path_field)
    );
  }, [columns]);

  const numberTypeOptions = [
    {
      label: "Max",
      value: "max",
    },
    {
      label: "Min",
      value: "min",
    },
  ];

  return (
    <div className={styles.settingsBlock}>
      <Box className={styles.additional}>
        {fieldButtons.map((item) => (
          <Button
            className={
              item.value === drawerType ? styles.active : styles.inactive
            }
            onClick={() => setDrawerType(item.value)}>
            {item.label}
          </Button>
        ))}
        <AttributesButton
          control={control}
          watch={watch}
          mainForm={mainForm}
          button={
            <Button
              className={
                drawerType === "ATTRIBUTES" ? styles.active : styles.inactive
              }
              onClick={() => setDrawerType("ATTRIBUTES")}>
              Field
            </Button>
          }
        />
      </Box>
      <Divider orientation="vertical" />
      <Box className={styles.form}>
        <div className={styles.settingsBlockHeader}>
          <Typography variant="h4">
            {formType === "CREATE" ? "Create field" : "Edit field"}
          </Typography>
          <IconButton onClick={closeSettingsBlock}>
            <Close />
          </IconButton>
        </div>

        <div className={styles.settingsBlockBody} style={{height}}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className={styles.fieldSettingsForm}>
            <Card>
              {drawerType === "SCHEMA" && (
                <Box className="p-2">
                  <FRow label="Type" required classname={styles.custom_label}>
                    <HFSelect
                      disabledHelperText
                      name="type"
                      control={control}
                      options={fieldTypesOptions}
                      optionType="GROUP"
                      placeholder="Type"
                      required
                      defaultValue={fieldType}
                      className={styles.input}
                    />
                  </FRow>
                  <FRow label="Name" classname={styles.custom_label} required>
                    <Box style={{display: "flex", gap: "6px"}}>
                      <HFTextFieldWithMultiLanguage
                        control={control}
                        name="attributes.label"
                        fullWidth
                        placeholder="Name"
                        defaultValue={tableName}
                        languages={languages}
                        id={"field_label"}
                      />
                    </Box>
                  </FRow>
                  <FRow label="Key" required classname={styles.custom_label}>
                    <HFTextField
                      className={styles.input}
                      disabledHelperText
                      fullWidth
                      name="slug"
                      control={control}
                      placeholder="Field SLUG"
                      required
                      withTrim
                      id={"field_key"}
                    />
                  </FRow>

                  <DefaultValueBlock control={control} />

                  {(fieldType === "FILE" ||
                    fieldType === "VIDEO" ||
                    fieldType === "PHOTO" ||
                    fieldType === "CUSTOM_IMAGE") && (
                    <FRow
                      label="Backet"
                      required
                      classname={styles.custom_label}
                      extra={
                        <>
                          <Typography variant="h6">
                            Selected folder: {folder}
                          </Typography>
                        </>
                      }>
                      <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultSelected={folder}
                        onNodeSelect={handleSelect}
                        style={{
                          border: "1px solid #D4DAE2",
                        }}>
                        {backetOptions?.menus?.map((item) => (
                          <FieldTreeView
                            element={item}
                            setCheck={setCheck}
                            check={check}
                            folder={folder}
                          />
                        ))}
                      </TreeView>
                    </FRow>
                  )}
                  {(fieldType === "SINGLE_LINE" ||
                    fieldType === "MULTI_LINE") && (
                    <HFCheckbox
                      control={control}
                      name="enable_multilanguage"
                      label="Multi language"
                      className="mb-1"
                    />
                  )}
                </Box>
              )}

              {drawerType === "ATTRIBUTES" && (
                <Attributes
                  control={control}
                  watch={watch}
                  mainForm={mainForm}
                />
              )}

              {drawerType === "VALIDATION" && (
                <div className="p-2">
                  <Box mt={1}>
                    <Box className={styles.formrow}>
                      <FRow label="RegEx" classname={styles.custom_label}>
                        <HFTextField
                          className={styles.input}
                          fullWidth
                          name="attributes.validation"
                          control={control}
                        />
                      </FRow>
                      <FRow
                        label="Error message"
                        classname={styles.custom_label}>
                        <HFTextField
                          className={styles.input}
                          fullWidth
                          name="attributes.validation_message"
                          control={control}
                        />
                      </FRow>
                    </Box>
                    <Box className={styles.checkbox}>
                      <HFCheckbox
                        control={control}
                        name="attributes.disabled"
                        label="Disabled"
                        labelClassName={styles.custom_label}
                      />
                      <HFCheckbox
                        control={control}
                        name="required"
                        label="Required"
                        labelClassName={styles.custom_label}
                      />
                      <HFCheckbox
                        control={control}
                        name="unique"
                        label="Duplicate"
                        labelClassName={styles.custom_label}
                      />
                    </Box>
                  </Box>
                </div>
              )}
              {drawerType === "AUTOFILL" && (
                <div className="p-2">
                  <Box mt={1}>
                    <FRow
                      label="Autofill table"
                      classname={styles.custom_label}>
                      <HFSelect
                        disabledHelperText
                        name="autofill_table"
                        control={control}
                        options={computedRelationTables}
                        placeholder="Type"
                        className={styles.input}
                      />
                    </FRow>

                    <FRow
                      label="Autofill field"
                      classname={styles.custom_label}>
                      <HFSelect
                        disabledHelperText
                        name="autofill_field"
                        control={control}
                        options={computedRelationFields}
                        placeholder="Type"
                        className={styles.input}
                      />
                    </FRow>
                    <HFCheckbox
                      control={control}
                      name="automatic"
                      label="Automatic"
                      labelClassName={styles.custom_label}
                    />
                  </Box>
                </div>
              )}

              {drawerType === "FIELD_HIDE" && (
                <div className="p-2">
                  <Box mt={1}>
                    <FRow
                      label="Hide Field From"
                      classname={styles.custom_label}>
                      <HFSelect
                        disabledHelperText
                        name="attributes.hide_path_field"
                        control={control}
                        options={computedFilteredFields}
                        placeholder="Type"
                        className={styles.input}
                        getOnchangeField={getOnchangeField}
                      />
                    </FRow>

                    {selectedField?.type === "MULTISELECT" ? (
                      <HFMultipleSelect
                        options={computedMultiSelectOptions}
                        disabledHelperText
                        name="attributes.hide_path"
                        control={control}
                        placeholder="Type"
                        className={styles.input}
                      />
                    ) : selectedField?.type === "LOOKUP" ? (
                      <HFRelationFieldSetting
                        disabledHelperText
                        name="attributes.hide_path"
                        control={control}
                        placeholder="Type"
                        className={styles.input}
                        selectedField={selectedField}
                      />
                    ) : selectedField?.type === "NUMBER" ? (
                      <>
                        <FRow label="Hide Value">
                          <HFNumberField
                            type={"number"}
                            disabledHelperText
                            name="attributes.hide_path"
                            control={control}
                            placeholder="Hide "
                            className={styles.input}
                          />
                        </FRow>
                        <FRow label="Number range">
                          <HFSelect
                            options={numberTypeOptions}
                            disabledHelperText
                            name="attributes.type"
                            control={control}
                            placeholder="Type"
                            className={styles.input}
                          />
                        </FRow>
                      </>
                    ) : (
                      <HFTextField
                        disabledHelperText
                        name="attributes.hide_path"
                        control={control}
                        placeholder="Type"
                        className={styles.input}
                      />
                    )}
                  </Box>
                </div>
              )}
            </Card>
          </form>

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{width: "100%"}}
              onClick={handleSubmit(submitHandler)}
              loader={formLoader || createLoading || updateLoading}>
              Save
            </PrimaryButton>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default FieldSettings;
