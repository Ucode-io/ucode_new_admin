import {Save} from "@mui/icons-material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import FiltersBlock from "../../components/FiltersBlock";
import Footer from "../../components/Footer";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import {store} from "../../store";
import {showAlert} from "../../store/alert/alert.thunk";
import {sortSections} from "../../utils/sectionsOrderNumber";
import NewRelationSection from "./RelationSection/NewRelationSection";
import SummarySectionValue from "./SummarySection/SummarySectionValue";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import FormPageBackButton from "./components/FormPageBackButton";
import styles from "./style.module.scss";
import {useTranslation} from "react-i18next";
import {useMenuGetByIdQuery} from "../../services/menuService";
import {generateID} from "../../utils/generateID";

const ObjectsFormPage = ({
  tableSlugFromProps,
  handleClose,
  modal = false,
  selectedRow,
  dateInfo,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {state = {}} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const menu = store.getState().menu;

  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = store.getState().company.projectId;
  const [menuItem, setMenuItem] = useState(null);
  const menuId = searchParams.get("menuId");

  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const microPath = `/main/${idFromParam}/page/4d262256-b290-42a3-9147-049fb5b2acaa?menuID=${menuId}&id=${idFromParam}&slug=${tableSlugFromParam}`;

  const id = useMemo(() => {
    return (
      state?.[`${tableSlugFromParam}_id`] ||
      idFromParam ||
      selectedRow?.guid ||
      appId
    );
  }, [idFromParam, selectedRow, appId, state]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const isInvite = menu.invite;
  const {i18n} = useTranslation();

  const {deleteTab} = useTabRouter();
  const {pathname} = useLocation();

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...state,
      ...dateInfo,
      invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
    },
  });

  const getAllData = async () => {
    setLoader(true);
    const getLayoutData = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = id && constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, layoutData] = await Promise.all([
        getFormData,
        getLayoutData,
      ]);

      setData({
        ...layoutData,
        tabs: layoutData?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
      setSections(sortSections(sections));
      setSummary(layoutData.summary_fields ?? []);

      const defaultLayout = layoutData;

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) || [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );

      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layoutData] = await Promise.all([getLayout]);
      const defaultLayout = layoutData;

      setData({
        ...layoutData,
        tabs: layoutData?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
      setSections(sortSections(sections));
      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const update = (data) => {
    delete data.invite;
    delete data?.merchant_ids_data;
    delete data?.merchant_ids;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
            user_id: isUserId,
          }
        );
        dispatch(showAlert("Successfully updated", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
        }
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };
  const create = (data) => {
    setBtnLoader(true);
    if (window?.location.pathname?.includes("create")) {
      delete data.guid;
    }
    delete data.invite;
    delete data?.$merchant_ids_data;
    delete data?.merchant_ids;

    constructorObjectService
      .create(tableSlug, {
        data: {
          ...data,
          folder_id: state?.folder_id ?? undefined,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(showAlert("Successfully created", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (Boolean(id) && !window.location.pathname?.includes("create")) {
      update(data);
    } else {
      create(data);
    }
  };

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);

  const clickHandler = () => {
    deleteTab(pathname);
    navigate(-1);
  };

  return (
    <div className={styles.formPage}>
      <FiltersBlock summary={true} sections={sections} hasBackground={true}>
        <FormPageBackButton />

        <div className={styles.subTitle}></div>

        <SummarySectionValue
          computedSummary={summary}
          control={control}
          sections={sections}
          setFormValue={setFormValue}
        />
      </FiltersBlock>
      <div className={styles.formArea}>
        <NewRelationSection
          getAllData={getAllData}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          relations={tableRelations ?? []}
          control={control}
          getValues={getValues}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          reset={reset}
          setFormValue={setFormValue}
          tableSlug={tableSlugFromProps}
          watch={watch}
          loader={loader}
          setSelectTab={setSelectTab}
          selectedTab={selectedTab}
          errors={errors}
          relatedTable={tableRelations[selectedTabIndex]?.relatedTable}
          id={id}
          menuItem={menuItem}
          data={data}
        />
      </div>
      <Footer
        extra={
          <>
            {projectId === "0f111e78-3a93-4bec-945a-2a77e0e0a82d" &&
              (tableSlug === "investors" || tableSlug === "legal_entities") && (
                <PrimaryButton
                  onClick={() => {
                    localStorage.setItem("idFromParams", idFromParam);
                    localStorage.setItem(
                      "tableSlugFromParam",
                      tableSlugFromParam
                    );
                    navigate(microPath);
                  }}>
                  Пополнить баланс
                </PrimaryButton>
              )}
            <SecondaryButton
              onClick={() => (modal ? handleClose() : clickHandler())}
              color="error">
              Close
            </SecondaryButton>
            <FormCustomActionButton
              control={control?._formValues}
              tableSlug={tableSlug}
              id={id}
              getAllData={getAllData}
            />
            <PermissionWrapperV2 tableSlug={tableSlug} type={"update"}>
              <PrimaryButton
                loader={btnLoader}
                id="submit"
                onClick={handleSubmit(onSubmit)}>
                <Save />
                Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default ObjectsFormPage;
