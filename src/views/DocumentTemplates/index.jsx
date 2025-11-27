import { Button, IconButton } from "@mui/material";
import styles from "./index.module.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  useDocxTemplateConvertToPDFMutation,
  useDocxTemplatesQuery,
} from "../../services/docxTemplateService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import ObjectForm from "./components/ObjectForm";
import { useDispatch } from "react-redux";
import { mainActions } from "../../store/main/main.slice";
import Viewer from "./components/Viewer";
import useSearchParams from "../../hooks/useSearchParams";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const breadCrumbItems = [
  { label: "ЭДО", link: "" },
  { label: "Список шаблонов", link: "" },
  { label: "Новый шаблон", link: "" },
];

const DocumentTemplates = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tableSlug, appId } = useParams();
  const [step, setStep] = useState("TEMPLATES");
  // const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();

  const [pdfIsLoading, setPDFIsLoading] = useState(false);

  const selectedTemplateId = searchParams.get("templateId");
  const setSelectedTemplateId = useCallback(
    (id) => updateSearchParam("templateId", id),
    [updateSearchParam]
  );

  //  ===== FORM =========
  const form = useForm({});

  // ===== TEMPLATES QUERY ===========
  const { data: templates, isLoading } = useDocxTemplatesQuery({
    params: {
      "table-slug": tableSlug,
    },
    querySettings: {
      select: (res) => {
        return res.docx_templates?.filter((el) => el.title) ?? [];
      },
    },
  });

  // ===== SELECTED TEMPLATE ===========
  const selectedTemplate = useMemo(() => {
    return templates?.find((el) => el.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  // ===== AUTO SELECT TEMPLATE ===========
  // useEffect(() => {
  //   if (!templates?.length || selectedTemplate) return;

  //   setSelectedTemplateId(templates[0]?.id);
  // }, [selectedTemplate, templates, setSelectedTemplateId]);

  // ===== ON DOWNLOAD ==============

  const { mutate: converToPDF } = useDocxTemplateConvertToPDFMutation({
    onSuccess: (res) => {
      const href = URL.createObjectURL(res);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", `${selectedTemplate?.title}.pdf`); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      setPDFIsLoading(false);
    },
    onError: () => {
      setPDFIsLoading(false);
    },
  });

  const onPDFDownloadClick = (e) => {
    setPDFIsLoading(true);
    const url = `https://${selectedTemplate?.file_url}`;
    const data = form?.getValues();

    console.log("GGGG =>", url);

    converToPDF({
      data: {
        data,
        id: searchParams.get("id"),
        table_slug: tableSlug,
      },
      link: url,
    });
  };

  // ===== SIDEBAR CLOSING ===========
  useEffect(() => {
    setTimeout(() => {
      dispatch(mainActions.setSettingsSidebarIsOpen(false));
      dispatch(mainActions.setSubMenuIsOpen(false));
    }, 2000);
  }, []);

  // ===== RENDER ===========

  if (isLoading) return <RingLoaderWithWrapper style={{ height: "100vh" }} />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.homeButton}>
          <img src="/img/homeIcon.svg" alt="" />
        </div>

        {breadCrumbItems?.map((item, index) => (
          <>
            <div className={styles.arrowIcon}>
              <KeyboardArrowRightIcon
                sx={{ color: "#D0D5DD", height: "19px" }}
              />
            </div>
            <div
              className={`${styles.item} ${index === breadCrumbItems?.length - 1 ? styles.active : ""}`}
            >
              {item.label}
            </div>
          </>
        ))}
      </div>

      {templates && (
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>
            <IconButton
              onClick={() => {
                console.log("ggg =>", selectedTemplateId)
                if (selectedTemplateId) setSelectedTemplateId('');
                else
                  navigate(
                    `/main/${appId}/object/${tableSlug}?menuId=${searchParams.get("menuId")}`
                  );
              }}
              className={styles.backButton}
            >
              <ArrowBackIcon />
            </IconButton>
            {selectedTemplateId ? selectedTemplate?.title : "Выберите шаблон"}
          </h3>

          {selectedTemplate && (
            <div className={styles.buttons}>
              <Button
                variant="outlined"
                style={{ borderColor: "#337E28", color: "#337E28" }}
                className={styles.secondaryButton}
                onClick={() => {
                  navigate(
                    `${pathname}/${selectedTemplateId}?id=${searchParams.get("id")}&menuId=${searchParams.get("menuId")}`
                  );
                }}
              >
                Изменить шаблон
              </Button>
              <LoadingButton
                loading={pdfIsLoading}
                onClick={onPDFDownloadClick}
                variant="contained"
                className={styles.primaryButton}
              >
                Скачать PDF
              </LoadingButton>
            </div>
          )}
        </div>
      )}

      {!templates?.length ? (
        <div className={styles.noDataWrapper}>
          <FileOpenIcon />
          <div className={styles.noDataText}>
            Пока нет шаблонов. Сначала создайте шаблон
          </div>
          <div style={{ width: "300px" }}>
            <Button
              variant="outlined"
              className={styles.addTemplateButton}
              onClick={() => {
                navigate(`${pathname}/create`);
              }}
            >
              Создать шаблон
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.content}>
            {!selectedTemplateId ? (
              <div className={styles.templatesList}>
                {/* <p className={styles.title}>Выберите шаблон</p> */}

                <div className={styles.list}>
                  {templates?.map((template) => (
                    <div
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={styles.row}
                      key={template.id}
                    >
                      <DescriptionIcon className={styles.icon} />
                      {template.title}
                    </div>
                  ))}
                  <div className={styles.buttonWrapper}>
                    <Button
                      variant="outlined"
                      className={styles.addTemplateButton}
                      onClick={() => {
                        navigate(`${pathname}/create`);
                      }}
                    >
                      Создать шаблон
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.form}>
                <ObjectForm
                  form={form}
                  onBackButtonClick={() => setSelectedTemplateId("")}
                />
              </div>
            )}
            <div className={styles.viewer}>
              <Viewer
                url={
                  selectedTemplate?.pdf_url
                    ? `https://${selectedTemplate?.pdf_url}`
                    : `https://cdn-api.ucode.run/docs/9533890a-d5d8-4adc-8573-f60bb76c2e3c.pdf`
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentTemplates;
