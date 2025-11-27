import { Box } from "@chakra-ui/react";
import { CKEditor as Editor } from "@ckeditor/ckeditor5-react";
import CustomBuild from "ckeditor5-custom-build";
import { Controller, useWatch } from "react-hook-form";
import "./redactorOverrides.scss";
import { useEffect, useMemo, useRef } from "react";
import usePaperSize from "../../../../../../hooks/usePaperSize";
import uploadPlugin from "./UploadAdapter";
import useDocumentPaperSize from "../../../../../../hooks/useDocumentPaperSize";

const CKEditor = ({
  name,
  control,
  defaultValue = "",
  required = false,
  form,
}) => {
  let size = form.watch("size");
  const ref = useRef();
  const { selectedPaperSize } = useDocumentPaperSize(size);
  useEffect(() => {
    const editor = ref.current;
    if (!editor) return;

    editor.editing.view.change((writer) => {
      writer.setStyle(
        "width",
        selectedPaperSize.width + "pt",
        editor.editing.view.document.getRoot()
      );
    });
  }, [selectedPaperSize, ref]);

  const fieldList = useWatch({
    control,
    name: "variables",
  });

  const computedFields = useMemo(() => {
    return (
      fieldList?.map((field) => ({
        label: field.label,
        value: `{ ${field.label} }`,
      })) ?? []
    );
  }, [fieldList]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Box className="ck-editor">
            <Editor
              editor={CustomBuild}
              config={{
                variables: {
                  list: computedFields,
                },
                extraPlugins: [uploadPlugin],
                width: 100,
              }}
              data={value ?? ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
              }}
              onReady={(editor) => {
                editor.ui
                  .getEditableElement()
                  .parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                  );
                const wrapper = document.createElement("div");
                wrapper.classList.add("ck-editor__editable-container");
                editor.ui.getEditableElement().parentNode.appendChild(wrapper);
                editor.ui.getEditableElement().style.opacity = 0.5;
                editor.ui.getEditableElement().style.backgroundColor = "red";

                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "width",
                    selectedPaperSize.width + "pt",
                    editor.editing.view.document.getRoot()
                  );
                });
                // editor.ui.getEditableElement().style.width = `${selectedPaperSize.width}pt`\

                wrapper.appendChild(editor.ui.getEditableElement());
                ref.current = editor;
              }}
            />
          </Box>
        </>
      )}
    />
  );
};

export default CKEditor;
