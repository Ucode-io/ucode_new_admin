import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import useDebounce from "../../../hooks/useDebounce";
import constructorObjectService from "../../../services/constructorObjectService";
import CascadingMany2Many from "./CascadingMany2Many";
import CascadingMany2One from "./CascadingMany2One";

function CascadingSectionItem({
  fields,
  field,
  level = 1,
  handleClose,
  currentLevel,
  setCurrentLevel,
  setValue,
  title,
  setTitle,
  tableSlug,
  dataFilter,
  setDataFilter,
  setTablesSlug,
  tablesSlug,
  name,
}) {
  const [values, setValues] = useState();
  const [searchText, setSearchText] = useState("");
  const [levelSlug, setLevelSlug] = useState("");
  const [levelTableSlug, setLevelTableSlug] = useState("");
  const [ids, setIds] = useState([]);
  const cascadingLength = fields?.attributes?.cascadings?.length;
  const [debouncedValue, setDebouncedValue] = useState("");

  //=========SEARCH FILTER=========
  const foundServices = useMemo(() => {
    if (!searchText) return [];
    return field.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        item?.email?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }, [searchText, field]);

  //========DATA FOR SERVICE FILTER===========
  const dataObject = useMemo(() => {
    const values = {};
    tablesSlug?.map((item, index) => {
      values[`${item}_id`] = dataFilter[index];
      values[`${item}_ids`] = dataFilter[index];
    });
    return values;
  }, [tablesSlug, dataFilter]);

  const handleClick = (item) => {
    if (
      currentLevel === 4 &&
      fields?.relation_type === "Many2One" &&
      name !== "multiple_values"
    ) {
      setValue(item);
      handleClose();
    } else if (
      currentLevel === 4 &&
      fields?.relation_type === "Many2One" &&
      name === "multiple_values"
    ) {
      return false;
    }
    if (currentLevel < 4) {
      setDataFilter([...new Set(dataFilter), item?.guid]);
      setTitle([...title, item?.name]);

      const data =
        currentLevel === 3
          ? dataObject
          : {
              [levelSlug]: item?.guid,
            };
      constructorObjectService
        .getListV2(levelTableSlug, {
          data: data,
        })
        .then((res) => {
          setValues(res?.data?.response);
          setTablesSlug([...tablesSlug, res?.table_slug]);
          setCurrentLevel(level + 1);
        })
        .catch((err) => {
          console.log("cascading error", err);
        });
    } else setCurrentLevel(1);
  };

  //==========SEARCH REQUEST==========
  const { data: searchServices } = useQuery(
    ["GET_OBJECT_LIST", debouncedValue],
    () => {
      if (!tableSlug) return null;
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          view_fields: fields.attributes?.view_fields?.map((f) => f.slug),
          search: debouncedValue.trim(),
          limit: 10,
        },
      });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  const handleServices = (item) => {
    setValue(item);
    handleClose();
  };

  const backArrowButton = () => {
    setCurrentLevel(currentLevel - 1);
    setDataFilter(dataFilter.splice(0, dataFilter.length - 1));
    setTablesSlug(tablesSlug.splice(0, tablesSlug.length - 1));
    setTitle(title.splice(0, title?.length - 1));
  };

  //=========MANY2MANY CONFIRM FUNCTION============
  const confirmButton = () => {
    setValue(ids);
    handleClose();
  };

  //======CHECKBOX FUNCTION MANY2MANY========
  const onChecked = (id) => {
    setIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((items) => items !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (cascadingLength === 4) {
      if (currentLevel === 1) {
        setLevelSlug(fields?.attributes.cascadings[3].field_slug);
        setLevelTableSlug(fields?.attributes.cascadings[2]?.table_slug);
      } else if (currentLevel === 2) {
        setLevelSlug(fields?.attributes.cascadings[2].field_slug);
        setLevelTableSlug(fields?.attributes.cascadings[1]?.table_slug);
      } else if (currentLevel === 3) {
        setLevelSlug(fields?.attributes.cascadings[1].field_slug);
        setLevelTableSlug(fields?.attributes.cascadings[0]?.table_slug);
      } else if (currentLevel === 4) {
        setLevelSlug(fields?.attributes.cascadings[0].field_slug);
      }
    }
  }, [fields, currentLevel, cascadingLength]);

  return (
    <>
      {fields?.relation_type === "Many2Many" ||
      (fields?.relation_type === "Many2One" && name === "multiple_values")
        ? currentLevel === level && (
            <CascadingMany2Many
              currentLevel={currentLevel}
              level={level}
              onChecked={onChecked}
              confirmButton={confirmButton}
              title={title}
              backArrowButton={backArrowButton}
              foundServices={foundServices}
              handleClick={handleClick}
              field={field}
              fields={fields}
              setSearchText={setSearchText}
            />
          )
        : currentLevel === level && (
            <CascadingMany2One
              currentLevel={currentLevel}
              level={level}
              title={title}
              backArrowButton={backArrowButton}
              setSearchText={setSearchText}
              searchText={searchText}
              foundServices={foundServices}
              handleClick={handleClick}
              field={field}
              fields={fields}
              setDebouncedValue={setDebouncedValue}
              searchServices={searchServices}
              debouncedValue={debouncedValue}
              handleServices={handleServices}
            />
          )}
      {level < 4 && values && (
        <CascadingSectionItem
          fields={fields}
          field={values}
          level={level + 1}
          handleClose={handleClose}
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          setValue={setValue}
          searchText={searchText}
          foundServices={foundServices}
          title={title}
          setTitle={setTitle}
          tableSlug={tableSlug}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          setTablesSlug={setTablesSlug}
          tablesSlug={tablesSlug}
          name={name}
        />
      )}
    </>
  );
}

export default CascadingSectionItem;
