import {BackupTable, ImportExport} from "@mui/icons-material";
import printJS from "print-js";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useDebounce from "../../../hooks/useDebounce";
import usePaperSize from "../../../hooks/usePaperSize";
import constructorObjectService from "../../../services/constructorObjectService";
import documentTemplateService from "../../../services/documentTemplateService";
import {
  pixelToMillimeter,
  pointToMillimeter,
} from "../../../utils/SizeConverters";
import DocumentSettingsTypeSelector from "../components/DocumentSettingsTypeSelector";

import ViewTabSelector from "../components/ViewTypeSelector";
import DocRelationsSection from "./DocRelationsSection";
import DocSettingsBlock from "./DocSettingsBlock";
import {contentStyles} from "./editorContentStyles";
import RedactorBlock from "./RedactorBlock";
import styles from "./style.module.scss";
import TemplatesList from "./TemplatesList";
import {useTranslation} from "react-i18next";
import constructorTableService from "../../../services/constructorTableService";

const DocView = ({views, selectedTabIndex, setSelectedTabIndex}) => {
  const redactorRef = useRef();
  const {state} = useLocation();
  const {tableSlug} = useParams();
  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const [defaultViewTab, setDefaultViewTab] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
  const userId = useSelector((state) => state.auth.userId);

  // =====SETTINGS BLOCK=========
  const [pdfLoader, setPdfLoader] = useState(false);
  const [htmlLoader, setHtmlLoader] = useState(false);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(1);
  const [relationViewIsActive, setRelationViewIsActive] = useState(false);
  const [selectedPaperSizeIndex, setSelectedPaperSizeIndex] = useState(0);
  const [selectedOutputTable, setSelectedOutputTable] = useState("");
  const [selectedOutputObject, setSelectedOutputObject] = useState("");
  const [selectedLinkedObject, setSelectedLinkedObject] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [selectedView, setSelectedView] = useState(null);
  const selectLinkedObject = selectedObject?.value;

  // ============SELECTED LINKED TABLE SLUG=============
  const selectedLinkedTableSlug = selectedLinkedObject
    ? selectedLinkedObject?.split("#")?.[1]
    : tableSlug;

  const {selectedPaperSize} = usePaperSize(selectedPaperSizeIndex);

  const [selectedTemplate, setSelectedTemplate] = useState(
    state?.template ?? null
  );

  const params = {
    language_setting: i18n?.language,
  };

  // ========FIELDS FOR RELATIONS=========
  const {data: fields = [], isLoading: fieldsLoading} = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      {tableSlug: selectedLinkedTableSlug, limit: 0, offset: 0},
      i18n?.language,
    ],
    () => {
      return constructorTableService.getTableInfo(
        selectedLinkedTableSlug,
        {
          data: {limit: 0, offset: 0, with_relations: true},
        },
        params
      );
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];

        return [...fields, ...relationFields]?.filter(
          (el) => el.type !== "LOOKUP"
        );
      },
    }
  );
  // ========GET TEMPLATES LIST===========
  const {
    data: {templates, templateFields} = {templates: [], templateFields: []},
    isLoading,
    refetch,
  } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug, searchText],
    () => {
      const data = {
        limit: 10,
        offset: 0,
        view_fields: ["title"],
        search: searchText,
        additional_request: {
          additional_field: ["guid"],
          additional_values: [state?.template?.guid],
        },
      };

      data[`${loginTableSlug}_ids`] = [userId];

      return constructorObjectService.getListV2("template", {
        data,
      });
    },
    {
      cacheTime: 10,
      select: ({data}) => {
        const templates = data?.response ?? [];
        const templateFields = data?.fields ?? [];

        return {
          templates,
          templateFields,
        };
      },
      onSuccess: () => {
        setVariable();
        exportToHTML();
      },
    }
  );

  // ========UPDATE TEMPLATE===========

  const updateTemplate = (template) => {
    refetch();
  };

  // ==========SEARCH TEMPLATES=========
  const inputChangeHandler = useDebounce((val) => setSearchText(val), 300);

  // ========ADD NEW TEMPLATE=========
  const addNewTemplate = (template) => {
    refetch();
  };

  //=========SET VARIABLE===========
  const setVariable = () => {
    if (state && selectedLinkedObject && selectedObject) {
      exportToHTML();
    }
  };

  // =======EXPORT TO PDF============
  const exportToPDF = async () => {
    if (!selectedTemplate) return;
    setPdfLoader(true);

    try {
      let html = redactorRef.current.getData();

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><style>${contentStyles}</style>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      const tables = tempElement.querySelectorAll("table");

      let pageSize = pointToMillimeter(selectedPaperSize.height);
      let pageWidth = pointToMillimeter(selectedPaperSize.width);
      let extraWidth =
        pointToMillimeter(selectedPaperSize.width) === 100
          ? 213
          : pageWidth === 105
            ? 0
            : 175;
      let extraHeight = pageSize === 148 ? 70 : 0;

      tables.forEach((table) => {
        table.style.width = `${pageWidth === 100 ? "50%" : "100%"}`;
        table.style.borderRightCollapse = "collapse";
      });

      if (selectedPaperSize.height === 1000) {
        pageSize = pixelToMillimeter();
        document.querySelector(".ck-content").offsetHeight - 37;
      }

      const res = await documentTemplateService.exportToPDF({
        data: {
          linked_table_slug: selectedLinkedTableSlug,
          linked_object_id: selectedObject?.value,
          page_size: selectedPaperSize.name,
          page_height: pageSize + extraHeight,
          page_width: pointToMillimeter(selectedPaperSize.width),
          object_id: selectedOutputObject?.value?.split("#")?.[0],
          table_slug: selectedOutputTable?.split("#")?.[1],
        },
        html: `${meta} <div class="ck-content" style="width: ${
          pointToMillimeter(selectedPaperSize.width) + extraWidth
        }mm  display: 'none'" >${tempElement.innerHTML}</div>`,
      });

      queryClient.refetchQueries([
        "GET_OBJECT_FILES",
        {tableSlug, selectLinkedObject},
      ]);

      window.open(res.link, {target: "_blank"});
    } finally {
      setPdfLoader(false);
    }
  };

  // ========EXPORT TO HTML===============

  const exportToHTML = async () => {
    if (!selectedTemplate) return;
    setHtmlLoader(true);

    try {
      let html = redactorRef.current.getData();
      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      html = html.replace(/<div\s+class="raw-html-embed">/, "");
      html = html.replace(/<\/div>/, "");

      const res = await documentTemplateService.exportToHTML(
        {
          data: {
            table_slug: tableSlug,
            linked_object_id: selectedObject?.value,
            linked_table_slug: selectedLinkedTableSlug,
          },
          html: meta + html,
        },
        tableSlug
      );

      setSelectedTemplate((prev) => ({
        ...prev,
        html: res.html.replaceAll("<p></p>", ""),
        size: [selectedPaperSize?.name],
      }));
    } finally {
      setHtmlLoader(false);
    }
  };

  // =======PRINT============

  const print = async () => {
    if (!selectedTemplate) return;
    setPdfLoader(true);

    try {
      let html = redactorRef.current.getData();
      const selectedSizeWidth =
        selectedPaperSize?.name === "A6"
          ? `${250}mm`
          : `${selectedPaperSize?.width}pt`;

      const selectedSizeHeight =
        selectedPaperSize?.name === "A6"
          ? `${270}mm`
          : `${selectedPaperSize?.height}pt`;

      const tdHeight = selectedPaperSize?.name === "A6" ? 30 : 45;

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      const computedHTML = `${meta} ${html} `;
      console.log(computedHTML);
      printJS({
        printable: computedHTML,
        type: "raw-html",
        style: [
          `@page { size: ${selectedSizeWidth} ${selectedSizeHeight}; margin: 5mm 10mm 0mm} body { margin: 0 auto, line-height: 12px } table {width: 100%} td ${tdHeight} `,
        ],
        targetStyles: ["*"],
      });
    } finally {
      setPdfLoader(false);
    }
  };

  useEffect(() => {
    setVariable();
  }, [state, selectedLinkedObject, selectedObject]);

  return (
    <div>
      <FiltersBlock
        style={{padding: 0}}
        extra={
          <>
            <DocumentSettingsTypeSelector
              selectedTabIndex={selectedSettingsTab}
              setSelectedTabIndex={setSelectedSettingsTab}
            />
          </>
        }>
        {/* <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        /> */}

        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          settingsModalVisible={settingsModalVisible}
          setSettingsModalVisible={setSettingsModalVisible}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          defaultViewTab={defaultViewTab}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
        />
      </FiltersBlock>

      <div className={styles.mainBlock}>
        <TemplatesList
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onChange={inputChangeHandler}
          setSelectedOutputTable={setSelectedOutputTable}
          setSelectedOutputObject={setSelectedOutputObject}
          setSelectedLinkedObject={setSelectedLinkedObject}
          isLoading={isLoading}
        />

        {relationViewIsActive && (
          <div className={styles.redactorBlock}>
            <DocRelationsSection />
          </div>
        )}

        {!relationViewIsActive && (
          <>
            {selectedTemplate ? (
              <>
                {fieldsLoading ? (
                  <PageFallback />
                ) : (
                  <RedactorBlock
                    templateFields={templateFields}
                    selectedObject={selectedObject}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    updateTemplate={updateTemplate}
                    addNewTemplate={addNewTemplate}
                    ref={redactorRef}
                    fields={fields}
                    selectedPaperSizeIndex={selectedPaperSizeIndex}
                    setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
                    htmlLoader={htmlLoader}
                    exportToHTML={exportToHTML}
                    exportToPDF={exportToPDF}
                    pdfLoader={pdfLoader}
                    print={print}
                    selectedOutputTable={selectedOutputTable}
                    selectedLinkedObject={selectedLinkedObject}
                  />
                )}
              </>
            ) : (
              <div className={`${styles.redactorBlock} `} />
            )}
          </>
        )}

        <DocSettingsBlock
          pdfLoader={pdfLoader}
          htmlLoader={htmlLoader}
          exportToPDF={exportToPDF}
          exportToHTML={exportToHTML}
          selectedSettingsTab={selectedSettingsTab}
          selectedPaperSizeIndex={selectedPaperSizeIndex}
          setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
          setSelectedOutputTable={setSelectedOutputTable}
          selectedOutputTable={selectedOutputTable}
          selectedOutputObject={selectedOutputObject}
          setSelectedOutputObject={setSelectedOutputObject}
          templates={templates}
          selectedTemplate={selectedTemplate}
          selectedLinkedObject={selectedLinkedObject}
          setSelectedLinkedObject={setSelectedLinkedObject}
          setSelectedObject={setSelectedObject}
          selectedObject={selectedObject}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default DocView;
