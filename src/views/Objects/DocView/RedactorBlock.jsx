import {Delete, PictureAsPdf, Print} from "@mui/icons-material";
import {Card, CircularProgress} from "@mui/material";
import {forwardRef, useMemo, useState} from "react";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import Footer from "../../../components/Footer";
import HFAutoWidthInput from "../../../components/FormElements/HFAutoWidthInput";
import usePaperSize from "../../../hooks/usePaperSize";
import constructorObjectService from "../../../services/constructorObjectService";
import documentTemplateService from "../../../services/documentTemplateService";
import DropdownButton from "../components/DropdownButton";
import DropdownButtonItem from "../components/DropdownButton/DropdownButtonItem";
import Redactor from "./Redactor";
import styles from "./style.module.scss";
import {useQueryClient} from "react-query";
import Dialog from "@mui/material/Dialog";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const RedactorBlock = forwardRef(
  (
    {
      templateFields,
      selectedObject,
      selectedTemplate,
      setSelectedTemplate,
      updateTemplate,
      addNewTemplate,
      tableViewIsActive,
      fields,
      selectedPaperSizeIndex,
      setSelectedPaperSizeIndex,
      exportToPDF,
      exportToHTML,
      htmlLoader,
      pdfLoader,
      print,
      selectedOutputTable,
      selectedLinkedObject,
    },
    redactorRef
  ) => {
    const {tableSlug, appId} = useParams();
    const {control, handleSubmit, reset} = useForm();
    const [btnLoader, setBtnLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
    const userId = useSelector((state) => state.auth.userId);
    const queryClient = useQueryClient();
    const selectTableSlug = selectedLinkedObject
      ? selectedLinkedObject?.split("#")?.[1]
      : tableSlug;
    const {selectedPaperSize, selectPaperIndexBySize, selectPaperIndexByName} =
      usePaperSize(selectedPaperSizeIndex);

    const getFilteredData = useMemo(() => {
      return templateFields
        .filter((i) => i.type === "LOOKUP")
        .find((i) => i.table_slug === tableSlug);
    }, [templateFields, tableSlug]);

    useEffect(() => {
      reset({
        ...selectedTemplate,
        html: selectedTemplate.html,
      });
      setSelectedPaperSizeIndex(
        selectPaperIndexByName(selectedTemplate.size?.[0])
      );
    }, [
      selectedTemplate,
      reset,
      setSelectedPaperSizeIndex,
      selectPaperIndexByName,
    ]);

    const onSubmit = async (values) => {
      try {
        setBtnLoader(true);

        const savedData = redactorRef.current.getData();
        const data = {
          ...values,
          object_id: values?.objectId ?? "",
          html: savedData ?? "",
          size: [selectedPaperSize.name],
          title: values.title,
          table_slug: tableSlug,
          [getFilteredData?.slug]: selectedObject ?? undefined,
          output_object: selectedOutputTable?.split("#")?.[1],
          linked_object:
            selectedLinkedObject && selectedLinkedObject?.split("#")?.[1],
        };

        if (loginTableSlug && values.type === "CREATE") {
          data[`${loginTableSlug}_ids`] = [userId];
        }

        if (values.type !== "CREATE") {
          await constructorObjectService.update("template", {data});
          updateTemplate(data);
        } else {
          const res = await constructorObjectService.create("template", {
            data,
          });
          addNewTemplate(res);
        }

        setSelectedTemplate(null);
        queryClient.refetchQueries("GET_OBJECT_LIST", {selectTableSlug});
      } catch (error) {
        console.log(error);
        setBtnLoader(false);
      }
    };

    return (
      <div
        className={`${styles.redactorBlock} ${
          tableViewIsActive ? styles.hidden : ""
        }`}>
        <div
          className={styles.pageBlock}
          // style={{ width: selectedPaperSize.width + 'pt' }}
        >
          <div className={styles.templateName}>
            <HFAutoWidthInput
              control={control}
              name="title"
              inputStyle={{fontSize: 20}}
            />
          </div>

          <div className={styles.pageSize}>
            {selectedPaperSize.name} ({selectedPaperSize.width} x{" "}
            {selectedPaperSize.height})
          </div>

          <Redactor
            ref={redactorRef}
            control={control}
            fields={fields}
            selectedPaperSizeIndex={selectedPaperSizeIndex}
          />
        </div>

        <Footer
          extra={
            <>
              {!location?.state?.isTableView && (
                <div
                  onClick={() => handleClickOpen()}
                  className={styles.saveButton}>
                  {btnLoader && (
                    <CircularProgress color="secondary" size={15} />
                  )}
                  Save
                </div>
              )}
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <Card className={styles.card}>
                  <div className={styles.body}>
                    Are you really want to save?
                  </div>

                  <div className={styles.footer}>
                    <SecondaryButton
                      className={styles.button}
                      onClick={handleClose}>
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      className={styles.button}
                      color="error"
                      onClick={handleSubmit(onSubmit)}>
                      Yes
                    </PrimaryButton>
                  </div>
                </Card>
              </Dialog>
              <DropdownButton
                onClick={exportToHTML}
                loader={pdfLoader || htmlLoader}
                text="Generate and edit">
                <DropdownButtonItem onClick={exportToPDF}>
                  <PictureAsPdf />
                  Generate PDF
                </DropdownButtonItem>
                <DropdownButtonItem onClick={print}>
                  <Print />
                  Print
                </DropdownButtonItem>
              </DropdownButton>
            </>
          }
        />
      </div>
    );
  }
);

export default RedactorBlock;
