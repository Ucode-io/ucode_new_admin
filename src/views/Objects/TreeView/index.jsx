import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";

import {Add} from "@mui/icons-material";
import {Divider} from "@mui/material";
import {useTranslation} from "react-i18next";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import PageFallback from "../../../components/PageFallback";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import FastFilter from "../components/FastFilter";
import RecursiveBlock from "./RecursiveBlock";
import {default as style, default as styles} from "./style.module.scss";

const TreeView = ({groupField, fieldsMap, group, view, tab, filters}) => {
  const {t} = useTranslation();
  const {tableSlug} = useParams();
  const {new_list} = useSelector((state) => state.filter);
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const [tableLoader, setTableLoader] = useState(true);
  const [data, setData] = useState([]);

  const parentElements = useMemo(() => {
    return data.filter((row) => !row[`${tableSlug}_id`]);
  }, [data, tableSlug]);

  const getAllData = async () => {
    setTableLoader(true);
    try {
      let groupFieldName = "";

      if (groupField?.id?.includes("#"))
        groupFieldName = `${groupField.id.split("#")[0]}_id`;
      if (groupField?.slug) groupFieldName = groupField?.slug;

      const {data} = await constructorObjectService.getListV2(tableSlug, {
        data: {
          offset: 0,
          ...filters,
          [tab?.slug]: tab?.value,
        },
      });

      setData(data.response ?? []);
    } finally {
      setTableLoader(false);
    }
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", null, {}, menuId);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      <div className={style.extraAdd}>
        <div className={style.extraAddButton}>
          <RectangleIconButton color="primary" onClick={navigateToCreatePage}>
            <Add color="primary" />
          </RectangleIconButton>
        </div>
      </div>
      <Divider />
      {(view?.quick_filters?.length > 0 ||
        (new_list[tableSlug] &&
          new_list[tableSlug].some((i) => i.checked))) && (
        <div className={styles.filters}>
          <p>{t("filters")}</p>
          <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
        </div>
      )}
      {tableLoader ? (
        <PageFallback />
      ) : (
        <>
          {parentElements?.map((row) => (
            <RecursiveBlock
              key={row.guid}
              row={row}
              view={view}
              data={data}
              setData={setData}
              fieldsMap={fieldsMap}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TreeView;
