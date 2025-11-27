import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {Box, Button, Tooltip} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import PageFallback from "../../components/PageFallback";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import NewFormCard from "./components/NewFormCard";
import styles from "./style.module.scss";

const MainInfo = ({
  computedSections,
  control,
  loader,
  setFormValue,
  relatedTable,
  relation,
  isMultiLanguage,
  errors,
  watch,
}) => {
  const {tableSlug} = useParams();
  const [isShow, setIsShow] = useState(true);
  const projectId = store.getState().company.projectId;
  const [activeLang, setActiveLang] = useState();

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

  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  const filterFields = (element, control, watch) => {
    if (element?.attributes?.hide_path_field) {
      if (Array.isArray(element?.attributes?.hide_path)) {
        const hidePathArray = element?.attributes?.hide_path;
        const watchArray = watch(element?.attributes?.hide_path_field, control);

        if (hidePathArray?.length !== watchArray?.length) {
          return false;
        }
        return hidePathArray?.every((el, index) => el === watchArray?.[index]);
      }
      if (element?.attributes?.type) {
        const hidePathArray = element?.attributes?.hide_path;
        const watchArray = watch(element?.attributes?.hide_path_field, control);
        if (element?.attributes?.type === "min") {
          if (watchArray > Number(hidePathArray)) {
            return true;
          } else return false;
        } else if (element?.attributes?.type === "max") {
          if (watchArray < Number(hidePathArray)) {
            return true;
          } else return false;
        }
      }

      const isHidden =
        element?.attributes?.hide_path ===
        watch(element?.attributes?.hide_path_field, control);

      return isHidden;
    }

    return true;
  };

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);
  const {i18n} = useTranslation();

  if (loader) return <PageFallback />;

  return (
    <div className={styles.newcontainer}>
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

          <div className={styles.newMainInfoSections}>
            {computedSections.map((section) => (
              <NewFormCard
                key={section.id}
                title={
                  section?.attributes?.[`label_${i18n.language}`] ??
                  section.label
                }
                className={styles.formCard}
                icon={section.icon}>
                <div
                  className={styles.newformColumn}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  }}>
                  {section?.fields
                    ?.filter((element) => filterFields(element, control, watch))
                    .map((field) => (
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          minWidth: "250px",
                        }}>
                        <FormElementGenerator
                          key={field.id}
                          isMultiLanguage={isMultiLanguage}
                          field={field}
                          control={control}
                          setFormValue={setFormValue}
                          fieldsList={fieldsList}
                          formTableSlug={tableSlug}
                          relatedTable={relatedTable}
                          activeLang={activeLang}
                          errors={errors}
                          watch={watch}
                        />
                      </Box>
                    ))}
                </div>
              </NewFormCard>
            ))}
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

export default MainInfo;
