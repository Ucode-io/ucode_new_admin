import { useEffect } from "react";
import classes from "../style.module.scss";
import HFTextField from "../../../components/FormElements/HFTextField";
import { InputAdornment } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
const RegisterForm = ({ control, reset }) => {
  useEffect(() => {
    reset();
  }, []);
  return (
    <>
      <div className={classes.formRow}>
        <p className={classes.label}>{"Company name"}</p>
        <HFTextField
          required
          control={control}
          name="name"
          size="large"
          fullWidth
          placeholder={"Enter company name"}
          autoFocus
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
          required
          control={control}
          name="user_info.email"
          size="large"
          fullWidth
          placeholder={"Enter email"}
          autoFocus
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
        <HFTextField
          required
          control={control}
          name="user_info.phone"
          size="large"
          fullWidth
          placeholder={"Enter phone number"}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalPhoneIcon style={{ fontSize: "30px" }} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.formRow}>
        <p className={classes.label}>{"Login"}</p>
        <HFTextField
          required
          control={control}
          name="user_info.login"
          size="large"
          fullWidth
          placeholder={"Enter login"}
          autoFocus
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
          control={control}
          name="user_info.password"
          size="large"
          fullWidth
          placeholder={"Enter password"}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon style={{ fontSize: "30px" }} />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
};

export default RegisterForm;
