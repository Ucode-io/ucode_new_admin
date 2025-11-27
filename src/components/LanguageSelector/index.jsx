import { Menu } from "@mui/material";
import { useMemo, useState } from "react";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import RussianFlag from "../../assets/icons/russian-flag.svg";
import GBFlag from "../../assets/icons/great-britain-flag.svg";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const languages = [
  {
    icon: GBFlag,
    title: "English",
    slug: "en",
  },
  {
    icon: RussianFlag,
    title: "Русский",
    slug: "ru",
  },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRowClick = (lang) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  const activeLang = useMemo(() => {
    return languages.find(lang => lang.slug === i18n.language)
  }, [i18n.language])
  
  const open = Boolean(anchorEl);

  return (
    <div>
      <RectangleIconButton style={{width: "130px", height: "44px", borderRadius: '8px'}} color="primary" onClick={handleClick}>
        <img style={{ width: "20px" }} src={activeLang?.icon} alt="" />
        <p style={{marginLeft: "10px"}}>{activeLang?.title}</p>
      </RectangleIconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        {languages.map((language) => (
          <div key={language.slug} className={styles.menuItem} onClick={() => handleRowClick(language.slug)}>
            <img style={{ width: "18px" }} src={language.icon} alt="" />
            <p className={styles.itemText}>{ language.title }</p>
          </div>
        ))}
      </Menu>
    </div>
  );
};
export default LanguageSelector;
