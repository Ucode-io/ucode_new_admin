import TranslateIcon from "@mui/icons-material/Translate";
import {Badge, Button, Menu, MenuItem} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useWatch} from "react-hook-form";
import HFTextField from "./HFTextField";

export default function HFTextFieldWithMultiLanguage({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  updateObject,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  disabled,
  tabIndex,
  checkRequiredField,
  placeholder,
  languages,
  endAdornment,
  field,
  disabled_text = "This field is disabled for this role!",
  customOnChange = () => {},
  id,
  ...props
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages?.[0]?.slug
  );
  const [fieldName, setFieldName] = useState(name);
  const [fieldPlaceholder, setFieldPlaceholder] = useState(placeholder);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const watch = useWatch({
    control,
  });

  const defaultValue = useMemo(
    () => watch[fieldName] ?? "",
    [watch, fieldName]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (language) => {
    setSelectedLanguage(language);
    setAnchorEl(null);
  };

  useEffect(() => {
    setFieldName(`${name}_${selectedLanguage}`);
    setFieldPlaceholder(`${placeholder} (${selectedLanguage})`);
  }, [selectedLanguage, name, placeholder]);

  useEffect(() => {
    if (languages?.length) {
      setSelectedLanguage(languages[0]?.slug);
    }
  }, [languages]);

  return (
    <>
      <HFTextField
        key={fieldName}
        control={control}
        name={fieldName}
        fullWidth
        placeholder={fieldPlaceholder}
        defaultValue={defaultValue}
        id={id}
      />

      {languages?.length > 1 && (
        <Badge badgeContent={selectedLanguage} color="primary">
          <Button
            id="basic-button"
            variant="outlined"
            color="inherit"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}>
            <TranslateIcon />
          </Button>
        </Badge>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose(selectedLanguage);
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {languages?.map((language) => (
          <MenuItem
            onClick={() => {
              handleClose(language?.slug);
            }}
            style={{
              background: selectedLanguage === language?.slug ? "#f0f0f0" : "",
            }}>
            {language?.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
