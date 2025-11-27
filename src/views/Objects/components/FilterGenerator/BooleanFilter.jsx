import {Clear} from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CSelect from "../../../../components/CSelect";
import {useMemo} from "react";

const BooleanFilter = ({
  onChange = () => {},
  field,
  filters,
  name,
  ...props
}) => {
  const value = useMemo(() => {
    if (filters[name] === true) return "true";
    if (filters[name] === false) return "false";
    return "";
  }, [filters, name]);

  const onSelectChange = (e) => {
    const value = e.target.value;
    console.log("valuevaluevalue", value);
    if (value === "true") {
      onChange(true, name);
    } else if (value === "false") {
      onChange(false, name);
    } else {
      onChange(undefined, name);
    }
  };

  return (
    <CSelect
      fullWidth
      placeholder={field.label}
      value={value}
      name={name}
      disabledHelperText
      options={[
        {
          label: field.attributes?.text_true ?? "Да",
          value: "true",
        },
        {
          label: field.attributes?.text_false ?? "Нет",
          value: "false",
        },
      ]}
      onChange={onSelectChange}
    />
  );
};

export default BooleanFilter;
