import { useParams, useSearchParams } from "react-router-dom";
import { store } from "../../../../../store";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjectGetByIdQuery } from "../../../../../services/projectService";
import menuService from "../../../../../services/menuService";
import PageFallback from "../../../../../components/PageFallback";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import styles from "./index.module.scss";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import { IconButton } from "@mui/material";

const Sections = ({
  relation,
  editAcces,
  isMultiLanguage,
  fieldsMapFromProps,
  loader,
  computedSections,
  control,
  setFormValue,
  errors,
  relatedTable,
  onBackButtonClick,
}) => {
  const { tableSlug } = useParams();
  const [isShow, setIsShow] = useState(true);
  const projectId = store.getState().company.projectId;
  const [activeLang, setActiveLang] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTable, setSelectedTable] = useState(null);
  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });
  const { i18n } = useTranslation();
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

  const isVisibleSection = (section) => {
    if (editAcces) return true;
    const isVisible = section?.fields?.some(
      (field) => field?.is_visible_layout
    );
    return isVisible;
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

  if (loader) return <PageFallback />;

  return (
    <div className={styles.newcontainerModal}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {computedSections?.map(
            (section, index) =>
              isVisibleSection(section) && (
                <div className={styles.section}>
                  <div
                    className={styles.sectinoHeader}
                    style={{ borderTop: index === 0 && "none" }}
                  >
                    Section #{index + 1}
                    {/* {section?.attributes?.[`label_${i18n.language}`] ??
                      section.label} */}
                  </div>

                  <div className={styles.sectionBody}>
                    {section.fields?.map((field, fieldIndex) => (
                      <FormElementGenerator
                        key={field.id}
                        isMultiLanguage={isMultiLanguage}
                        field={field}
                        sectionModal={true}
                        control={control}
                        setFormValue={setFormValue}
                        fieldsList={fieldsList}
                        formTableSlug={tableSlug}
                        relatedTable={relatedTable}
                        activeLang={activeLang}
                        errors={errors}
                      />
                    ))}
                  </div>
                </div>

                // <NewFormCard
                //   modalTitle={true}
                //   key={section.id}
                //   title={
                //     section?.attributes?.[`label_${i18n.language}`] ??
                //     section.label
                //   }
                //   className={styles.formCard}
                //   icon={section.icon}>
                //   <div className={styles.newformColumn}>
                //     {/* <SectionBlockForModal
                //       index={index}
                //       data={data}
                //       setData={setData}
                //       computedSections={computedSections}
                //       editAcces={editAcces}
                //       section={section}
                //       control={control}
                //       setFormValue={setFormValue}
                //       fieldsList={fieldsList}
                //       formTableSlug={tableSlug}
                //       relatedTable={relatedTable}
                //       activeLang={activeLang}
                //       errors={errors}
                //       isMultiLanguage={isMultiLanguage}
                //       toggleFields={toggleFields}
                //       selectedTabIndex={selectedTabIndex}
                //     /> */}
                //   </div>
                // </NewFormCard>
              )
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Sections;
