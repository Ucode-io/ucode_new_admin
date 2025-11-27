import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, InputAdornment } from "@mui/material";
import HFTextField from "../../../components/FormElements/HFTextField";
import { useRegisterCompanyMutation } from "../../../services/companyService";
import classes from "../style.module.scss";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import HFTextFieldWithMask from "../../../components/FormElements/HFTextFieldWithMask";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../store/alert/alert.thunk";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { useTranslation } from "react-i18next";
import { formatPhoneNumberForRequest } from "../../../utils/formatPhoneNumber";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "react-query";

const RegisterFormPage = ({ setFormType, formType }) => {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };
  const { mutate: updateObject } = useMutation(() => console.log(""));

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const { mutateAsync: registerCompany, isLoading } =
    useRegisterCompanyMutation({
      onSuccess: () => {
        dispatch(showAlert("Registration was successful", "success"));
        navigate(-1);
      },
      onError: (err) => {
        if (err.response?.data?.description) {
          dispatch(showAlert(err.response.data.description));
        } else
          dispatch(
            showAlert(
              "Connection issues. Please try again",
              "error"
            )
          );
      },
    });

  const onSubmit = (values) => {
    registerCompany({
      ...values,
      user_info: {
        ...values.user_info,
        phone: formatPhoneNumberForRequest(values.user_info.phone),
      },
    });
  };

  return (
    <div className={classes.form}>
      <h1 className={classes.title}>Registration</h1>
      <p className={classes.subtitle}>Fill in the registration details</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="" mt={5} h="calc(100vh - 300px)" overflow="auto">
          <div className={classes.formRow}>
            <p className={classes.label}>{"Company name"}</p>
            <HFTextField
              name="name"
              control={control}
              fullWidth
              placeholder="Enter a company name"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ApartmentIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Email address"}</p>
            <HFTextField
              name="user_info.email"
              control={control}
              required
              fullWidth
              placeholder="Enter email address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={classes.formRow}>
            <p className={classes.label}>{"Phone number"}</p>
            <HFTextFieldWithMask
              name="user_info.phone"
              control={control}
              mask={"+\\9\\9\\8 (99) 999-99-99"}
              maskChar={null}
              required
              placeholder="Enter phone number"
              updateObject={updateObject}
              className={classes.mask}
              fullWidth
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Login"}</p>
            <HFTextField
              required
              name="user_info.login"
              control={control}
              fullWidth
              placeholder="Come up with a login"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LoginIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.formRow}>
            <p className={classes.label}>{"Password"}</p>
            <HFTextField
              required
              name="user_info.password"
              control={control}
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Come up with a password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon style={{ fontSize: "30px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Box>
      </form>

      <div className={classes.buttonsArea}>
        <PrimaryButton
          onClick={handleSubmit(onSubmit)}
          size="large"
          loader={isLoading}
          className={`${
            formType === "register"
              ? classes.registerBtnPage
              : classes.registerBtn
          }`}
        >
          {t("Зарегистрироваться")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default RegisterFormPage;
