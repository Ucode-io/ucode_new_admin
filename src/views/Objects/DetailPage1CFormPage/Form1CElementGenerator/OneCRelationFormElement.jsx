import {get} from "@ngard/tiny-get";
import {useEffect, useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import Select from "react-select";
import styles from "./style.module.scss";
import FieldLabel from "./FieldLabel";
import useTabRouter from "../../../../hooks/useTabRouter";
import useDebounce from "../../../../hooks/useDebounce";
import request from "../../../../utils/request";
import constructorObjectService from "../../../../services/constructorObjectService";
import {pageToOffset} from "../../../../utils/pageToOffset";

const OneCRelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  name = "",
  mainForm,
  disabledHelperText,
  setFormValue,
  formTableSlug,
  disabled = false,
  defaultValue = null,
  multipleInsertField,
  checkRequiredField,
  rules,
  activeLang,
  errors,
  ...props
}) => {
  const {i18n} = useTranslation();
  const tableSlug = useMemo(() => {
    if (field.relation_type === "Recursive") return formTableSlug;
    return field.id.split("#")?.[0] ?? "";
  }, [field.id, formTableSlug, field.relation_type]);

  const required = useMemo(() => {
    if (window.location.pathname?.includes("settings")) {
      return false;
    } else return field?.required;
  }, [window.location.pathname]);

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={(name || field.slug) ?? `${tableSlug}_id`}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This field is required!" : "",
          ...rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <AutoCompleteElement
            value={Array.isArray(value) ? value[0] : value}
            setValue={onChange}
            field={field}
            disabled={disabled}
            tableSlug={tableSlug}
            error={error}
            disabledHelperText={disabledHelperText}
            setFormValue={setFormValue}
            control={control}
            name={name}
            multipleInsertField={multipleInsertField}
            errors={errors}
            required={required}
            activeLang={activeLang}
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
            defaultValue={defaultValue}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <AutoCompleteElement
                value={Array.isArray(value) ? value[0] : value}
                setValue={onChange}
                field={field}
                disabled={disabled}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
                control={control}
                name={name}
                activeLang={activeLang}
              />
            )}
          />
        </FEditableRow>
      )}></Controller>
  );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  setValue,
  error,
  disabled,
  disabledHelperText,
  control,
  name,
  multipleInsertField,
  setFormValue = () => {},
  errors,
  required = false,
  activeLang,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [localValue, setLocalValue] = useState([]);
  const {id} = useParams();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const clientTypeID = useSelector((state) => state?.auth?.clientType?.id);

  const ids = field?.attributes?.is_user_id_default ? isUserId : undefined;
  const [debouncedValue, setDebouncedValue] = useState("");
  const {navigateToForm} = useTabRouter();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const autoFilters = field?.attributes?.auto_filters;
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState([]);
  const {i18n} = useTranslation();
  const {state} = useLocation();
  const languages = useSelector((state) => state.languages.list);
  const isSettings = window.location.pathname?.includes("settings/constructor");
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: `1px solid ${errors?.[field?.slug] ? "red" : "#D0D5DD"}`,
      minWidth: "200px",
      minHeight: "35.4px",
      borderRadius: "6px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
  };

  const computedIds = useMemo(() => {
    if (
      field?.attributes?.object_id_from_jwt &&
      field?.id?.split("#")?.[0] === "client_type"
    ) {
      return clientTypeID;
    } else {
      return ids;
    }
  }, [field]);

  const autoFiltersFieldFroms = useMemo(() => {
    setPage(1);
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

  const {data: optionsFromFunctions} = useQuery(
    ["GET_OPENFAAS_LIST", tableSlug, autoFiltersValue, debouncedValue, page],
    () => {
      return request.post(
        `/invoke_function/${field?.attributes?.function_path}`,
        {
          params: {
            from_input: true,
          },
          data: {
            table_slug: tableSlug,
            ...autoFiltersValue,
            search: debouncedValue,
            limit: 10,
            offset: pageToOffset(page, 10),
            view_fields:
              field?.view_fields?.map((field) => field.slug) ??
              field?.attributes?.view_fields?.map((field) => field.slug),
          },
        }
      );
    },
    {
      enabled: !!field?.attributes?.function_path,
      select: (res) => {
        const options = res?.data?.response ?? [];
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];

        return {
          options,
          slugOptions,
        };
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        } else {
          setAllOptions(data?.options);
        }
      },
    }
  );

  const {data: optionsFromLocale} = useQuery(
    ["GET_OBJECT_LIST", tableSlug, debouncedValue, autoFiltersValue, page],
    () => {
      if (!tableSlug) return null;
      return constructorObjectService.getListV2(
        tableSlug,
        {
          data: {
            ...autoFiltersValue,
            additional_request: {
              additional_field: "guid",
              additional_values: [computedIds ?? value],
            },
            view_fields: field.attributes?.view_fields?.map((f) => f.slug),
            search: debouncedValue.trim(),
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
      enabled: !field?.attributes?.function_path && !isSettings,
      select: (res) => {
        const options = res?.data?.response ?? [];
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];
        return {
          options,
          slugOptions,
        };
      },
      onSuccess: (data) => {
        if (page > 1) {
          setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        } else {
          setAllOptions(data?.options);
        }
      },
    }
  );

  const options = useMemo(() => {
    if (field?.attributes?.function_path) {
      return optionsFromFunctions?.options ?? [];
    } else {
      return optionsFromLocale?.options ?? [];
    }
  }, [
    optionsFromFunctions?.options,
    optionsFromLocale?.options,
    field?.attributes?.function_path,
  ]);

  const getValueData = async () => {
    try {
      const id = state?.[`${tableSlug}_id`] || value;
      const res = await constructorObjectService.getById(tableSlug, id);
      const data = res?.data?.response;

      if (data && data.prepayment_balance) {
        setFormValue("prepayment_balance", data.prepayment_balance || 0);
      }

      setLocalValue(res?.data?.response ? [res?.data?.response] : []);

      if (window.location.pathname?.includes("create")) {
        setFormValue(name, data?.guid);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const changeHandler = (value, key = "") => {
    if (key === "cascading") {
      setValue(value?.guid ?? value?.guid);
      setLocalValue(value ? [value] : null);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({field_from, field_to}) => {
        setFormValue(field_to, get(value, field_from));
      });
      setPage(1);
    } else {
      const val = value;

      setValue(val?.guid ?? null);
      setLocalValue(val?.guid ? [val] : null);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({field_from, field_to}) => {
        setFormValue(field_to, get(val, field_from));
      });
      setPage(1);
    }
  };

  const setClientTypeValue = () => {
    const value = options?.find((item) => item?.guid === clientTypeID);

    if (
      field?.attributes?.object_id_from_jwt &&
      field?.id?.split("#")?.[0] === "client_type"
    ) {
      setValue(value?.guid ?? value?.guid);
      setLocalValue(value);
    }
  };

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  useEffect(() => {
    let val;

    if (Array.isArray(computedValue)) {
      val = computedValue[computedValue.length - 1];
    } else {
      val = computedValue;
    }

    if (!field?.attributes?.autofill || !val) {
      return;
    }

    field.attributes.autofill.forEach(({field_from, field_to, automatic}) => {
      const setName = name?.split(".");
      setName?.pop();
      setName?.push(field_to);

      if (automatic) {
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
      }
    });
  }, [computedValue, field, value]);

  useEffect(() => {
    if (Boolean(value) || Boolean(state?.[`${tableSlug}_id`])) getValueData();
  }, [value]);

  useEffect(() => {
    setClientTypeValue();
  }, []);

  useEffect(() => {
    if (autoFiltersValue) {
      setPage(1);
    }
  }, [autoFiltersValue]);

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const computedViewFields = useMemo(() => {
    if (field?.attributes?.enable_multi_language) {
      const viewFields = field?.attributes?.view_fields?.map((el) => el?.slug);
      const computedLanguages = languages?.map((item) => item?.slug);

      const activeLangView = viewFields?.filter((el) =>
        el?.includes(activeLang ?? i18n?.language)
      );

      const filteredData = viewFields.filter((key) => {
        return !computedLanguages.some((lang) => key.includes(lang));
      });

      return [...activeLangView, ...filteredData] ?? [];
    } else {
      return field?.attributes?.view_fields?.map((el) => el?.slug);
    }
  }, [field, activeLang, i18n?.language]);

  useEffect(() => {
    if (field?.attributes?.object_id_from_jwt === true) {
      const foundOption = allOptions?.find((el) => el?.guid === isUserId);

      if (foundOption) {
        setLocalValue([foundOption]);
      }
    }
  }, [allOptions?.length, field]);

  return (
    <div className={styles.autocompleteWrapper}>
      {field.attributes?.creatable && (
        <div
          className={styles.createButton}
          onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}>
          Create new
        </div>
      )}

      <>
        <Select
          isDisabled={
            disabled ||
            (field?.attributes?.object_id_from_jwt &&
              field?.id?.split("#")?.[0] === "client_type") ||
            (Boolean(field?.attributes?.is_user_id_default) &&
              localValue?.length !== 0)
          }
          options={allOptions ?? []}
          isClearable={true}
          styles={customStyles}
          value={localValue ?? []}
          required={required}
          defaultValue={value ?? ""}
          menuPortalTarget={document.body}
          onChange={(e) => {
            changeHandler(e);
          }}
          onMenuScrollToBottom={loadMoreItems}
          inputChangeHandler={(e) => inputChangeHandler(e)}
          onInputChange={(e, newValue) => {
            setInputValue(e ?? null);
            inputChangeHandler(e);
          }}
          getOptionLabel={(option) =>
            computedViewFields?.map((el) => {
              if (field?.attributes?.enable_multi_language) {
                return `${option[`${el}_${activeLang ?? i18n?.language}`] ?? option[`${el}`]} `;
              } else {
                return `${option[el]} `;
              }
            })
          }
          getOptionValue={(option) =>
            option?.guid ?? option?.id ?? option?.client_type_id
          }
          components={{
            DropdownIndicator: () => (
              <div style={{paddingRight: "10px"}}>
                <img src="/img/chevron-down.svg" alt="" />
              </div>
            ),

            MultiValue: ({data}) => (
              <IconGenerator
                icon="arrow-up-right-from-square.svg"
                style={{marginLeft: "10px", cursor: "pointer"}}
                size={15}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigateToForm(tableSlug, "EDIT", value);
                }}
              />
            ),
          }}
        />
        {errors?.[field?.slug] && (
          <div
            style={{
              color: "red",
              fontSize: "10px",
              textAlign: "center",
              marginTop: "5px",
            }}>
            {"This field is required!"}
          </div>
        )}
      </>
    </div>
  );
};

export default OneCRelationFormElement;
