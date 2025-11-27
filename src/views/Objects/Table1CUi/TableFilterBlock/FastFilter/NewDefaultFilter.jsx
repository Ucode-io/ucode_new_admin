import {useMemo} from "react";
import {useState} from "react";

import useObjectsQuery from "../../../../../queries/hooks/useObjectsQuery";
import NewFiltersAutoComplete from "./NewFiltersAutoComplete";

const NewDefaultFilter = ({
  field,
  filters,
  onChange,
  name,
  tableSlug,
  view,
}) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [data, setData] = useState([]);

  const value = filters[name];

  const options = useMemo(() => {
    const result = [...new Set(data.map((el) => el[field.slug]) ?? [])]
      .filter((el) => el)
      ?.map((el) => ({
        label: el,
        value: el,
      }));
    return result;
  }, [field.slug, data]);

  const {query} = useObjectsQuery({
    tableSlug: tableSlug,
    queryPayload: {
      [name]: debouncedValue,
      limit: 10,
      additional_ids: value,
    },
    queryParams: {
      enabled: !!debouncedValue,
      onSuccess: (res) => {
        setData(res?.data?.response ?? []);
      },
    },
  });

  return (
    <NewFiltersAutoComplete
      field={field}
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      options={options}
      value={filters[name] ?? []}
      onChange={(val) => {
        onChange(val?.length ? val : undefined, name);
      }}
      label={field.label}
      view={view}
    />
  );
};

export default NewDefaultFilter;
