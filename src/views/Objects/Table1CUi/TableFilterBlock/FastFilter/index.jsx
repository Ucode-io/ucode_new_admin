import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";
import {filterActions} from "../../../../../store/filter/filter.slice";
import useFilters from "../../../../../hooks/useFilters";
import styles from "./style.module.scss";
import FilterSearchMenu from "../FilterSearchMenu";

function NewFastFilter({view, fields}) {
  const {tableSlug} = useParams();
  const [queryParameters] = useSearchParams();
  const dispatch = useDispatch();
  const {filters} = useFilters(tableSlug, view?.id);

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
    <>
      {fields?.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <FilterSearchMenu
            field={filter}
            name={filter?.path_slug || filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
            view={view}
          />
        </div>
      ))}
    </>
  );
}

export default NewFastFilter;
