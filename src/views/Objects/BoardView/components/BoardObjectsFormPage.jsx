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

import {useTranslation} from "react-i18next";
import {store} from "../../../../store";
import useTabRouter from "../../../../hooks/useTabRouter";
import layoutService from "../../../../services/layoutService";
import constructorObjectService from "../../../../services/constructorObjectService";
import {sortSections} from "../../../../utils/sectionsOrderNumber";
import {showAlert} from "../../../../store/alert/alert.thunk";
import FiltersBlock from "../../../../components/FiltersBlock";
import FormPageBackButton from "../../components/FormPageBackButton";
import SummarySectionValue from "../../SummarySection/SummarySectionValue";
import NewRelationSection from "../../RelationSection/NewRelationSection";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import FormCustomActionButton from "../../components/CustomActionsButton/FormCustomActionButtons";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import styles from "./style.module.scss";
import Footer from "../../../../components/Footer";
import menuService from "../../../../services/menuService";

const BoardObjectsFormPage = ({
  tableSlugFromProps,
  handleClose,
  modal = false,
  selectedRow,
  dateInfo,
}) => {
  const {id: idFromParam, tableSlug: tableSlugFromParam} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {state = {}} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const [data, setData] = useState([]);
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const {i18n} = useTranslation();

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

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
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
    const getLayout = await layoutService.getList(
      {
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      },
      tableSlug
    );

    const getFormData = await constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, {layouts: layout = []}] = await Promise.all([
        getFormData,
        getLayout,
      ]);

      setData({
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
      setSections(sortSections(sections));
      setSummary(
        layout?.find((el) => el.is_default === true)?.summary_fields ?? []
      );

      const defaultLayout = layout?.find((el) => el.is_default === true);

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

      if (!selectedTab?.relation_id) reset(data?.response ?? {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = await layoutService.getList(
      {
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      },
      tableSlug
    );

    try {
      const [{layouts: layout = []}] = await Promise.all([getLayout]);
      const defaultLayout = layout?.find((el) => el.is_default === true);
      setSections(sortSections(sections));

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setData({
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      });
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
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const create = (data) => {
    setBtnLoader(true);
    constructorObjectService
      .create(tableSlug, {data})
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        handleClose();
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (id) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (!menuItem) return;
    if (id) getAllData();
    else getFields();
  }, [id, menuItem, selectedTabIndex]);

  useEffect(() => {
    getFields();
  }, [id, menuItem, selectedTabIndex, i18n?.language]);

  return (
    <div className={styles.formPage}>
      <FiltersBlock summary={true} sections={sections} hasBackground={true}>
        <FormPageBackButton />

        <div className={styles.subTitle}>{/* <h3>Test</h3> */}</div>

        <SummarySectionValue
          computedSummary={summary}
          control={control}
          sections={sections}
          setFormValue={setFormValue}
        />
      </FiltersBlock>
      <div className={styles.formArea}>
        <NewRelationSection
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          relations={tableRelations}
          control={control}
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
          data={data?.[0]}
        />
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <FormCustomActionButton
              control={control?._formValues}
              tableSlug={tableSlug}
              id={id}
            />
            <PermissionWrapperV2
              tableSlug={tableSlug}
              type={id ? "update" : "write"}>
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

export default BoardObjectsFormPage;
