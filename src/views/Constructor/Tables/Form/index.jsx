import {Save} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import Footer from "../../../../components/Footer";
import HeaderSettings from "../../../../components/HeaderSettings";
import PageFallback from "../../../../components/PageFallback";
import constructorFieldService from "../../../../services/constructorFieldService";
import constructorRelationService from "../../../../services/constructorRelationService";
import constructorTableService, {
  useTableByIdQuery,
} from "../../../../services/constructorTableService";
import constructorViewRelationService from "../../../../services/constructorViewRelationService";
import layoutService from "../../../../services/layoutService";
import {constructorTableActions} from "../../../../store/constructorTable/constructorTable.slice";
import {createConstructorTableAction} from "../../../../store/constructorTable/constructorTable.thunk";
import {generateGUID} from "../../../../utils/generateID";
import {listToMap} from "../../../../utils/listToMap";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import menuSettingsService from "../../../../services/menuSettingsService";
import Actions from "./Actions";
import CustomErrors from "./CustomErrors";
import Fields from "./Fields";
import Layout from "./Layout";
import MainInfo from "./MainInfo";
import Relations from "./Relations";
import constructorCustomEventService from "../../../../services/constructorCustomEventService";
import menuService from "../../../../services/menuService";
import {disableCache} from "@iconify/react";

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id, tableSlug, appId} = useParams();
  const queryClient = useQueryClient();
  const projectId = useSelector((state) => state.auth.projectId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const {i18n} = useTranslation();
  const location = useLocation();

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });
  const values = useWatch({
    control: mainForm?.control,
  });

  // const list = useSelector((state) => state.constructorTable.list);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

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

  const {isLoading} = useTableByIdQuery({
    id: id,
    queryParams: {
      enabled: !!id,
      onSuccess: (res) => {
        mainForm.reset(res);
        setLoader(false);
      },
    },
  });

  const getData = async () => {
    setLoader(true);

    try {
      const [tableData, {custom_events: actions = []}] = await Promise.all([
        await constructorViewRelationService.getList({table_slug: tableSlug}),
        await constructorCustomEventService.getList(
          {table_slug: tableSlug},
          tableSlug
        ),
        await layoutService
          .getList(
            {"table-slug": tableSlug, language_setting: i18n?.language},
            tableSlug
          )
          .then((res) => {
            mainForm.setValue("layouts", res?.layouts ?? []);
          }),
      ]);

      const data = {
        ...tableData,
        ...mainForm.getValues(),
        fields: [],
        actions,
      };

      mainForm.reset({
        ...data,
        ...values,
        slug: data?.slug || values?.slug,
        label: data?.label || values?.label,
      });

      await getRelationFields();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoader(false);
    }
  };

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList(
        {
          table_id: id,
        },
        tableSlug
      );

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        tableSlug
      );
      const [{relations = []}, {fields = []}] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });

      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          (relation?.label ?? relation[relation.relatedTableSlug]?.label)
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  const createType = async (data) => {
    await menuSettingsService
      .create({
        parent_id:
          menuItem?.id || appId || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "TABLE",
        table_id: data?.id,
        label: data?.label,
        attributes: data?.attributes,
        icon: data?.icon,
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], menuItem?.id);
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createConstructorTable = (data) => {
    setBtnLoader(true);

    dispatch(
      createConstructorTableAction({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
      })
    )
      .unwrap()
      .then((res) => {
        createType(res);
        if (location?.state?.create_table) {
          navigate(-1);
        }
      })
      .catch(() => setBtnLoader(false));
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    // const computedLayouts = data.layouts.map((layout) => ({
    //   ...layout,
    //   summary_fields: layout?.summary_fields?.map((item) => {
    //     return {
    //       ...item,
    //       field_name: item?.field_name ?? item?.title ?? item?.label,
    //     };
    //   }),
    //   tabs: layout?.tabs?.map((tab) => {
    //     if (
    //       tab.type === "Many2Many" ||
    //       tab.type === "Many2Dynamic" ||
    //       tab.type === "Recursive" ||
    //       tab.type === "Many2One" ||
    //       tab.relation_type === "Many2Many" ||
    //       tab.relation_type === "Many2Dynamic" ||
    //       tab.relation_type === "Recursive" ||
    //       tab.relation_type === "Many2One"
    //     ) {
    //       return {
    //         order: tab?.order ?? 0,
    //         label: tab.title ?? tab.label,
    //         field_name: tab?.title ?? tab.label ?? tab?.field_name,
    //         type: "relation",
    //         layout_id: layout.id,
    //         relation_id: tab.id,
    //         relation: {
    //           ...tab,
    //         },
    //       };
    //     } else {
    //       return {
    //         ...tab,
    //         sections: tab?.sections?.map((section, index) => ({
    //           ...section,
    //           order: index,
    //           fields: section?.fields?.map((field, index) => ({
    //             ...field,
    //             order: index,
    //             field_name: field?.title ?? field.label,
    //           })),
    //         })),
    //       };
    //     }
    //   }),
    // }));

    // const updateLayoutData = layoutService.update(
    //   {
    //     layouts: computedLayouts,
    //     table_id: id,
    //     project_id: projectId,
    //   },
    //   slug
    // );

    Promise.all([
      updateTableData,
      // updateSectionData,
      // updateViewRelationsData,
      // updateLayoutData,
    ])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      id: data?.id,
      show_in_menu: true,
    };
    // return;
    if (id) updateConstructorTable(computedData);
    else createConstructorTable(computedData);
  };

  useEffect(() => {
    if (!id) setLoader(false);
    else getData();
  }, [id]);
  console.log("ididididididid", id);
  const [selectedTab, setSelectedTab] = useState(0);

  if (loader) return <PageFallback />;

  return (
    <>
      <div className="pageWithStickyFooter">
        {id ? (
          <>
            <Tabs selectedIndex={selectedTab} direction={"ltr"}>
              <HeaderSettings
                title="Objects"
                subtitle={id ? mainForm.getValues("label") : "Add"}
                icon={mainForm.getValues("icon")}
                backButtonLink={-1}
                sticky>
                <TabList>
                  <Tab onClick={() => setSelectedTab(0)}>Details</Tab>
                  <Tab onClick={() => setSelectedTab(1)}>Layouts</Tab>
                  <Tab onClick={() => setSelectedTab(2)}>Fields</Tab>
                  {id && <Tab onClick={() => setSelectedTab(3)}>Relations</Tab>}
                  {id && <Tab onClick={() => setSelectedTab(4)}>Actions</Tab>}
                  {id && (
                    <Tab onClick={() => setSelectedTab(5)}>Custom errors</Tab>
                  )}
                </TabList>
              </HeaderSettings>

              <TabPanel>
                <MainInfo control={mainForm.control} watch={mainForm.watch} />
              </TabPanel>

              <TabPanel>
                <Layout
                  mainForm={mainForm}
                  getRelationFields={getRelationFields}
                  getData={getData}
                  setSelectedTabLayout={setSelectedTab}
                />
              </TabPanel>

              <TabPanel>
                <Fields
                  getRelationFields={getRelationFields}
                  mainForm={mainForm}
                  slug={tableSlug}
                />
              </TabPanel>

              {id && (
                <TabPanel>
                  <Relations
                    mainForm={mainForm}
                    getRelationFields={getRelationFields}
                  />
                </TabPanel>
              )}
              {id && (
                <TabPanel>
                  <Actions mainForm={mainForm} />
                </TabPanel>
              )}
              {id && (
                <TabPanel>
                  <CustomErrors mainForm={mainForm} />
                </TabPanel>
              )}
              {/* <Actions eventLabel={mainForm.getValues("label")} /> */}
            </Tabs>
          </>
        ) : (
          <>
            <HeaderSettings
              title={id ? mainForm.getValues("label") : "Create table"}
              icon={mainForm.getValues("icon")}
              backButtonLink={-1}
              sticky></HeaderSettings>

            <MainInfo control={mainForm.control} watch={mainForm.watch} />
          </>
        )}
      </div>

      {selectedTab === 1 ? (
        ""
      ) : (
        <Footer
          extra={
            <>
              <SecondaryButton onClick={() => navigate(-1)} color="error">
                Close
              </SecondaryButton>
              <PrimaryButton
                loader={btnLoader}
                onClick={mainForm.handleSubmit(onSubmit)}
                loading={btnLoader}>
                <Save /> Save
              </PrimaryButton>
            </>
          }
        />
      )}
    </>
  );
};

export default ConstructorTablesFormPage;
