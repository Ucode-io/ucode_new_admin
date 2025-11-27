import { Settings } from "@mui/icons-material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import style from "./style.module.scss";

const SettingsButton = () => {
  const { t } = useTranslation()
  const { tableSlug, appId } = useParams();
  const navigate = useNavigate();

  const tables = useSelector((state) => state.constructorTable.list);

  const tableInfo = useMemo(() => {
    return tables?.find((table) => table.slug === tableSlug);
  }, [tables, tableSlug]);

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${tableInfo?.id}/${tableInfo?.slug}`;
    navigate(url);
  };

  return (
    <div>
      <div className={style.settings} onClick={navigateToSettingsPage}>
        <RectangleIconButton color="white">
          <Settings />
        </RectangleIconButton>
        <span>{t('settings')}</span>
      </div>
    </div>
  );
};

export default SettingsButton;
