import {useState, useEffect, useMemo} from "react";
import {Controller, useWatch} from "react-hook-form";
import FRowMultiLine from "./FRowMultiLine";
import JSONInput from "react-json-editor-ajrm";
import {isJSONParsable} from "../../utils/isJsonValid";
import styles from "./style.module.scss";
import {Box, Button} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const HFCodeField = ({
  control,
  name = "",
  disabledHelperText = false,
  updateObject = () => {},
  isNewTableView = false,
  required = false,
  isTransparent = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  label,
  newColumn,
}) => {
  const values = useWatch({
    control,
    name,
  });

  const parsedValue = useMemo(() => {
    if (isJSONParsable(values)) {
      return JSON.parse(values);
    } else {
      return {};
    }
  }, [values]);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedValue, null, 2));
  };

  return (
    <FRowMultiLine
      label={label}
      required={field?.required}
      extraClassName={isNewTableView ? "tableView" : ""}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({field: {onChange}, fieldState: {error}}) => (
          <Box sx={{position: "relative"}}>
            <Button
              onClick={handleCopyJSON}
              sx={{
                position: "absolute",
                zIndex: "99",
                top: "6px",
                right: "35px",
              }}>
              <ContentCopyIcon />
            </Button>
            <JSONInput
              id="a_unique_id"
              placeholder={parsedValue}
              width="400px"
              height="300px"
              onChange={(e) => {
                if (isJSONParsable(e.json)) {
                  onChange(e.json);
                  Boolean(!newColumn && isNewTableView) && updateObject();
                }
              }}
            />
            {error && <span>{error.message}</span>}
          </Box>
        )}
      />
    </FRowMultiLine>
  );
};

export default HFCodeField;
