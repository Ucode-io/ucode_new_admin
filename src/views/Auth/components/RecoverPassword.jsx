import React, { useState } from "react";
import HFTextField from "../../../components/FormElements/HFTextField";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputAdornment } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import classes from "../style.module.scss";
import authService from "../../../services/auth/authService";
import { store } from "../../../store";
import { showAlert } from "../../../store/alert/alert.thunk";
import { set } from "date-fns";

export default function RecoverPassword({ setFormType }) {
  const { t } = useTranslation();
  const { control, handleSubmit, errors, setValue, getValues, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("login");
  const dispatch = store.dispatch;

  const onSubmit = (values) => {
    setLoading(true);

    authService
      .forgotPassword(values)
      .then((res) => {
        if (res?.email_found) {
          setViewType("otp");
          setValue("login", res);
        } else if (!res.user_id) {
          store.dispatch(showAlert("Login not found!"));
        } else if (res.email_found === false) {
          setViewType("new_email");
          if (res.user_id) setValue("user_id", res.user_id);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sendNewEmail = () => {
    setLoading(true);

    const data = {
      email: getValues("new_email"),
      user_id: getValues("user_id"),
    };
    authService
      .setEmail(data)
      .then((res) => {
        if (res.email_found) {
          setViewType("otp");
          setValue("login", res);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const verifyOtp = () => {
    setLoading(true);
    const computedValues = {
      sms_id: getValues("login").sms_id,
      otp: getValues("otp"),
      register_type: "default",
    };
    authService
      .verifyOnlyEmail(computedValues)
      .then((res) => {
        if (res.verified) {
          setViewType("new_password");
        } else {
          store.dispatch(showAlert("Wrong OTP!"));
        }
      })
      .catch((err) => {
        store.dispatch(showAlert("Wrong OTP!"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPassword = () => {
    const computedValues = {
      password: getValues("new_password"),
      user_id: getValues("login.user_id"),
    };

    authService
      .resetPasswordProfile(computedValues)
      .then((res) => {
        dispatch(showAlert("Successfully updated password!", "success"));
        setFormType("LOGIN");
        reset();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      className={classes.form}
      onSubmit={(e) => {
        e.preventDefault();
        viewType === "login" ? onSubmit(getValues()) : viewType === "otp" ? verifyOtp() : viewType === "new_email" ? sendNewEmail() : resetPassword();
      }}
    >
      {viewType === "login" ? (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div className={classes.formRow}>
            <p className={classes.label}>{t("login")}</p>
            <HFTextField
              required
              control={control}
              name="login"
              size="large"
              fullWidth
              placeholder={t("enter.login")}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={classes.buttonsArea} style={{ marginTop: "20px" }}>
            <PrimaryButton onClick={() => onSubmit(getValues())} type={"button"} size="large" loader={loading}>
              {t("enter")}
            </PrimaryButton>
          </div>
        </div>
      ) : viewType === "otp" ? (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div className={classes.formRow}>
            <p className={classes.label}>{"OTP"}</p>
            <HFTextField required key={viewType} control={control} name="otp" size="large" fullWidth placeholder={"OTP code from mail"} autoFocus />
          </div>

          <div className={classes.buttonsArea} style={{ marginTop: "20px" }}>
            <PrimaryButton
              size="large"
              type={"button"}
              loader={loading}
              onClick={() => {
                verifyOtp();
              }}
            >
              {"Send"}
            </PrimaryButton>
          </div>
        </div>
      ) : viewType === "new_email" ? (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div className={classes.formRow}>
            <p className={classes.label}>{"New Email"}</p>
            <HFTextField required key={viewType} control={control} name="new_email" size="large" fullWidth placeholder={"Type new email"} autoFocus />
          </div>

          <div className={classes.buttonsArea} style={{ marginTop: "20px" }}>
            <PrimaryButton
              size="large"
              type={"button"}
              loader={loading}
              onClick={() => {
                sendNewEmail();
              }}
            >
              {"Set new email"}
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div className={classes.formRow}>
            <p className={classes.label}>{"New password"}</p>
            <HFTextField required key={viewType} control={control} name="new_password" size="large" fullWidth placeholder={"Type new password"} autoFocus />
          </div>

          <div className={classes.buttonsArea} style={{ marginTop: "20px" }}>
            <PrimaryButton
              size="large"
              type={"button"}
              loader={loading}
              onClick={() => {
                resetPassword();
              }}
            >
              {"Set new password"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </form>
  );
}
