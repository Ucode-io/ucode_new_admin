import listToOptions from "@/utils/listToOptions";
import {
  Close,
  DragIndicator,
  PushPin,
  PushPinOutlined,
  RemoveRedEye,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import RingLoaderWithWrapper from "../../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import constructorFunctionService from "../../../../../services/constructorFunctionService";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import constructorTableService from "../../../../../services/constructorTableService";
import { applyDrag } from "../../../../../utils/applyDrag";
import { relationTyes } from "../../../../../utils/constants/relationTypes";
import TableActions from "../Actions/TableActions";
import AutoFiltersBlock from "./AutoFiltersBlock";
import CascadingRelationSettings from "./CascadingRelationSettings.jsx";
import CascadingTreeBlock from "./CascadingTreeBlock";
import DefaultValueBlock from "./DefaultValueBlock";
import DynamicRelationsBlock from "./DynamicRelationsBlock";
import FunctionPath from "./FunctionPath";
import SummaryBlock from "./SummaryBlock";
import styles from "./style.module.scss";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SettingsIcon from "@mui/icons-material/Settings";
import BrushIcon from "@mui/icons-material/Brush";
import { F } from "@formulajs/formulajs";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const relationViewTypes = [
  {
    label: "Table",
    value: "TABLE",
  },
  {
    label: "Input",
    value: "INPUT",
  },
];

const RelationSettingsTest = ({
  closeSettingsBlock = () => {},
  relation,
  getRelationFields,
  formType,
  height,
}) => {
  const { appId, tableSlug } = useParams();
  const [loader, setLoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const form = useForm();
  const { i18n } = useTranslation();
  const [onlyCheckedColumnsVisible, setOnlyCheckedColumnsVisible] =
    useState(true);
  const [onlyCheckedFiltersVisible, setOnlyCheckedFiltersVisible] =
    useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const languages = useSelector((state) => state.languages.list);
  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      table_from: tableSlug,
      auto_filters: [],
      action_relations: [],
    },
  });
  const values = watch();

  const relatedTableSlug = useMemo(() => {
    if (values.type === "Recursive") return values.table_from;
    if (values?.attributes?.relation_data?.table_to === tableSlug)
      return values?.attributes?.relation_data?.table_from;
    else if (values?.attributes?.relation_data?.table_from === tableSlug)
      return values?.attributes?.relation_data?.table_to;
    return null;
  }, [values, tableSlug]);

  const isViewFieldsVisible = useMemo(() => {
    return (
      (values?.attributes?.relation_data?.type === "Many2One" &&
        values?.attributes?.relation_data?.table_from === tableSlug) ||
      values?.attributes?.relation_data?.type === "Many2Many" ||
      values?.attributes?.relation_data?.type === "Recursive"
    );
  }, [
    values?.attributes?.relation_data?.type,
    values?.attributes?.relation_data?.table_from,
    tableSlug,
  ]);

  const computedColumnsList = useMemo(() => {
    if (onlyCheckedColumnsVisible) return values.columnsList;
    else return values.columnsList?.filter((column) => column.is_checked);
  }, [values.columnsList, onlyCheckedColumnsVisible]);

  const computedFiltersList = useMemo(() => {
    if (!onlyCheckedFiltersVisible) return values.filtersList;
    else return values.filtersList?.filter((column) => column.is_checked);
  }, [values.filtersList, onlyCheckedFiltersVisible]);

  const params = {
    language_setting: i18n?.language,
  };

  const { isLoading: fieldsLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      if (!relatedTableSlug) return [];
      return constructorObjectService.getList(
        relatedTableSlug,
        {
          data: { limit: 0, offset: 0 },
        },
        params
      );
    },
    {
      cacheTime: 10,
      onSuccess: ({ data }) => {
        if (!data) return;

        const fields = data?.fields ?? [];

        const checkedColumns =
          values.columns
            ?.map((id) => {
              const field = fields.find((field) => field.id === id);
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];
        const unCheckedColumns = fields.filter(
          (field) => !values.columns?.includes(field.id)
        );

        const checkedFilters =
          values.quick_filters
            ?.map((filter) => {
              const field = fields.find(
                (field) => field.id === filter.field_id
              );
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];

        const unCheckedFilters = fields.filter(
          (field) =>
            !values.quick_filters?.some(
              (filter) => filter.field_id === field.id
            )
        );
        setValue("filtersList", [...checkedFilters, ...unCheckedFilters]);
        setValue("columnsList", [...checkedColumns, ...unCheckedColumns]);
      },
    }
  );

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      select: (res) => {
        return listToOptions(res.functions, "name", "path");
      },
    }
  );

  const computedFieldsListOptions = useMemo(() => {
    return values.columnsList?.map((field) => ({
      label: field.label,
      value: field.id,
    }));
  }, [values.columnsList]);

  const { data: app } = useQuery(["GET_TABLE_LIST"], () => {
    return constructorTableService.getList();
  });

  const computedTablesList = useMemo(() => {
    return app?.tables?.map((table) => ({
      value: table.slug,
      label: table.label,
    }));
  }, [app]);

  const isRecursiveRelation = useMemo(() => {
    return values.type === "Recursive";
  }, [values.type]);

  const computedRelationsTypesList = useMemo(() => {
    return relationTyes.map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    closeSettingsBlock(null);
    setLoader(false);
  };

  const onColumnsPositionChange = (dragResult) => {
    const result = applyDrag(values.columnsList, dragResult);
    if (result) setValue("columnsList", result);
  };

  const onFilterPositionChange = (dragResult) => {
    const result = applyDrag(values.filtersList, dragResult);
    if (result) setValue("filtersList", result);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      relation_table_slug: tableSlug,
      // compute columns
      columns: values.columnsList
        ?.filter((el) => el.is_checked)
        ?.map((el) => el.id),
      // compute filters
      quick_filters: values.filtersList
        ?.filter((el) => el.is_checked)
        ?.map((el) => ({
          field_id: el.id,
          default_value: "",
        })),

      // compute default value
      default_values: values?.default_values
        ? Array.isArray(values.default_values)
          ? values.default_values
          : [values.default_values]
        : [],
    };

    // delete data?.field_name;
    delete data?.formula_name;

    setFormLoader(true);

    if (formType === "CREATE") {
      constructorRelationService
        .create(
          {
            ...data,
            title: Object.values(data?.attributes).find((item) => item),
          },
          tableSlug
        )
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    } else {
      constructorRelationService
        .update(data, tableSlug)
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    }
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset({
      ...relation,
      table_from: relation?.attributes?.relation_data?.table_from ?? "",
      table_to: relation?.attributes?.relation_data?.table_to ?? "",
      type: relation?.attributes?.relation_data?.type ?? "",
      id: relation?.attributes?.relation_data?.id ?? "",
      editable: relation?.attributes?.relation_data?.editable ?? false,
      summaries: relation?.attributes?.relation_data?.summaries ?? [],
      view_fields:
        relation?.attributez?.relation_data?.view_fields?.map(
          (field) => field.id
        ) ?? [],
      field_name:
        relation?.attributes?.relation_data?.[`title_${i18n?.language}`],
    });
  }, [relation]);

  const computedColumns = useMemo(() => {
    return listToOptions(computedColumnsList, "label", "slug");
  }, [computedColumnsList]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create" : "Edit"} relation</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <Tabs
            direction={"ltr"}
            selectedIndex={selectedTab}
            onSelect={setSelectedTab}
          >
            <div>
              <Card>
                <TabList
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: "3px solid #E5E9EB",
                  }}
                >
                  <Tab
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                    selectedClassName={styles.selectedTab}
                  >
                    <SettingsIcon style={{ width: "20px", height: "20px" }} />
                  </Tab>
                  <Tab
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                    selectedClassName={styles.selectedTab}
                  >
                    <BrushIcon style={{ width: "20px", height: "20px" }} />
                  </Tab>
                  <Tab
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                    selectedClassName={styles.selectedTab}
                  >
                    <FlashOnIcon style={{ width: "20px", height: "20px" }} />
                  </Tab>
                </TabList>

                <TabPanel>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Relation settings</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        <FRow label="Label" required>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            {languages?.map((lang) => (
                              <HFTextField
                                name={`attributes.title_${lang?.slug}`}
                                control={control}
                                placeholder={`Relation Label (${lang?.slug})`}
                                fullWidth
                              />
                            ))}
                          </Box>
                        </FRow>

                        <FRow label="Table from" required>
                          <HFSelect
                            name="table_from"
                            control={control}
                            placeholder="Table from"
                            options={computedTablesList}
                            autoFocus
                            required
                          />
                        </FRow>

                        {!isRecursiveRelation &&
                          values.type !== "Many2Dynamic" && (
                            <FRow label="Table to" required>
                              <HFSelect
                                name="table_to"
                                control={control}
                                placeholder="Table to"
                                options={computedTablesList}
                                required
                              />
                            </FRow>
                          )}

                        <FRow label="Relation type" required>
                          <HFSelect
                            name="type"
                            control={control}
                            placeholder="Relation type"
                            options={computedRelationsTypesList}
                            required
                          />
                        </FRow>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Additional settings</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className="p-2">
                        {values.type === "Many2Many" && (
                          <FRow label="Relate field type" required>
                            <HFSelect
                              name="view_type"
                              control={control}
                              placeholder="Relation field type"
                              options={relationViewTypes}
                            />
                          </FRow>
                        )}

                        {isViewFieldsVisible && (
                          <FRow label="View fields">
                            <HFMultipleSelect
                              name="view_fields"
                              control={control}
                              options={computedFieldsListOptions}
                              placeholder="View fields"
                              allowClear
                            />
                          </FRow>
                        )}

                        {values.type === "Many2Dynamic" && (
                          <DynamicRelationsBlock
                            control={control}
                            computedTablesList={computedTablesList}
                          />
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Default limit</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div>
                        {/* <div className={styles.settingsDefaultLimit}> */}
                        {/* <h2>Default limit</h2> */}
                        <div className="p-2">
                          <div className={styles.default_limit}>
                            <FRow label="Default limit">
                              <HFTextField
                                control={control}
                                name="default_limit"
                                fullWidth
                              />
                            </FRow>
                          </div>
                        </div>
                        {/* </div> */}

                        {/* {fieldsLoading ? (
                          <RingLoaderWithWrapper />
                        ) : (
                          <Container lockAxis="y" onDrop={onFilterPositionChange}>
                            {computedFiltersList?.map((field, index) => (
                              <Draggable key={field.id}>
                                <div className={styles.draggableRow}>
                                  <IconButton className={styles.dragButton}>
                                    <DragIndicator />
                                  </IconButton>

                                  <p className={styles.label}>{field.label}</p>

                                  <HFCheckbox
                                    control={control}
                                    name={`filtersList[${index}].is_checked`}
                                    icon={<PushPinOutlined style={{ transform: "rotate(45deg)" }} />}
                                    checkedIcon={<PushPin />}
                                  />
                                </div>
                              </Draggable>
                            ))}
                          </Container>
                        )} */}
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Multiple insert</h2>
                    </AccordionSummary>

                    <AccordionDetails style={{ padding: 0 }}>
                      <div>
                        <div className={styles.section}>
                          <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitle}>
                              Multiple insert
                            </div>
                            <HFSwitch
                              control={control}
                              name="multiple_insert"
                            />
                          </div>

                          {watch().multiple_insert && (
                            <div className={styles.sectionBody}>
                              <div className={styles.formRow}>
                                <FRow label="Multiple insert field">
                                  <HFSelect
                                    options={computedColumns}
                                    control={control}
                                    name="multiple_insert_field"
                                  />
                                </FRow>

                                <FRow label="Fixed fields">
                                  <HFMultipleSelect
                                    options={computedColumns}
                                    control={control}
                                    name="updated_fields"
                                  />
                                </FRow>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </TabPanel>

                <TabPanel>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Cascade</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <CascadingRelationSettings
                        slug={
                          relation?.attribute?.relation_data?.table_to?.slug
                        }
                        field_slug={
                          relation?.attrbutes?.relation_data?.field_from
                        }
                        control={control}
                        watch={watch}
                        setValue={setValue}
                      />
                      <CascadingTreeBlock
                        slug={
                          relation?.attributes?.relation_data?.table_to?.slug
                        }
                        field_slug={
                          relation?.attributes?.relation_data?.field_from
                        }
                        control={control}
                        watch={watch}
                        setValue={setValue}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Columns</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div>
                        <div className={styles.settingsBlockHeader}>
                          <h2>Columns</h2>

                          <Checkbox
                            icon={<VisibilityOff />}
                            checkedIcon={<RemoveRedEye />}
                            checked={onlyCheckedColumnsVisible}
                            onChange={(e, val) =>
                              setOnlyCheckedColumnsVisible(val)
                            }
                          />
                        </div>

                        {fieldsLoading ? (
                          <RingLoaderWithWrapper />
                        ) : (
                          <Container
                            lockAxis="y"
                            onDrop={onColumnsPositionChange}
                          >
                            {computedColumnsList?.map((field, index) => (
                              <Draggable key={field.id}>
                                <div className={styles.draggableRow}>
                                  <IconButton className={styles.dragButton}>
                                    <DragIndicator />
                                  </IconButton>
                                  <p className={styles.label}>
                                    {field?.attributes[
                                      `title_${i18n?.language}`
                                    ] ?? field.label}
                                  </p>

                                  <HFCheckbox
                                    control={control}
                                    name={`columnsList[${index}].is_checked`}
                                    icon={<VisibilityOff />}
                                    checkedIcon={<RemoveRedEye />}
                                  />
                                </div>
                              </Draggable>
                            ))}
                          </Container>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Display type</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}></AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Filters</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <div className={styles.settingsBlockHeader}>
                        <h2>Filters</h2>

                        <Checkbox
                          icon={
                            <PushPinOutlined
                              style={{ transform: "rotate(45deg)" }}
                            />
                          }
                          checkedIcon={<PushPin />}
                          checked={onlyCheckedFiltersVisible}
                          onChange={(e, val) =>
                            setOnlyCheckedFiltersVisible(val)
                          }
                        />
                      </div>

                      {fieldsLoading ? (
                        <RingLoaderWithWrapper />
                      ) : (
                        <Container lockAxis="y" onDrop={onFilterPositionChange}>
                          {computedFiltersList?.map((field, index) => (
                            <Draggable key={field.id}>
                              <div className={styles.draggableRow}>
                                <IconButton className={styles.dragButton}>
                                  <DragIndicator />
                                </IconButton>

                                <p className={styles.label}>{field.label}</p>

                                <HFCheckbox
                                  control={control}
                                  name={`filtersList[${index}].is_checked`}
                                  icon={
                                    <PushPinOutlined
                                      style={{ transform: "rotate(45deg)" }}
                                    />
                                  }
                                  checkedIcon={<PushPin />}
                                />
                              </div>
                            </Draggable>
                          ))}
                        </Container>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Summary</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <SummaryBlock
                        control={control}
                        computedFieldsListOptions={computedFieldsListOptions}
                      />
                    </AccordionDetails>
                  </Accordion>
                </TabPanel>

                <TabPanel>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Settings</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: "8px" }}>
                      <HFSwitch
                        control={control}
                        name="is_editable"
                        label={"Editable"}
                      />
                      <HFSwitch
                        control={control}
                        name="default_editable"
                        label={"Default editable"}
                      />
                      <HFSwitch
                        control={control}
                        name="creatable"
                        label={"Creatable"}
                      />
                      <HFSwitch
                        control={control}
                        name="relation_buttons"
                        label={"Relation Buttons"}
                      />
                      {/* 
                      <DefaultValueBlock
                        control={control}
                        watch={watch}
                        columnsList={values.columnsList}
                      /> */}

                      {/* <AutoFiltersBlock control={control} watch={watch} /> */}
                    </AccordionDetails>
                  </Accordion>

                  <Box sx={{ padding: "16px" }}>
                    <Box
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Table Actions</h2>
                    </Box>
                    <Box style={{ padding: 0 }}>
                      <TableActions
                        control={control}
                        watch={watch}
                        setValue={setValue}
                      />
                    </Box>
                  </Box>

                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Function</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <FunctionPath
                        control={control}
                        watch={watch}
                        functions={functions}
                        setValue={setValue}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Default</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <DefaultValueBlock
                        control={control}
                        watch={watch}
                        columnsList={values.columnsList}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <h2>Auto filter</h2>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                      <AutoFiltersBlock control={control} watch={watch} />
                    </AccordionDetails>
                  </Accordion>
                </TabPanel>
              </Card>
            </div>
          </Tabs>

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={formLoader || loader}
            >
              Save
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationSettingsTest;
