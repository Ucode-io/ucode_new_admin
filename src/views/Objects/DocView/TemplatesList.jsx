import {Add, Delete} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {useLocation, useParams} from "react-router-dom";
import PageFallback from "../../../components/PageFallback";
import SearchInput from "../../../components/SearchInput";
import {generateID} from "../../../utils/generateID";
import styles from "./style.module.scss";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQueryClient} from "react-query";

const TemplatesList = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  templateFields,
  onChange,
  setSelectedOutputTable,
  setSelectedOutputObject,
  setSelectedLinkedObject,
  isLoading,
}) => {
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const onCreateButtonClick = () => {
    const data = {
      id: generateID(),
      title: "NEW",
      type: "CREATE",
      table_slug: tableSlug,
      html: "",
    };
    setSelectedTemplate(data);
    setSelectedOutputTable("");
    setSelectedOutputObject("");
    // setSelectedLinkedObject("");
  };

  const onDelete = async (id) => {
    await constructorObjectService.delete("template", id).then(() => {
      queryClient.refetchQueries("GET_DOCUMENT_TEMPLATE_LIST");
    });
  };

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Шаблоны</div>

        <IconButton onClick={onCreateButtonClick}>
          <Add />
        </IconButton>
      </div>

      <div className={styles.docList}>
        <div className={styles.search_section}>
          <SearchInput size="small" fullWidth onChange={onChange} />
        </div>
        {isLoading ? (
          <PageFallback />
        ) : (
          <div className={styles.templateList}>
            {templates?.map((template) => (
              <div
                key={template.id}
                className={`${styles.row} ${
                  selectedTemplate?.guid === template.guid ? styles.active : ""
                }`}
                onClick={() => setSelectedTemplate(template)}>
                {template.title ?? ""}

                <div className={styles.deleteBtn}>
                  {!location?.state?.isTableView && (
                    <RectangleIconButton
                      color="error"
                      onClick={() => onDelete(template?.guid)}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesList;
