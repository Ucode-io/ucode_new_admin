import {useMemo} from "react";
import styles from "./week.module.scss";
import DataWeekColumn from "./DataWeekColumn";
import WeekColumn from "./WeekColumn";
import {Box} from "@mui/material";

const RecursiveWeekBlock = ({
  date,
  data,
  fieldsMap,
  parentTab,
  view,
  tabs,
  level = 0,
  workingDays,
}) => {
  const elements = useMemo(() => {
    const computedElements = [];
    getChildrenList(parentTab, tabs, level)?.forEach((tab) => {
      const childrens = getChildrenList(tab, tabs, level + 1);

      if (!(childrens?.length || level !== 0 || tabs.length !== 2)) return;
      else {
        computedElements.push({
          ...tab,
          childrenNumber: childrens?.length,
        });
      }
    });

    return computedElements;
  }, [parentTab, tabs, level]);

  return (
    <Box
      style={
        view?.group_fields?.length && elements?.length > 50
          ? {
              width: "1100px",
              overflow: "auto",
              borderRight: "1px solid #D4DAE2",
            }
          : {}
      }>
      <div
        className={styles.row}
        style={
          view?.group_fields?.length && elements?.length > 50
            ? {
                width: "max-content",
              }
            : {}
        }>
        {elements?.length ? (
          elements?.map((tab) => (
            <div
              className={`${styles.block} ${
                elements?.length === 1 && level === 1 ? styles.oneElement : ""
              }`}>
              <div
                className={`${styles.blockElement}  ${
                  !tabs?.[level + 1] || tab.childrenNumber === 1
                    ? styles.last
                    : styles.before
                }`}
                style={
                  view?.group_fields?.length
                    ? {
                        top: "0",
                      }
                    : {}
                }>
                {tab.label}
              </div>

              {tabs?.[level + 1] ? (
                <RecursiveWeekBlock
                  date={date}
                  data={data}
                  tabs={tabs}
                  parentTab={tab}
                  fieldsMap={fieldsMap}
                  view={view}
                  level={level + 1}
                  workingDays={workingDays}
                />
              ) : (
                <DataWeekColumn
                  date={date}
                  data={data}
                  parentTab={tab}
                  categoriesTab={parentTab}
                  fieldsMap={fieldsMap}
                  view={view}
                  workingDays={workingDays}
                />
              )}
            </div>
          ))
        ) : (
          <WeekColumn
            date={date}
            data={data}
            categoriesTab={parentTab}
            fieldsMap={fieldsMap}
            view={view}
            workingDays={workingDays}
          />
        )}
      </div>
    </Box>
  );
};

const getChildrenList = (parentTab, tabs, level) => {
  if (!parentTab) return tabs?.[level]?.list;

  const computedElements = tabs?.[level]?.list?.filter((el) => {
    return Array.isArray(el[parentTab.slug])
      ? el[parentTab.slug]?.includes(parentTab.value)
      : el[parentTab.slug] === parentTab.value;
  });

  return computedElements;
};

export default RecursiveWeekBlock;
