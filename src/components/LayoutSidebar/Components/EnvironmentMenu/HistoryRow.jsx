import {Checkbox} from "@mui/material";
import React, {useMemo} from "react";
import {struct} from "pb-util";
import {useTranslation} from "react-i18next";
import JsonModalVersion from "./JsonModalVersion";
import {store} from "../../../../store";
import {CTableCell, CTableRow} from "../../../CTable";
import Tag from "../../../Tag";
import {ActivityFeedColors} from "../../../Status";
import style from "./styles.module.scss";

export default function HistoryRow({
  history,
  index,
  handleSelectVersion,
  selectedVersions,
}) {
  const {i18n} = useTranslation();
  const decodedCurrentAttributes = struct.decode(
    history?.current?.attributes ?? {}
  );
  const decodedPreviousAttributes = struct.decode(
    history?.previus?.attributes ?? {}
  );
  const multiLanguageLabel = `label_${i18n.language}`;

  const label = useMemo(() => {
    if (
      history?.action_type === "CREATE" ||
      history?.action_type === "BULKWRITE"
    ) {
      switch (history?.action_source) {
        case "RELATION":
          return (
            history?.current?.table_from?.label ??
            "" + " ==> " + history?.current?.table_to?.label ??
            ""
          );
        default:
          return (
            decodedCurrentAttributes[multiLanguageLabel] ??
            history.current?.label
          );
      }
    } else if (history?.action_type === "UPDATE") {
      switch (history?.action_source) {
        case "RELATION":
          return history?.current?.table_from?.label
            ? history?.current?.table_from?.label
            : "" + " ==> " + history?.current?.table_to?.label
              ? history?.current?.table_to?.label
              : "";
        default:
          return (
            decodedCurrentAttributes[multiLanguageLabel] ??
            decodedCurrentAttributes.label
          );
      }
    } else if (history?.action_type === "DELETE") {
      switch (history?.action_source) {
        case "RELATION":
          return (
            decodedPreviousAttributes[multiLanguageLabel] ??
            decodedPreviousAttributes.label
          );
        default:
          return (
            decodedPreviousAttributes[multiLanguageLabel] ??
            decodedPreviousAttributes.label
          );
      }
    }
  }, [history, i18n.language]);

  return (
    <CTableRow key={history.id}>
      <CTableCell>
        <Checkbox
          onChange={(e) => handleSelectVersion(e, index)}
          checked={selectedVersions.some(
            (version) => version?.id === history?.id
          )}
        />
      </CTableCell>

      <CTableCell>
        <Tag
          shape="subtle"
          color={ActivityFeedColors(history?.action_type)}
          size="large"
          style={{
            background: `${ActivityFeedColors(history?.action_type)}`,
          }}
          className={style.tag}>
          {history.action_type}
        </Tag>
      </CTableCell>
      <CTableCell>{history.action_source}</CTableCell>
      <CTableCell>{history?.version?.name}</CTableCell>
      <CTableCell>
        <JsonModalVersion history={history} />
      </CTableCell>
    </CTableRow>
  );
}
