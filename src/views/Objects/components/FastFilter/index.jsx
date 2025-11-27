import {useMemo, useEffect} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import useFilters from "../../../../hooks/useFilters";
import {filterActions} from "../../../../store/filter/filter.slice";
import {Filter} from "../FilterGenerator";
import styles from "./style.module.scss";
import FilterVisible from "../../TableView/FilterVisible";

const FastFilter = ({
  view,
  fieldsMap,
  isVertical = false,
  selectedTabIndex,
  visibleColumns,
  visibleRelationColumns,
  visibleForm,
  isVisibleLoading,
  setFilterVisible,
}) => {
  const {tableSlug} = useParams();
  const {new_list} = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    if (queryParameters.get("specialities")?.length) {
      dispatch(
        filterActions.setFilter({
          tableSlug: tableSlug,
          viewId: view?.id,
          name: "specialities_id",
          value: [`${queryParameters.get("specialities")}`],
        })
      );
    }
  }, [queryParameters]);

  const dispatch = useDispatch();

  const {filters} = useFilters(tableSlug, view?.id);

  const computedFields = useMemo(() => {
    const filter = view?.attributes?.quick_filters ?? [];

    return (
      [
        ...(filter ?? []),
        ...(new_list[tableSlug] ?? [])
          ?.filter(
            (fast) =>
              fast.is_checked &&
              !view?.attributes?.quick_filters?.find(
                (quick) => quick?.id === fast.id
              )
          )
          ?.map((fast) => fast),
      ]
        ?.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return fieldsMap[el?.relation_id];
          } else {
            return fieldsMap[el?.id];
          }
        })
        ?.filter((el) => el) ?? []
    );
  }, [view?.attributes?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    );
  };

  return (
    <div
      className={styles.filtersBlock}
      style={{flexDirection: isVertical ? "column" : "row"}}>
      {view?.attributes?.quick_filters?.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <Filter
            field={filter}
            name={filter?.path_slug || filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}

      <FilterVisible
        onChange={onChange}
        selectedTabIndex={selectedTabIndex}
        views={view}
        columns={visibleColumns}
        relationColumns={visibleRelationColumns}
        isLoading={isVisibleLoading}
        form={visibleForm}
        setFilterVisible={setFilterVisible}
      />
    </div>
  );
};

export default FastFilter;
