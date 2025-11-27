import React, {useMemo, useState} from "react";
import NewFiltersAutoComplete from "./FastFilter/NewFiltersAutoComplete";
import NewDefaultFilter from "./FastFilter/NewDefaultFilter";
import NewRelationFilter from "./FastFilter/NewRelationFilter";

function FilterSearchMenu({
  field = {},
  name,
  filters = {},
  onChange = () => {},
  tableSlug,
  view,
}) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return [];
    return field.attributes.options.map((option) => {
      if (field.type === "PICK_LIST")
        return {
          value: option.value,
          label: option.value,
        };
      if (field.type === "MULTISELECT")
        return {
          value: option.value,
          label: option.label ?? option.value,
        };
    });
  }, [field.attributes?.options, field.type]);

  switch (field.type) {
    case "LOOKUP":
    case "LOOKUPS":
      return (
        <NewRelationFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
          view={view}
        />
      );

    case "PICK_LIST":
    case "MULTISELECT":
      return (
        <NewFiltersAutoComplete
          searchText={debouncedValue}
          setSearchText={setDebouncedValue}
          options={computedOptions}
          value={filters[name] ?? []}
          onChange={(val) => onChange(val?.length ? val : undefined, name)}
          label={field.label}
          field={field}
          view={view}
        />
      );

    case "PHOTO":
      return null;

    default:
      return (
        <NewDefaultFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
          view={view}
        />
      );
  }
}

export default FilterSearchMenu;
