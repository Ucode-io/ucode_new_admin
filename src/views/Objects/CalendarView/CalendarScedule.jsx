import { useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import constructorTableService from "../../../services/constructorTableService";
import listToOptions from "../../../utils/listToOptions";
import constructorFieldService from "../../../services/constructorFieldService";
import styles from "./style.module.scss";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";

const CalendarScedule = ({ form, children }) => {
  const projectId = useSelector((state) => state.auth.projectId);

  const selectedDisableDatesTableSlug = useWatch({
    control: form.control,
    name: "disable_dates.table_slug",
  });

  const { data: tablesList = [] } = useQuery(
    ["GET_TABLES_LIST"],
    () => {
      return constructorTableService.getList(projectId);
    },
    {
      select: (data) => listToOptions(data?.tables, "label", "slug"),
    }
  );

  const { data: disabledDateFieldsList = [] } = useQuery(
    ["GET_TABLE_FIELDS", selectedDisableDatesTableSlug],
    () => {
      if (!selectedDisableDatesTableSlug) return [];
      return constructorFieldService.getList({
        table_slug: selectedDisableDatesTableSlug,
      });
    },
    {
      select: ({ fields }) =>
        listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "slug"
        ),
    }
  );

  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Calendar Schedule</div>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.formRow}>
            <FRow label="Table">
              <HFSelect
                options={tablesList}
                control={form.control}
                name="disable_dates.table_slug"
              />
            </FRow>
            <FRow label="Day">
              <HFSelect
                options={disabledDateFieldsList}
                control={form.control}
                name="disable_dates.day_slug"
              />
            </FRow>
          </div>

          <div className={styles.formRow}>
            <FRow label="Time from">
              <HFSelect
                options={disabledDateFieldsList}
                control={form.control}
                name="disable_dates.time_from_slug"
              />
            </FRow>
            <FRow label="Time to">
              <HFSelect
                options={disabledDateFieldsList}
                control={form.control}
                name="disable_dates.time_to_slug"
              />
            </FRow>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default CalendarScedule;
