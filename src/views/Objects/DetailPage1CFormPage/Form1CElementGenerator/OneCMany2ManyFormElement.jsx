import {useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import styles from "./style.module.scss";
import Select from "react-select";
import {useSearchParams} from "react-router-dom";
import FEditableRow from "../../../../components/FormElements/FEditableRow";
import request from "../../../../utils/request";
import constructorObjectService from "../../../../services/constructorObjectService";
import {pageToOffset} from "../../../../utils/pageToOffset";
import useDebounce from "../../../../hooks/useDebounce";
import useTabRouter from "../../../../hooks/useTabRouter";
import {getRelationFieldLabel} from "../../../../utils/getRelationFieldLabel";

const OneCMany2ManyFormElement = ({
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
  ...props
}) => {
  const {i18n} = useTranslation();

  const tableSlug = useMemo(() => {
    return field.id?.split("#")?.[0] ?? "";
  }, [field.id]);

  const label =
    field?.attributes[`title_${i18n?.language}`] ||
    field?.attributes[`name_${i18n?.language}`] ||
    field?.attributes[`label_to_${i18n?.language}`] ||
    field?.attributes[`label_${i18n?.language}`] ||
    field?.label ||
    field.title;

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name || `${tableSlug}_ids`}
        defaultValue={null}
        {...props}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <AutoCompleteElement
            value={value}
            setValue={onChange}
            field={field}
            tableSlug={tableSlug}
            error={error}
            disabledHelperText={disabledHelperText}
            control={control}
            {...autocompleteProps}
          />
        )}
      />
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
            render={({field: {onChange, value}, fieldState: {error}}) => (
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
            )}
          />
        </FEditableRow>
      )}></Controller>
  );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({field, value, tableSlug, setValue, control}) => {
  const {navigateToForm} = useTabRouter();
  const [debouncedValue, setDebouncedValue] = useState("");

  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const autoFilters = field?.attributes?.auto_filters;

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
              additional_values: [value],
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

    if (Array.isArray(value)) {
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
    } else {
      const result = allOptions?.filter((el) => el?.guid === value);

      return result?.map((item) => ({
        label: getRelationFieldLabel(field, item),
        value: item?.guid,
      }));
    }
  }, [value, allOptions, i18n?.language, field?.attributes?.view_fields]);

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(
      new Set(allOptions.map(JSON.stringify))
    ).map(JSON.parse);
    return (
      uniqueObjects?.map((item) => ({
        label: getRelationFieldLabel(field, item),
        value: item?.guid,
      })) ?? []
    );
  }, [allOptions, options, i18n?.language]);

  const changeHandler = (value) => {
    if (!value) setValue(null);
    const val = value?.map((el) => el.value);

    setValue(val ?? null);
  };

  const inputChangeHandler = useDebounce((val) => {
    setDebouncedValue(val);
  }, 300);

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      display: "flex",
      alignItems: "center",
      outline: "none",
      minHeight: "35.4px",
      borderRadius: "6px",
    }),
    input: (provided) => ({
      ...provided,
      width: "100%",
      width: "250px",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#fff" : provided.color,
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <div
        className={styles.createButton}
        onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}>
        Create new
      </div>

      <Select
        options={computedOptions ?? []}
        value={computedValue}
        onChange={(value, options) => {
          changeHandler(value, options);
        }}
        menuPortalTarget={document.body}
        onInputChange={(_, val) => {
          if (typeof val === "string") {
            inputChangeHandler(val?.prevInputValue);
          } else if (Boolean(val?.prevInputValue)) {
            inputChangeHandler(val?.prevInputValue);
          }
        }}
        components={{
          DropdownIndicator: () => (
            <div style={{paddingRight: "10px"}}>
              <img src="/img/chevron-down.svg" alt="" />
            </div>
          ),
        }}
        onMenuScrollToBottom={loadMoreItems}
        isMulti
        closeMenuOnSelect={false}
        styles={customStyles}
      />
    </div>
  );
};

export default OneCMany2ManyFormElement;
