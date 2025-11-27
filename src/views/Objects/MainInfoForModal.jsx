import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {Button, Menu, MenuItem, Tooltip} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams, useSearchParams} from "react-router-dom";
import PageFallback from "../../components/PageFallback";
import layoutService from "../../services/layoutService";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {applyDrag} from "../../utils/applyDrag";
import SectionBlockForModal from "./SectionBlockForModal";
import NewFormCard from "./components/NewFormCard";
import styles from "./style.module.scss";
import menuService from "../../services/menuService";

const MainInfoForModal = ({
  computedSections,
  control,
  loader,
  setFormValue,
  selectedTabIndex,
  relatedTable,
  relation,
  isMultiLanguage,
  errors,
  setFullScreen,
  remove,
  editAcces,
  setData,
  data,
  fieldsMapFromProps,
}) => {
  const {tableSlug} = useParams();
  const [isShow, setIsShow] = useState(true);
  const projectId = store.getState().company.projectId;
  const [activeLang, setActiveLang] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTable, setSelectedTable] = useState(null);
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fieldsList = useMemo(() => {
    const fields = [];

    relation?.tabs?.forEach((tab) => {
      tab?.sections?.forEach((section) => {
        section?.fields?.forEach((field) => {
          fields.push(field);
        });
      });
    });
    return fields;
  }, [relation]);

  const updateLayout = (newData) => {
    const computedData = {
      layouts: newData,
      project_id: projectId,
      table_id: selectedTable?.table_id,
    };
    layoutService.update(newData, tableSlug);
  };

  const toggleFields = (field) => {
    const newFields = data?.map((layout) => {
      return {
        ...layout,
        tabs: layout?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((f) => {
                  if (f?.id === field?.id) {
                    return {
                      ...f,
                      is_visible_layout: !f?.is_visible_layout,
                    };
                  } else {
                    return f;
                  }
                }),
              };
            }),
          };
        }),
      };
    });
    setData(newFields);
    updateLayout(newFields);
  };

  const isVisibleSection = (section) => {
    if (editAcces) return true;
    const isVisible = section?.fields?.some(
      (field) => field?.is_visible_layout
    );
    return isVisible;
  };

  const onDropSections = (dropResult, colNumber) => {
    const result = applyDrag(computedSections, dropResult);

    if (!result) return;

    const newData = data?.map((layout) => {
      return {
        ...layout,
        tabs: layout?.tabs?.map((tab, tabIndex) => {
          if (tabIndex === selectedTabIndex) {
            return {
              ...tab,
              sections: result,
            };
          }
        }),
      };
    });

    setData(newData);
    updateLayout(newData);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setSelectedTable(res);
        });
    }
  }, []);

  const allFields = useMemo(() => {
    return Object.values?.(fieldsMapFromProps ?? {}).map((field) => {
      return {
        label: field?.attributes?.[`label_to_${i18n.language}`] ?? field?.label,
        value: field?.id,
      };
    });
  }, [fieldsMapFromProps]);

  const addFieldsToSection = (fieldId, sectionIndex) => {
    const newFields = {
      ...data,
      tabs: data?.tabs?.map((tab, tabIndex) => {
        if (tabIndex === selectedTabIndex) {
          return {
            ...tab,
            sections: tab?.sections?.map((section, index) => {
              if (index === sectionIndex) {
                return {
                  ...section,
                  fields: [
                    ...section?.fields,
                    Object.values(fieldsMapFromProps)?.find(
                      (field) => field?.id === fieldId
                    ),
                  ],
                };
              } else {
                return section;
              }
            }),
          };
        } else {
          return tab;
        }
      }),
    };
    setData(newFields);
    updateLayout(newFields);
  };

  if (loader) return <PageFallback />;

  return (
    <div className={styles.newcontainerModal}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {isMultiLanguage && (
            <div className={styles.language}>
              {projectInfo?.language?.map((lang) => (
                <Button
                  className={activeLang === lang?.short_name && styles.active}
                  onClick={() => setActiveLang(lang?.short_name)}>
                  {lang?.name}
                </Button>
              ))}
            </div>
          )}

          <div className={styles.newMainInfoSectionsModal}>
            {computedSections?.map(
              (section, index) =>
                isVisibleSection(section) && (
                  <NewFormCard
                    modalTitle={true}
                    key={section.id}
                    title={
                      section?.attributes?.[`label_${i18n.language}`] ??
                      section.label
                    }
                    topHeader={
                      editAcces && (
                        <>
                          <Button
                            variant="outlined"
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}>
                            <AddRoundedIcon />
                          </Button>

                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}>
                            {allFields?.map((field) => (
                              <MenuItem
                                onClick={() => {
                                  addFieldsToSection(field?.value, index);
                                  handleClose();
                                }}>
                                {field?.label}
                              </MenuItem>
                            ))}
                          </Menu>
                        </>
                      )
                    }
                    className={styles.formCard}
                    icon={section.icon}>
                    <div className={styles.newformColumn}>
                      <SectionBlockForModal
                        index={index}
                        data={data}
                        setData={setData}
                        computedSections={computedSections}
                        editAcces={editAcces}
                        section={section}
                        control={control}
                        setFormValue={setFormValue}
                        fieldsList={fieldsList}
                        formTableSlug={tableSlug}
                        relatedTable={relatedTable}
                        activeLang={activeLang}
                        errors={errors}
                        isMultiLanguage={isMultiLanguage}
                        toggleFields={toggleFields}
                        selectedTabIndex={selectedTabIndex}
                      />
                    </div>
                  </NewFormCard>
                )
            )}
          </div>
        </div>
      ) : (
        <div className={styles.hideSideCard}>
          <Tooltip title="Открыть полю ввода" placement="right" followCursor>
            <button onClick={() => setIsShow(true)}>
              <KeyboardTabIcon style={{color: "#000"}} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MainInfoForModal;
