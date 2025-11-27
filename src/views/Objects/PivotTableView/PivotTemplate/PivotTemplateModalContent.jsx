import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Settings } from "@mui/icons-material";

import PivotTemplate from ".";
import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import styles from "./styles.module.scss";
import pivotService from "../../../../services/pivotService";

export default function PivotTemplateModalContent(props) {
  const { modalParams, activeClickActionTabId, dateRange, setDateRange, form } = props;

  const reportSettingId = useWatch({
    control: form.control,
    name: "report_setting_id",
  });

  const [settingId, setSettingId] = useState("");

  const { data: reportSettings } = useQuery(
    ["GET_REPORT_SETTINGS_LIST"],
    () => pivotService.getListReportSetting(),
    {
      select: (data) => data.report_settings ?? [],
    }
  );
  return (
    <div>
      {settingId ? (
        <div>
          <div className={styles.goBack} onClick={() => setSettingId("")}>
            <ArrowBackIcon />
            Go back to the list
          </div>
          {modalParams.key !== "delete" && (
            <>
              <CRangePickerNew
                clearable
                onChange={setDateRange}
                value={dateRange}
                zIndex={10000}
                style={{ width: 250, alignSelf: "end", height: "32px" }}
                calendarPosition="top-right"
              />
              <FRow label="Template name">
                <HFTextField required fullWidth control={form.control} name="template_name" />
              </FRow>
              {modalParams.key === "edit" && (
                <PivotTemplate
                  id={settingId}
                  activeClickActionTabId={activeClickActionTabId}
                  modalKey={modalParams.key}
                  form={form}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className={styles.reportItems}>
          {reportSettings?.map((item) => (
            <div
              style={{
                backgroundColor: item.id === reportSettingId ? "#eee" : "",
              }}
              key={item.id}
              className={styles.reportItem}
              onClick={() => {
                setSettingId(item.id);
              }}
            >
              {item.main_table_label}
              <Settings color={item.id === reportSettingId ? "primary" : ""} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
