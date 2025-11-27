import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFSelect from "../../../components/FormElements/HFSelect";
import authService from "../../../services/auth/authService";
import { loginAction } from "../../../store/auth/auth.thunk";
import DynamicFields from "./DynamicFields";
import { Card, Modal } from "@mui/material";
import classes from "../style.module.scss";

const AfterLoginModal = ({
  control,
  setValue,
  watch,
  handleSubmit,
  roles,
  setFormType,
  formType,
  computedClientTypes,
  computedConnections,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [clientTypes, setClientTypes] = useState([]);

  const multiCompanyLogin = (data) => {
    setLoading(true);

    authService
      .multiCompanyLogin(data)
      .then((res) => {
        setLoading(false);
        setClientTypes(res.client_types);
        setCompanies(res.companies);
        setFormType("MULTI_COMPANY");
      })
      .catch(() => setLoading(false));
  };

  const onSubmit = (values) => {
    setLoading(true);
    if (formType === "LOGIN") multiCompanyLogin(values);
    else dispatch(loginAction(values)).then(() => setLoading(false));
  };

  return (
    <div>
      <Modal open className="child-position-center">
        <Card className="PlatformModal">
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div style={{ padding: "0 20px" }}>
              <div
                className={classes.formArea}
                style={{ marginTop: "10px", height: `calc(100vh - 350px)` }}
              >
                <div className={classes.formRow}>
                  <p className={classes.label}>{t("client_type")}</p>
                  <HFSelect
                    required
                    control={control}
                    name="client_type"
                    size="large"
                    placeholder={t("enter.client_type")}
                    options={computedClientTypes}
                  />
                </div>
                <div className={classes.formRow}>
                  <p className={classes.label}>{t("role")}</p>
                  <HFSelect
                    required
                    control={control}
                    name="role_id"
                    size="large"
                    placeholder={t("enter.role")}
                    options={roles}
                  />
                </div>
                {computedConnections.length
                  ? computedConnections?.map((connection, idx) => (
                      <DynamicFields
                        key={connection?.guid}
                        table={computedConnections}
                        connection={connection}
                        index={idx}
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        companies={companies}
                      />
                    ))
                  : null}
              </div>
            </div>
            <div className={classes.modalButtonsArea}>
              <PrimaryButton size="large" loader={loading}>
                {t("enter")}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default AfterLoginModal;
