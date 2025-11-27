import React, {useEffect, useState} from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import constructorViewService from "../../../../services/constructorViewService";
import FieldOptionModal from "../../../../components/DataTable/FieldOptionModal";
import FieldCreateModal from "../../../../components/DataTable/FieldCreateModal";
import {
  useRelationFieldUpdateMutation,
  useRelationsCreateMutation,
} from "../../../../services/relationService";
import {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "../../../../services/constructorFieldService";
import {transliterate} from "../../../../utils/textTranslater";
import {generateGUID} from "../../../../utils/generateID";
import {Box} from "@mui/material";
import {showAlert} from "../../../../store/alert/alert.thunk";

export default function TableFieldButton({view, setDrawerState, menuItem}) {
  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const [searchParams, setSearchParams] = useSearchParams();
  const {tableSlug} = useParams();
  const dispatch = useDispatch();
  const {control, watch, setValue, reset, handleSubmit} = useForm();
  const [fieldData, setFieldData] = useState();
  const slug = transliterate(watch(`attributes.label_${languages[0]?.slug}`));
  const [fieldOptionAnchor, setFieldOptionAnchor] = useState(null);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [drawerStateField, setDrawerStateField] = useState(null);
  const [target, setTarget] = useState(null);
  const handleOpenFieldDrawer = (column) => {
    if (column?.attributes?.relation_data) {
      setDrawerStateField(column);
    } else {
      setDrawerState(column);
    }
  };
  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns
          ? [...new Set([...view?.columns, column])]
          : [column],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  const {mutate: createField, isLoading: createLoading} =
    useFieldCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful created", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: updateField, isLoading: updateLoading} =
    useFieldUpdateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: createRelation, isLoading: realationLoading} =
    useRelationsCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: updateRelation, isLoading: realationUpdateLoading} =
    useRelationFieldUpdateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });
  const onSubmit = (values) => {
    const data = {
      ...values,
      slug: slug,
      table_id: menuItem?.table_id,
      label: slug,
      index: "string",
      required: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
      attributes: {
        ...values.attributes,
        formula: values?.attributes?.advanced_type
          ? values?.attributes?.formula
          : values?.attributes?.from_formula +
            " " +
            values?.attributes?.math?.value +
            " " +
            values?.attributes?.to_formula,
      },
    };

    const relationData = {
      ...values,
      relation_table_slug: tableSlug,
      type: values.relation_type ? values.relation_type : values.type,
      required: false,
      multiple_insert: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
    };
    if (!fieldData) {
      if (values?.type !== "RELATION") {
        createField({data, tableSlug});
      }
      if (values?.type === "RELATION") {
        createRelation({data: relationData, tableSlug});
      }
    }
    if (fieldData) {
      if (values?.view_fields) {
        updateRelation({data: values, tableSlug});
      } else {
        updateField({data, tableSlug});
      }
    }
  };

  useEffect(() => {
    if (fieldData) {
      reset({
        ...fieldData,
        attributes: {
          ...fieldData.attributes,
          format: fieldData?.type,
        },
      });
    } else {
      reset({
        attributes: {
          math: {label: "plus", value: "+"},
        },
      });
    }
  }, [fieldData]);

  return (
    <>
      <Box
        onClick={(e) => {
          setFieldOptionAnchor(e.currentTarget);
          setTarget(e.currentTarget);
          setFieldData(null);
        }}
        sx={{
          width: "100%",
          height: "100%",
          color: "#747474",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          // borderRadius: "8px",
          cursor: "pointer",
          background: "#F9FAFB",
        }}>
        <AddRoundedIcon sx={{fontSize: "24px"}} />
      </Box>
      <FieldOptionModal
        anchorEl={fieldOptionAnchor}
        setAnchorEl={setFieldOptionAnchor}
        setFieldCreateAnchor={setFieldCreateAnchor}
        setValue={setValue}
        target={target}
      />
      {fieldCreateAnchor && (
        <FieldCreateModal
          anchorEl={fieldCreateAnchor}
          setAnchorEl={setFieldCreateAnchor}
          watch={watch}
          control={control}
          setValue={setValue}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          target={target}
          setFieldOptionAnchor={setFieldOptionAnchor}
          reset={reset}
          menuItem={menuItem}
          fieldData={fieldData}
          handleOpenFieldDrawer={handleOpenFieldDrawer}
        />
      )}
    </>
  );
}
