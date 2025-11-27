import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import HFTextField from "../../../components/FormElements/HFTextField";
import classes from "../style.module.scss";
import authService from "../../../services/auth/authService";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../store/alert/alert.thunk";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InviteForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputMatch, setInputMatch] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { control, handleSubmit } = useForm();
  const urlParams = new URLSearchParams(location.search);
  const userId = urlParams.get("user_id");
  const project_id = urlParams.get("project_id");
  const envId = urlParams.get("environment_id");
  const clientTypeId = urlParams.get("client_type_id");

  const resetPasswordV2 = (oldPassword, newPassword) => {
    authService
      .resetUserPasswordV2({
        password: newPassword,
        old_password: oldPassword,
        user_id: userId,
        environment_id: envId,
        project_id: project_id,
        client_type_id: clientTypeId,
      })
      .then((res) => {
        dispatch(showAlert("Password successfuly updated", "success"));
        navigate("/login");
      })
      .catch((err) => {
        dispatch(showAlert("Something went wrong on changing password"));
      });
  };

  const onSubmit = (values) => {
    const oldPassword = values?.old_password;
    const newPassword = values?.new_password;
    if (values?.new_password && values?.old_password) {
      if (values?.new_password !== values?.confirm_password) {
        dispatch(showAlert("Confirm Password fields do not match"));
        setInputMatch(true);
      } else {
        resetPasswordV2(oldPassword, newPassword);
        setInputMatch(false);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.formRow}>
          <p className={classes.label}>Old password</p>
          <HFTextField
            required
            control={control}
            name="old_password"
            size="large"
            fullWidth
            placeholder={"Enter old password"}
            autoFocus
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    color="primary"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>New password</p>
          <HFTextField
            required
            control={control}
            name="new_password"
            size="large"
            fullWidth
            type={showNewPassword ? "text" : "password"}
            placeholder={"Enter new password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    color="primary"
                    onClick={() => {
                      setShowNewPassword((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.formRow}>
          <p className={classes.label}>Confirm password</p>
          <HFTextField
            required
            control={control}
            name="confirm_password"
            size="large"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            placeholder={"Enter confirm password"}
            style={{ border: `1px solid ${inputMatch ? "red" : "#eee"}` }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ fontSize: "30px" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    color="primary"
                    onClick={() => {
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className={classes.buttonsArea}>
          <PrimaryButton size="large">{t("enter")}</PrimaryButton>
        </div>
      </form>
    </>
  );
};

export default InviteForm;
