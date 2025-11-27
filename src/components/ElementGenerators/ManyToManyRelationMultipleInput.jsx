import {memo, useEffect, useMemo, useState} from "react";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";

import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import {getRelationFieldLabel} from "../../utils/getRelationFieldLabel";
import {pageToOffset} from "../../utils/pageToOffset";
import request from "../../utils/request";
import FEditableRow from "../FormElements/FEditableRow";
import FRow from "../FormElements/FRow";
import CascadingSection from "./CascadingSection/CascadingSection";
import styles from "./style.module.scss";

import {Box, Button} from "@mui/material";
import ManyToManySelect from "./ManyToManySelect";

const ManyToManyRelationFormElement = memo(
  ({
    control,
    field,
    isLayout,
    sectionIndex,
    fieldIndex,
    name = "",
    column,
    mainForm,
    disabledHelperText,
    autocompleteProps = {},
    disabled = false,
    checkRequiredField,
    setFormValue,
    ...props
  }) => {
    const tableSlug = useMemo(() => {
      return field.id?.split("#")?.[0] ?? "";
    }, [field.id]);
    const {i18n} = useTranslation();

    if (!isLayout)
      return (
        <FRow
          label={
            field?.attributes[`title_${i18n?.language}`] ??
            field?.attributes[`name${i18n?.language}`] ??
            field?.attributes[`label${i18n?.language}`] ??
            field?.label ??
            field.title ??
            " "
          }
          required={field.required}>
          <Controller
            control={control}
            name={`${name}_ids` || `${tableSlug}_ids`}
            defaultValue={null}
            {...props}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <AutoCompleteElement
                value={value}
                setValue={onChange}
                setFormValue={setFormValue}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
                control={control}
                name={`${name}_ids` || `${tableSlug}_ids`}
                {...autocompleteProps}
              />
            )}
          />
        </FRow>
      );

    return (
      <Controller
        control={mainForm.control}
        name={`sections[${sectionIndex}].fields[${fieldIndex}].field_name`}
        defaultValue={field.label}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FEditableRow
            label={value}
            onLabelChange={onChange}
            required={checkRequiredField}>
            <Controller
              control={control}
              name={`${tableSlug}_id`}
              defaultValue={null}
              render={({field: {onChange, value}, fieldState: {error}}) =>
                field?.attributes?.cascadings?.length > 1 ? (
                  <CascadingSection
                    disabled={disabled}
                    value={value}
                    setValue={onChange}
                    field={field}
                    tableSlug={tableSlug}
                    error={error}
                    disabledHelperText={disabledHelperText}
                    control={control}
                  />
                ) : (
                  <AutoCompleteElement
                    disabled={disabled}
                    value={value}
                    setValue={onChange}
                    field={field}
                    tableSlug={tableSlug}
                    error={error}
                    disabledHelperText={disabledHelperText}
                    control={control}
                  />
                )
              }
            />
          </FEditableRow>
        )}></Controller>
    );
  }
);

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = memo(
  ({
    field,
    value,
    tableSlug,
    setValue,
    control,
    setFormValue,
    error,
    disabled,
    disabledHelperText,
    name,
  }) => {
    console.log("nameeeeeeeeeeee", name);
    const {navigateToForm} = useTabRouter();
    const [debouncedValue, setDebouncedValue] = useState("");
    const newForm = useForm();
    const [page, setPage] = useState(1);
    const [check, setCheck] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const {i18n} = useTranslation();

    const multiple_selects = useWatch({
      control: newForm.control,
      name: "multiple_select",
    });

    const autoFilters = field?.attributes?.auto_filters;

    const {
      fields: relationFields,
      append,
      remove,
    } = useFieldArray({
      control: newForm.control,
      name: "multiple_select",
    });

    const multiple_select = useWatch({
      control: newForm.control,
      name: "multiple_select",
    });

    const autoFiltersFieldFroms = useMemo(() => {
      return autoFilters?.map((el) => el.field_from) ?? [];
    }, [autoFilters]);

    const filtersHandler = useWatch({
      control,
      name: autoFiltersFieldFroms,
    });

    const autoFiltersValue = useMemo(() => {
      const result = {};
      filtersHandler?.forEach((value, index) => {
        const key = autoFilters?.[index]?.field_to;
        if (key) result[key] = value;
      });
      return result;
    }, [autoFilters, filtersHandler]);

    const {data: fromInvokeList} = useQuery(
      ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue, page],
      () => {
        return request.post(
          `/invoke_function/${field?.attributes?.function_path}`,
          {
            params: {
              from_input: true,
            },
            data: {
              ...autoFiltersValue,
              view_fields: [`name_langs_${i18n?.language}`],
              additional_request: {
                additional_field: "guid",
                additional_values: value,
              },

              search: debouncedValue,
              limit: 10,
              offset: pageToOffset(page, 10),
            },
          }
        );
      },
      {
        enabled: !!field?.attributes?.function_path,
        select: (res) => {
          return res?.data?.response ?? [];
        },
        onSuccess: (data) => {
          if (page > 1) {
            setAllOptions((prevOptions) => [...prevOptions, ...data]);
          } else {
            setAllOptions(data);
          }
        },
      }
    );

    const {data: fromObjectList} = useQuery(
      [
        "GET_OBJECT_LIST",
        tableSlug,
        autoFiltersValue,
        debouncedValue,
        page,
        field?.attributes?.view_fields,
      ],
      () => {
        return constructorObjectService.getListV2(
          tableSlug,
          {
            data: {
              ...autoFiltersValue,
              view_fields:
                field?.view_fields?.map((field) => field.slug) ??
                field?.attributes?.view_fields?.map((field) => field.slug),

              additional_request: {
                additional_field: "guid",
                additional_values: value,
              },

              search: debouncedValue,
              limit: 10,
              offset: pageToOffset(page, 10),
            },
          },
          {
            language_setting: i18n?.language,
          }
        );
      },
      {
        enabled: !field?.attributes?.function_path,
        select: (res) => {
          return res?.data?.response ?? [];
        },
        onSuccess: (data) => {
          if (page > 1) {
            setAllOptions((prevOptions) => [...prevOptions, ...data]);
          } else {
            setAllOptions(data);
          }
        },
      }
    );

    const options = useMemo(() => {
      return fromObjectList ?? fromInvokeList;
    }, [fromInvokeList, fromObjectList]);

    const computedValue = useMemo(() => {
      if (!value) return [];

      const result = value
        ?.map((id) => {
          const option = allOptions?.find((el) => el?.guid === id);

          if (!option) return null;
          return {
            ...option,
          };
        })
        ?.filter((el) => el);

      return result?.map((item) => ({
        label: getRelationFieldLabel(field, item),
        value: item?.guid,
      }));
    }, [value, allOptions, field?.attributes?.view_fields]);

    const computedOptions = useMemo(() => {
      const uniqueObjects =
        Array.from(new Set(allOptions.map(JSON.stringify)))
          .map(JSON.parse)
          ?.map((item) => ({
            label: getRelationFieldLabel(field, item),
            value: item?.guid,
          })) ?? [];

      return uniqueObjects ?? [];
    }, [allOptions, options, value]);

    const computedOptionForValue = useMemo(() => {
      const uniqueObjects =
        Array.from(new Set(allOptions.map(JSON.stringify)))
          .map(JSON.parse)
          ?.map((item) => ({
            label: getRelationFieldLabel(field, item),
            value: item?.guid,
          })) ?? [];

      return uniqueObjects?.filter((item) => {
        return !value?.includes(item?.value);
      });
    }, [allOptions, options, value]);

    function loadMoreItems() {
      if (field?.attributes?.function_path) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    }

    const appendInput = () => {
      append({});
    };

    useEffect(() => {
      if (computedValue.length > 0 && !multiple_select?.length > 0) {
        newForm.setValue(
          `multiple_select`,
          computedValue?.map((item) => ({
            value: item?.value,
          }))
        );
      }
    }, [computedValue]);

    useEffect(() => {
      newForm.setValue(
        `multiple_select`,
        computedValue?.map((item) => ({
          value: item?.value,
        }))
      );
    }, [computedValue?.length, value]);

    useEffect(() => {
      if (!value?.length) {
        appendInput();
      }
    }, []);

    return (
      <div className={styles.autocompleteWrapper}>
        <div
          className={styles.createButton}
          onClick={() => navigateToForm(tableSlug)}>
          Create new
        </div>

        {relationFields?.map((element, index) => (
          <Box sx={{padding: "5px 0"}}>
            <ManyToManySelect
              newForm={newForm}
              setValue={setValue}
              index={index}
              element={element}
              loadMoreItems={loadMoreItems}
              computedOptions={computedOptions}
              computedOptionForValue={computedOptionForValue}
              setDebouncedValue={setDebouncedValue}
              setFormValue={setFormValue}
              remove={remove}
              value={value}
              computedValue={computedValue}
              append={append}
              appendInput={appendInput}
            />
          </Box>
        ))}

        <Button
          sx={{cursor: "pointer", textAlign: "center"}}
          variant="contained"
          onClick={appendInput}>
          Add
        </Button>
      </div>
    );
  }
);

export default ManyToManyRelationFormElement;
