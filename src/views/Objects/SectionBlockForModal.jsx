import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button} from "@mui/material";
import React from "react";
import {useParams} from "react-router-dom";
import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import layoutService from "../../services/layoutService";

export default function SectionBlockForModal({
  editAcces,
  section,
  control,
  setFormValue,
  fieldsList,
  formTableSlug,
  relatedTable,
  activeLang,
  errors,
  isMultiLanguage,
  toggleFields,
  computedSections,
  index,
  data,
  setData,
  selectedTabIndex,
}) {
  const {tableSlug} = useParams();

  const updateLayout = (newData) => {
    layoutService.update(newData, tableSlug);
  };

  const removeFieldFromSection = (field) => {
    const newFields = {
      ...data,
      tabs: data?.tabs?.map((tab) => {
        return {
          ...tab,
          sections: tab?.sections?.map((section) => {
            return {
              ...section,
              fields: section?.fields?.filter((f) => f?.id !== field?.id),
            };
          }),
        };
      }),
    };

    setData(newFields);
    updateLayout(newFields);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: "10px",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "baseline",
      }}>
      {section.fields?.map((field, fieldIndex) => (
        <Box
          style={{
            display: "flex",
            alignItems: "flex-end",
            minWidth: "200px",
          }}>
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

          {editAcces && (
            <Button
              onClick={() => removeFieldFromSection(field)}
              sx={{
                height: "38px",
                minWidth: "38px",
                width: "38px",
                borderRadius: "50%",
              }}>
              <DeleteIcon
                style={{
                  color: "red",
                }}
              />
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
}
