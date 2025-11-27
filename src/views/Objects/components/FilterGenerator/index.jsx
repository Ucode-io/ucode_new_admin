import {TextField} from "@mui/material";
import {useMemo, useState} from "react";
import TableOrderingButton from "../../../../components/TableOrderingButton";
import BooleanFilter from "./BooleanFilter";
import DateFilter from "./DateFilter";
import DefaultFilter from "./DefaultFilter";
import FilterAutoComplete from "./FilterAutocomplete";
import RelationFilter from "./RelationFilter";
import DateFilterWithoutTimeZ from "./DateFilterWithoutTimeZ";

const FilterGenerator = ({field, name, filters = {}, onChange, tableSlug}) => {
  const orderingType = useMemo(
    () => filters.order?.[name],
    [filters.order, name]
  );

  const onOrderingChange = (value) => {
    if (!value) return onChange(value, "order");
    const data = {
      [name]: value,
    };
    onChange(data, "order");
  };

  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <TableOrderingButton value={orderingType} onChange={onOrderingChange} />
    </div>
  );
};

export default FilterGenerator;

export const Filter = ({
  field = {},
  name,
  filters = {},
  onChange,
  tableSlug,
}) => {
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
        <RelationFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );

    case "PICK_LIST":
    case "MULTISELECT":
      return (
        <FilterAutoComplete
          searchText={debouncedValue}
          setSearchText={setDebouncedValue}
          options={computedOptions}
          value={filters[name] ?? []}
          onChange={(val) => onChange(val?.length ? val : undefined, name)}
          label={field.label}
          field={field}
        />
      );

    case "PHOTO":
      return null;

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <DateFilterWithoutTimeZ
          field={field}
          placeholder={field?.label}
          value={filters[name]}
          onChange={(val) => onChange(val, name)}
        />
      );

    case "DATE":
    case "DATE_TIME":
      return (
        <DateFilter
          field={field}
          placeholder={field?.label}
          value={filters[name]}
          onChange={(val) => onChange(val, name)}
        />
      );

    case "NUMBER":
      return (
        <TextField
          fullWidth
          size="small"
          placeholder={field.label}
          type="number"
          value={filters[name] ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || undefined, name)}
        />
      );

    case "SWITCH":
      return (
        <BooleanFilter
          filters={filters}
          onChange={onChange}
          name={name}
          field={field}
        />
      );

    default:
      return (
        <DefaultFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );
  }
};
