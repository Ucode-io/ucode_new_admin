import { useState } from "react";
import { Upload } from "@mui/icons-material";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Dialog } from "@mui/material";
import ExcelUploadModal from "./ExcelUploadModal";
import { makeStyles } from "@mui/styles";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {},
});

const ExcelUploadButton = ({ fieldsMap, withText }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyles();
  return (
    <div>
      <div className={style.excelUpload} onClick={() => handleClick()}>
        <RectangleIconButton color="white" onClick={() => handleClick()}>
          {withText ? "Импорт" : null}
          <Upload />
        </RectangleIconButton>
        <span>{t('excel.upload')}</span>
      </div>

      <Dialog className={classes.root} open={open} onClose={handleClose}>
        <ExcelUploadModal fieldsMap={fieldsMap} handleClose={handleClose} />
      </Dialog>
    </div>
  );
};

export default ExcelUploadButton;
