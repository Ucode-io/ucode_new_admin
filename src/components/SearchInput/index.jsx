import {Search} from "@mui/icons-material";
import {InputAdornment, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

const SearchInput = ({defaultValue, onChange, ...props}) => {
  const {t} = useTranslation();
  return (
    <TextField
      defaultValue={defaultValue}
      size="small"
      placeholder={`${t("search")}...`}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment style={{marginRight: 10}}>
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
