import {Download} from "@mui/icons-material";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import useDownloader from "../../../../hooks/useDownloader";
import constructorObjectService from "../../../../services/constructorObjectService";
import style from "./style.module.scss";
import useFilters from "../../../../hooks/useFilters";

const ExcelDownloadButton = ({
  relatedTable,
  fieldSlug,
  fieldSlugId,
  withText,
  sort,
  view,
  computedVisibleFields,
  selectedTab,
  searchText,
  checkedColumns,
}) => {
  const {t, i18n} = useTranslation();

  const {tableSlug, id: idFromParams} = useParams();
  const {download} = useDownloader();
  const [loader, setLoader] = useState(false);
  const {filters} = useFilters(tableSlug, view?.id);

  const onClick = async () => {
    try {
      setLoader(true);
      const {data} = await constructorObjectService.downloadExcel(
        relatedTable ? relatedTable : tableSlug,
        {
          data: {
            [fieldSlug]: fieldSlugId,
            ...sort,
            ...filters,
            field_ids: computedVisibleFields,
            [`${selectedTab?.relation?.relation_table_slug}_id`]: idFromParams,
            language: i18n?.language,
            search: searchText,
            view_fields: checkedColumns,
          },
        }
      );

      const fileName = `${relatedTable ? relatedTable : tableSlug}.xlsx`;
      // window.open('https://' + data.link, { target: '__blank' })
      await download({link: "https://" + data.link, fileName});
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={style.excelUpload} onClick={onClick}>
      <RectangleIconButton loader={loader} color="white" onClick={onClick}>
        {withText ? "Экспорт" : null}
        <Download />
      </RectangleIconButton>
      <span>{t("excel.download")}</span>
    </div>
  );
};

export default ExcelDownloadButton;
