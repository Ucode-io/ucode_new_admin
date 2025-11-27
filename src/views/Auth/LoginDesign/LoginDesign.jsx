import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useState } from "react";
import LoginFormDesign from "../components/LoginFormDesign";

const LoginDesign = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [formType, setFormType] = useState("LOGIN");

  return (
    <div className={styles.page}>
      {formType !== "register" && (
        <>
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

      <LoginFormDesign
        setFormType={setFormType}
        formType={formType}
        setIndex={setIndex}
        index={index}
      />
    </div>
  );
};

export default LoginDesign;
