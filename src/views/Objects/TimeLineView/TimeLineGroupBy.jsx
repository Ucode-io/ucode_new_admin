import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ColorizeIcon from "@mui/icons-material/Colorize";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmailIcon from "@mui/icons-material/Email";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FunctionsIcon from "@mui/icons-material/Functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import MapIcon from "@mui/icons-material/Map";
import PasswordIcon from "@mui/icons-material/Password";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {Box, Switch, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import {CTable, CTableBody} from "../../../components/CTable";
import {applyDrag} from "../../../utils/applyDrag";

export default function TimeLineGroupBy({
  columns,
  form,
  selectedView,
  updateView,
  isLoading,
  updateLoading,
}) {
  const [allColumns, setAllColumns] = useState([]);
  const {i18n} = useTranslation();

  const checkedColumns = useMemo(() => {
    return form.getValues("group_fields").map((id) => {
      return columns.find((column) => column?.id === id);
    });
  }, [columns, form.watch("group_fields"), form]);

  const unCheckedColumns = useMemo(() => {
    return columns.filter((column) => {
      return !form.getValues("group_fields").includes(column?.id);
    });
  }, [columns, form.watch("group_fields"), form]);

  useEffect(() => {
    setAllColumns({
      checkedColumns: checkedColumns?.filter((item) => item),
      unCheckedColumns: unCheckedColumns.filter(
        (item) =>
          item?.type === "LOOKUP" ||
          item?.type === "MULTISELECT" ||
          item?.type === "LOOKUPS" ||
          item?.type === "SINGLE_LINE" ||
          item?.type === "PICK_LIST"
      ),
    });
  }, [columns, checkedColumns, unCheckedColumns]);

  const changeHandler = (e, val, id) => {
    const oldVals = form.getValues("group_fields");

    if (!val) {
      const updatedVals = oldVals.filter((item) => item !== id);
      form.setValue("group_fields", updatedVals);
    } else {
      const updatedVals = [...oldVals, id];
      form.setValue("group_fields", updatedVals);
    }

    updateView();
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

  const onDrop = (dropResult) => {
    const result = applyDrag(allColumns?.checkedColumns, dropResult);
    if (!result) return;

    form.setValue(
      "group_fields",
      result.map((item) => item.id)
    );

    updateView();
  };

  return (
    <div
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: "auto",
        padding: "10px 14px",
      }}>
      <CTable
        removableHeight={false}
        disablePagination
        tableStyle={{border: "none"}}>
        <CTableBody dataLength={1}>
          {checkedColumns?.length || unCheckedColumns?.length ? (
            <Container
              groupName="1"
              onDrop={onDrop}
              dropPlaceholder={{className: "drag-row-drop-preview"}}
              getChildPayload={(i) => ({
                ...allColumns?.checkedColumns[i],
                field_name:
                  allColumns?.checkedColumns[i]?.label ??
                  allColumns?.checkedColumns[i]?.title,
              })}>
              {allColumns?.checkedColumns?.map((column) => (
                <Draggable
                  key={column?.id}
                  style={{
                    overflow: "visible",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "move",
                    borderBottom: "1px solid #e5e5e5",
                    padding: "5px 0",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <div>{columnIcons[column?.type] ?? <LinkIcon />}</div>
                    <div>
                      {column?.attributes?.[`label_${i18n.language}`] ??
                        column?.label}
                    </div>
                  </div>

                  <Switch
                    size="small"
                    disabled={isLoading || updateLoading}
                    checked={
                      allColumns?.checkedColumns?.includes(column?.id) ||
                      selectedView?.group_fields?.includes(column?.id)
                    }
                    onChange={(e, val) => changeHandler(e, val, column?.id)}
                  />
                </Draggable>
              ))}

              {allColumns?.unCheckedColumns?.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    overflow: "visible",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e5e5e5",
                    padding: "5px 0",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <div>{columnIcons[item?.type] ?? <LinkIcon />}</div>
                    <div>
                      {item?.attributes?.[`label_${i18n.language}`] ??
                        item?.label}
                    </div>
                  </div>

                  <Switch
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        transitionDuration: "0ms",
                      },

                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#3f51b5",
                        },

                      "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track":
                        {
                          backgroundColor: "#e5e5e5",
                        },

                      "& .MuiSwitch-switchBase.Mui-disabled": {
                        color: "#e5e5e5",
                      },

                      "& .MuiSwitch-colorSecondary.Mui-checked": {
                        color: "#3f51b5",
                      },
                    }}
                    size="small"
                    disabled={isLoading || updateLoading}
                    checked={false}
                    onChange={(e, val) => changeHandler(e, val, item?.id)}
                  />
                </div>
              ))}
            </Container>
          ) : (
            <Box style={{padding: "10px"}}>
              <Typography>No columns to set group!</Typography>
            </Box>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
}
