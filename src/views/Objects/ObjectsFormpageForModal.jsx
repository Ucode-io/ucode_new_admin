import {Save} from "@mui/icons-material";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
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
import Footer from "../../components/Footer";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import {store} from "../../store";
import {showAlert} from "../../store/alert/alert.thunk";
import {sortSections} from "../../utils/sectionsOrderNumber";
import RelationSectionForModal from "./RelationSection/RelationSectionForModal";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import styles from "./style.module.scss";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SummarySectionValuesForModal from "./ModalDetailPage/SummarySectionValuesForModal";
import menuService, {useMenuGetByIdQuery} from "../../services/menuService";

const ObjectsFormPageForModal = ({
  tableSlugFromProps,
  handleClose,
  fieldsMap,
  modal = false,
  refetch,
  selectedRow,
  dateInfo,
  fullScreen,
  menuItem,
  setFullScreen = () => {},
}) => {
  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [editAcces, setEditAccess] = useState(false);
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
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const {i18n} = useTranslation();
  const [layout, setLayout] = useState({});
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

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
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });
    const getFormData = constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, layout] = await Promise.all([getFormData, getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setSections(sortSections(sections));
      setSummary(layout?.summary_fields ?? []);

      setLayout(layout);

      const relations =
        layout?.tabs?.map((el) => ({
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
      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
      setSelectTab(relations[selectedTabIndex]);

      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layout] = await Promise.all([getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setLayout(layout);
      setSections(sortSections(sections));

      const relations =
        layout?.tabs?.map((el) => ({
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
      if (!id) {
        setLoader(false);
      }
      setSelectTab(relations[selectedTabIndex]);
    } catch (error) {
      console.error(error);
    }
  };

  const update = (data) => {
    delete data.invite;
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
      .finally(() => {
        setBtnLoader(false);
        refetch();
      });
  };
  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, {data})
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
      .finally(() => {
        setBtnLoader(false);
        refetch();
      });
  };

  const onSubmit = (data) => {
    if (id) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);

  return (
    <div className={styles.formPage}>
      {summary?.length ? (
        <SummarySectionValuesForModal
          computedSummary={summary}
          setSummary={setSummary}
          control={control}
          editAcces={editAcces}
          fieldsMap={fieldsMap}
          layout={layout}
        />
      ) : null}

      <div className={styles.formArea}>
        <RelationSectionForModal
          getAllData={getAllData}
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
          fieldsMap={fieldsMap}
          editAcces={editAcces}
          setEditAccess={setEditAccess}
          data={data}
          setData={setData}
        />
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => setFullScreen((prev) => !prev)}
              color=""
              style={{
                position: "absolute",
                left: "16px",
                border: "0px solid #2d6ce5",
                padding: "4px",
              }}>
              {/* {fullScreen ? (
                <FullscreenExitIcon
                  style={{color: "#2d6ce5", width: "26px", height: "26px"}}
                />
              ) : (
                <FullscreenIcon
                  style={{color: "#2d6ce5", width: "26px", height: "26px"}}
                />
              )} */}
            </SecondaryButton>
            <SecondaryButton
              onClick={() => (modal ? handleClose() : navigate(-1))}
              color="error">
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

export default ObjectsFormPageForModal;
