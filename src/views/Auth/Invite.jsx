import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import styles from "./style.module.scss";
import InviteForm from "./components/InviteForm";

const Invite = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div style={{ marginLeft: "auto" }}>
        <LanguageSelector />
      </div>
      <h1 className={styles.title}>Invite</h1>
      <p className={styles.subtitle}>{t("fill.in.your.login.info")}</p>

      <InviteForm />
    </div>
  );
};

export default Invite;
