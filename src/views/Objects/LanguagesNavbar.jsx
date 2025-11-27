import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { languagesActions } from "../../store/globalLanguages/globalLanguages.slice";

export default function LanguagesNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const languages = useSelector((state) => state.languages.list);

  const { i18n } = useTranslation();

  const handleRowClick = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
    handleClose();
  };

  const activeLang = useMemo(() => {
    return languages?.find((lang) => lang.slug === i18n.language);
  }, [i18n.language]);

  return (
    <>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {activeLang?.title}
        <KeyboardArrowDownIcon />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {languages?.map((language) => (
          <MenuItem key={language.slug} onClick={() => handleRowClick(language.slug)}>
            {language.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
