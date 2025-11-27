import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
// import ESPselect from "~/components/ESPSelect"
import styles from "../style.module.scss"
import { authActions } from "../../../store/auth/auth.slice"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"

const ESPLoginForm = ({ navigateToRegistrationForm }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation()
        dispatch(authActions.login())
      }}
      className={styles.form}
    >
      <div className={styles.formArea}>
        <div className={styles.formRow}>
          <p className={styles.label}>{t("choose.edc.key")}</p>
          {/* <ESPselect /> */}
        </div>
      </div>

      <div className={styles.buttonsArea}>
        <PrimaryButton>{t("enter")}</PrimaryButton>
        <SecondaryButton type="button" onClick={navigateToRegistrationForm}>
          {t("register")}
        </SecondaryButton>
      </div>
    </form>
  )
}

export default ESPLoginForm
