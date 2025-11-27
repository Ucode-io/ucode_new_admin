import React from "react";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import DoneIcon from "@mui/icons-material/Done";
import CellElementGeneratorForRelation from "../../../../components/ElementGenerators/CellElementGeneratorForRelation";
import CellElementGeneratorForTableView from "../../../../components/ElementGenerators/CellElementGeneratorForTableView";
import {useParams} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import constructorObjectService from "../../../../services/constructorObjectService";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";
import ClearIcon from "@mui/icons-material/Clear";

function AddRow({
  fields,
  data,
  setAddRow,
  relatedTableSlug,
  padding = 0,
  field,
  refetch = () => {},
}) {
  const {tableSlug, id} = useParams();
  const dispatch = useDispatch();
  const {mutate: updateObject} = useMutation(() => console.log(""));

  const {
    handleSubmit,
    control,
    setValue: setFormValue,
    formState: {errors},
    watch,
  } = useForm({});

  const onSubmit = (values) => {
    constructorObjectService
      .create(relatedTableSlug, {
        data: {
          ...values,
          [`${field?.attributes?.table_to?.slug || tableSlug}_id`]: id,
        },
      })
      .then((res) => {
        refetch();
        dispatch(showAlert("Successfully created!", "success"));
        setAddRow(false);
      })
      .catch((e) => {
        console.log("ERROR: ", e);
      })
      .finally(() => {});
  };

  return (
    <tr style={{overflow: "scroll"}} id="newRow">
      <td style={{textAlign: "center"}}></td>
      {fields?.map((field, index) => (
        <td style={{padding: 0}}>
          {field?.type === "LOOKUP" || field?.type === "LOOKUPS" ? (
            <CellElementGeneratorForRelation
              key={field?.id}
              isTableView={false}
              isNewRow={true}
              tableSlug={tableSlug}
              name={`multi.${index}.${field.slug}`}
              updateObject={updateObject}
              fields={fields}
              field={field}
              newColumn={true}
              index={index}
              control={control}
              setFormValue={setFormValue}
              data={data}
            />
          ) : (
            <CellElementGeneratorForTableView
              newColumn={true}
              tableSlug={tableSlug}
              isNewRow={true}
              watch={watch}
              updateObject={updateObject}
              fields={fields}
              field={field}
              index={index}
              control={control}
              setFormValue={setFormValue}
              data={data}
            />
          )}
        </td>
      ))}
      <td
        style={{
          width: "100%",
          padding: padding,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}>
        <RectangleIconButton color="success" onClick={handleSubmit(onSubmit)}>
          <DoneIcon color="success" />
        </RectangleIconButton>
        <RectangleIconButton
          color="success"
          onClick={() => {
            setAddRow(false);
          }}>
          <ClearIcon color="error" />
        </RectangleIconButton>
      </td>
    </tr>
  );
}

export default AddRow;
