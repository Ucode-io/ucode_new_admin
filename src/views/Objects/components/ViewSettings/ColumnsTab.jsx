import {Box, Switch, Typography} from "@mui/material";
import {useEffect, useMemo} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {Container, Draggable} from "react-smooth-dnd";
import {applyDrag} from "../../../../utils/applyDrag";
import styles from "./style.module.scss";
import {useTranslation} from "react-i18next";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ColorizeIcon from "@mui/icons-material/Colorize";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MapIcon from "@mui/icons-material/Map";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import LinkIcon from "@mui/icons-material/Link";

const ColumnsTab = ({
  form,
  updateView,
  isMenu,
  views,
  selectedTabIndex,
  computedColumns,
}) => {
  const {i18n} = useTranslation();

  const {fields: columns, move} = useFieldArray({
    control: form.control,
    name: "columns",
    keyName: "key",
  });
  const {
    fields: groupColumn,
    replace: replaceGroup,
    move: groupMove,
  } = useFieldArray({
    control: form.control,
    name: "attributes.group_by_columns",
    keyName: "key",
  });

  const watchedColumns = useWatch({
    control: form.control,
    name: "columns",
  });

  const computeColumns = (checkedColumnsIds = [], columns) => {
    const selectedColumns =
      checkedColumnsIds
        ?.filter((id) => columns.find((el) => el.id === id))
        ?.map((id) => ({
          ...columns.find((el) => el.id === id),
          is_checked: true,
        })) ?? [];
    const unselectedColumns =
      columns?.filter((el) => !checkedColumnsIds?.includes(el.id)) ?? [];
    return [...selectedColumns, ...unselectedColumns];
  };

  useEffect(() => {
    if (views?.[selectedTabIndex]?.columns) {
      form.reset({
        ...form.getValues(),
        columns: computeColumns(
          views?.[selectedTabIndex]?.columns,
          computedColumns
        ),
      });
    }
  }, [views, selectedTabIndex, computedColumns]);

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult);
    if (result) {
      move(dropResult.removedIndex, dropResult.addedIndex);
      groupMove(dropResult.removedIndex, dropResult.addedIndex);
    }
  };

  const isAllChecked = useMemo(() => {
    return watchedColumns?.every((column) => column?.is_checked);
  }, [watchedColumns]);

  const onAllChecked = (_, val) => {
    const columns = form.getValues("columns");

    columns?.forEach((column, index) => {
      form.setValue(`columns[${index}].is_checked`, val);
    });

    if (isMenu) {
      updateView();
    }
  };

  const columnIcons = useMemo(() => {
    return {
      SINGLE_LINE: <TextFieldsIcon />,
      MULTI_LINE: <FormatAlignJustifyIcon />,
      NUMBER: <LooksOneIcon />,
      MULTISELECT: <ArrowDropDownCircleIcon />,
      PHOTO: <PhotoSizeSelectActualIcon />,
      VIDEO: <PlayCircleIcon />,
      FILE: <InsertDriveFileIcon />,
      FORMULA: <FunctionsIcon />,
      PHONE: <LocalPhoneIcon />,
      INTERNATION_PHONE: <LocalPhoneIcon />,
      EMAIL: <EmailIcon />,
      ICON: <AppsIcon />,
      BARCODE: <QrCodeScannerIcon />,
      QRCODE: <QrCode2Icon />,
      COLOR: <ColorizeIcon />,
      PASSWORD: <PasswordIcon />,
      PICK_LIST: <ChecklistIcon />,
      DATE: <DateRangeIcon />,
      TIME: <AccessTimeIcon />,
      DATE_TIME: <InsertInvitationIcon />,
      CHECKBOX: <CheckBoxIcon />,
      MAP: <MapIcon />,
      SWITCH: <ToggleOffIcon />,
      FLOAT_NOLIMIT: <LooksOneIcon />,
      DATE_TIME_WITHOUT_TIME_ZONE: <InsertInvitationIcon />,
    };
  }, []);

  // useEffect(() => {
  //   if (isMenu) {
  //     updateView();
  //   }
  // }, [watchedColumns]);

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}>
      <div className={styles.table}>
        <div
          className={styles.row}
          style={{
            borderBottom: "1px solid #eee",
          }}>
          <div
            className={styles.cell}
            style={{flex: 1, border: 0, paddingLeft: 0, paddingRight: 0}}>
            <b>All</b>
          </div>
          <div
            className={styles.cell}
            style={{
              width: 70,
              border: 0,
              paddingLeft: 0,
              paddingRight: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}>
            {/* <Button variant="outlined" disabled={false} onClick={onAllChecked} color="success">Show All</Button>
            <Button variant="outlined" color="error">Hide All</Button> */}
            <Switch
              size="small"
              checked={isAllChecked}
              onChange={onAllChecked}
            />
          </div>
        </div>
        <Container
          onDrop={onDrop}
          dropPlaceholder={{className: "drag-row-drop-preview"}}>
          {columns.map((column, index) => (
            <Draggable key={column.id}>
              <div key={column.id} className={styles.row}>
                <div
                  className={styles.cell}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    border: 0,
                    borderBottom: "1px solid #eee",
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {columnIcons[column.type] ?? <LinkIcon />}
                  </div>
                  {column?.attributes?.[`label_${i18n.language}`] ??
                    column?.attributes?.[`label_from_${i18n.language}`] ??
                    column?.label}
                </div>
                <div
                  className={styles.cell}
                  style={{
                    width: 70,
                    border: 0,
                    borderBottom: "1px solid #eee",
                    paddingLeft: 0,
                    paddingRight: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}>
                  <Switch
                    size="small"
                    checked={form.watch(`columns.${index}.is_checked`)}
                    onChange={(e) => {
                      form.setValue(
                        `columns.${index}.is_checked`,
                        e.target.checked
                      );
                      if (isMenu) return updateView();
                    }}
                  />
                </div>
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default ColumnsTab;
