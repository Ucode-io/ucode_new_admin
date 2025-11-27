import {useMemo} from "react";
import styles from "./style.module.scss";
import listToLanOptions from "../../../utils/listToLanOptions";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import {useTranslation} from "react-i18next";

const CalendarSetting = ({columns, form, children}) => {
  const {i18n} = useTranslation();
  const computedColumns = useMemo(() => {
    return listToLanOptions(columns, "label", "slug", i18n?.language);
  }, [columns]);

  const computedPickListColumns = useMemo(() => {
    const filteredColumns = columns.filter(
      ({type}) => type === "PICK_LIST" || type === "MULTISELECT"
    );
    return listToLanOptions(filteredColumns, "label", "id", i18n?.language);
  }, [columns]);

  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Calendar settings</div>
        </div>

        <div className={styles.sectionBody}>
          <div className={styles.formRow}>
            <FRow label="Time from">
              <HFSelect
                options={computedColumns}
                control={form.control}
                name="calendar_from_slug"
              />
            </FRow>
            <FRow label="Time to">
              <HFSelect
                options={computedColumns}
                control={form.control}
                name="calendar_to_slug"
              />
            </FRow>
          </div>

          <div className={styles.formRow}>
            <FRow label="Time interval">
              <HFSelect
                options={timeIntervalOptions}
                control={form.control}
                name="time_interval"
              />
            </FRow>

            <FRow label="Status field">
              <HFSelect
                options={computedPickListColumns}
                control={form.control}
                name="status_field_slug"
              />
            </FRow>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

const timeIntervalOptions = [
  {
    label: "5 минут",
    value: 5,
  },
  {
    label: "10 минут",
    value: 10,
  },
  {
    label: "15 минут",
    value: 15,
  },
  {
    label: "20 минут",
    value: 20,
  },
  {
    label: "30 минут",
    value: 30,
  },
  {
    label: "45 минут",
    value: 45,
  },
  {
    label: "1 час",
    value: 60,
  },
];

export default CalendarSetting;
