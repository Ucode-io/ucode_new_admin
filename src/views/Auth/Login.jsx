import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import LoginForm from "./components/LoginForm";
import styles from "./style.module.scss";
import { useState } from "react";

const Login = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [formType, setFormType] = useState("LOGIN");

  return (
    <div className={styles.page}>
      {formType !== "register" && (
        <>
          <div style={{ marginLeft: "auto" }}>
            <LanguageSelector />
          </div>
          <h1 className={styles.title}>
            {index === 0 ? t("enter.to.system") : t("register.form")}
          </h1>
          <p className={styles.subtitle}>
            {index === 0
              ? t("fill.in.your.login.info")
              : t("register.form.desc")}
          </p>
        </>
      )}

      <LoginForm
        setFormType={setFormType}
        formType={formType}
        setIndex={setIndex}
        index={index}
      />
    </div>
  );
};

export default Login;
