import { useParams } from "react-router-dom";
import { useDocxTemplateVariablesQuery } from "../../../../services/docxTemplateService";
import styles from "./index.module.scss";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import RelationIcon from "./relationIcon";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

function convertLabelds(input) {
  return input
    .split("_") // Split by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter
    .join(" "); // Join words with space
}

const Variables = () => {
  const { tableSlug } = useParams();
  const [openedRelations, setOpenedRelations] = useState([]);

  const onRelationDropDownClick = (slug, index) => {
    const computedSlug = slug + index;

    if (openedRelations.includes(computedSlug)) {
      setOpenedRelations((prev) => prev.filter((el) => el !== computedSlug));
    } else {
      setOpenedRelations((prev) => [...prev, computedSlug]);
    }
  };

  const { data } = useDocxTemplateVariablesQuery({
    tableSlug,
  });

  const fields = data?.fields;
  const relations = data?.relations;

  const onFieldCopyClick = (slug) => {
    navigator.clipboard.writeText(`{${slug}}`);
  };

  const onRelationCopyClick = (slug) => {
    if (slug?.includes("id_data")) {
      navigator.clipboard.writeText(`{${slug}}`);
    } else {
      navigator.clipboard.writeText(`{#${slug}} {/${slug}}`);
    }
  };

  const onRelationFieldCopyClick = (slug, relationSlug) => {
    if (relationSlug?.includes("id_data")) {
      navigator.clipboard.writeText(`{${relationSlug}.${slug}}`);
    } else {
      navigator.clipboard.writeText(`{${slug}}`);
    }
  };

  return (
    <div className={styles.block}>
      <p className={styles.title}>Переменные</p>

      <div className={styles.list}>
        {fields?.map((field) => (
          <div key={field.slug} className={styles.row}>
            {convertLabelds(field.label)} ({field.slug}){" "}
            <IconButton
              className={styles.copyButton}
              onClick={() => onFieldCopyClick(field.slug)}
            >
              <ContentCopyIcon />
            </IconButton>
          </div>
        ))}

        {relations?.map((relation, index) => (
          <div>
            <div className={`${styles.relationRow} ${styles.row}`}>
              <ArrowDropDownIcon
                onClick={() => onRelationDropDownClick(relation.slug, index)}
                className={`${styles.dropDownIcon} ${openedRelations.includes(relation.slug + index) ? styles.open : ""}`}
              />
              <RelationIcon className={styles.relationIcon} />{" "}
              {convertLabelds(relation.label)} ({relation.slug}{" "}
              {!relation.slug?.includes("id_data") && "[]"}){" "}
              <IconButton
                className={styles.copyButton}
                onClick={() => onRelationCopyClick(relation.slug)}
              >
                <ContentCopyIcon />
              </IconButton>
            </div>
            {openedRelations.includes(relation.slug + index) && (
              <div className={styles.relation} key={relation.slug}>
                {relation?.fields?.map((field) => (
                  <div key={field.slug} className={styles.row}>
                    {convertLabelds(field.label)} ({field.slug}){" "}
                    <IconButton
                      className={styles.copyButton}
                      onClick={() =>
                        onRelationFieldCopyClick(field.slug, relation.slug)
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </div>
                ))}

                <div>
                  {relation?.relations?.map((relation) => (
                    <div>
                      <div className={`${styles.relationRow} ${styles.row}`}>
                        <ArrowDropDownIcon
                          onClick={() =>
                            onRelationDropDownClick(relation.slug, index)
                          }
                          className={`${styles.dropDownIcon} ${openedRelations.includes(relation.slug + index) ? styles.open : ""}`}
                        />
                        <RelationIcon className={styles.relationIcon} />
                        {convertLabelds(relation.label)} ({relation.slug}{" "}
                        {!relation.slug?.includes("id_data") && "[]"}){" "}
                        <IconButton
                          className={styles.copyButton}
                          onClick={() => onRelationCopyClick(relation.slug)}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </div>
                      {openedRelations.includes(relation.slug + index) && <div className={styles.relation} key={relation.slug}>
                        {relation?.fields?.map((field) => (
                          <div key={field.slug} className={styles.row}>
                            {convertLabelds(field.label)} ({field.slug}){" "}
                            <IconButton
                              className={styles.copyButton}
                              onClick={() =>
                                onRelationFieldCopyClick(
                                  field.slug,
                                  relation.slug
                                )
                              }
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </div>
                        ))}
                      </div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Variables;
