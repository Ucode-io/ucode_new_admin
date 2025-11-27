import { Checkbox, TextField } from "@mui/material"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import PDFIcon from "../../assets/icons/pdfFileIcon.svg"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton"
import DownloadIcon from "@mui/icons-material/Download"
import styles from "./style.module.scss"
import { useTranslation } from "react-i18next"

const Registration = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t("registration")}</h1>

      <form className={styles.form}>
        <div className={styles.formArea}>
          <div className={styles.formRow}>
            <p className={styles.label}>{t("login")}</p>
            <TextField fullWidth placeholder={t("enter.login")} />
          </div>

          <div className={styles.formRow}>
            <p className={styles.label}>{t("password")}</p>
            <TextField fullWidth placeholder={t("enter.password")} />
          </div>
          <div className={styles.formRow}>
            <p className={styles.label}>{t("repeat.password")}</p>
            <TextField fullWidth placeholder={t("repeat.password")} />
          </div>
          <div className={styles.formRow}>
            <p className={styles.label}>{t("email.address")}</p>
            <TextField fullWidth placeholder={t("enter.email.address")} />
          </div>

          <div className={styles.formRow}>
            <p className={styles.label}>{t("public.offer")}</p>

            <div className={styles.publickOfferRow}>
              <img src={PDFIcon} alt="" />

              <div className={styles.nameBlock}>
                <p className={styles.fileName}>
                  {t("public.offer")} IT услуг Soliq Servis.uz
                </p>
                <p className={styles.fileSize}>5.2mb</p>
              </div>

              <RectangleIconButton color="primary">
                <DownloadIcon color="primary" />
              </RectangleIconButton>
            </div>
          </div>

          <div className={styles.formRow}>
            <div>
              <Checkbox
                id={`checkbox`}
                style={{ transform: "translatey(-1px)" }}
              />
              <label htmlFor={`checkbox`} className={styles.checkboxLabel}>
                {t("accept.terms.of.public.offer")}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonsArea}>
          <PrimaryButton>{t("continue")}</PrimaryButton>
        </div>
      </form>
    </div>
  )
}

export default Registration
