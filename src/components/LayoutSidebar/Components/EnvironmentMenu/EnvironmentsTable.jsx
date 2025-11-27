import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import styles from "./styles.module.scss";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import versionService from "../../../../services/versionService";
import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "react-query";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {store} from "../../../../store";

export default function EnvironmentsTable({
  environments,
  setSelectedEnvironment,
  selectedEnvironment,
  handleClose,
  setSelectedMigrate,
  selectedMigrate,
  company,
  version,
}) {
  const dispatch = useDispatch();
  const envId = store.getState().company.environmentId;
  const access_type = useSelector((state) => state.auth.access_type?.payload);
  const queryClient = useQueryClient();
  const handleChange = (event) => {
    publishRelease(event.target.value);
    setSelectedEnvironment(event.target.value);
  };

  const publishRelease = (event) => {
    const data = {
      env_id: event,
      version: {...version},
    };
    versionService
      .publish(data)
      .then(() => {
        setSelectedMigrate(true);
      })
      .finally(() => {
        queryClient.refetchQueries(["GET_ROLE_LIST"]);
        dispatch(showAlert("Successfully published!", "success"));
      });
  };

  return (
    <div style={{width: "100%"}}>
      <div className={styles.header}>
        <Typography variant="h4">
          {selectedEnvironment ? "Select migration" : "Select environment"}
        </Typography>
        <ClearIcon
          color="primary"
          onClick={handleClose}
          width="46px"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <Box className={styles.projectradio}>
        <RadioGroup key={selectedEnvironment}>
          <Box className={styles.projectgroup}>
            {access_type === "private"
              ? environments
                  ?.filter((el) => el?.id === envId)
                  ?.map((item, index) => (
                    <FormControlLabel
                      value={item?.id}
                      control={<Radio />}
                      label={<h4>{item?.name} </h4>}
                      className={
                        environments === item.id
                          ? styles.active
                          : styles.inactive
                      }
                      onChange={handleChange}
                    />
                  ))
              : environments?.map((item, index) => (
                  <FormControlLabel
                    value={item?.id}
                    control={<Radio />}
                    label={<h4>{item?.name} </h4>}
                    className={
                      environments === item.id ? styles.active : styles.inactive
                    }
                    onChange={handleChange}
                  />
                ))}
          </Box>
        </RadioGroup>
      </Box>
    </div>
  );
}
