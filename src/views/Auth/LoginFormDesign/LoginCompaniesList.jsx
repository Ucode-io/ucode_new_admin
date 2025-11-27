import React from "react";
import classes from "./style.module.scss";
import {useTranslation} from "react-i18next";
import {Typography} from "@mui/material";
import HFSelect from "../../../components/FormElements/HFSelect";
import DynamicFields from "../DynamicFields";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

function LoginCompaniesList({
  computedProjects,
  computedCompanies,
  computedEnvironments,
  computedClientTypes,
  computedConnections,
  control,
  watch,
  companies,
  selectedCollection,
  setSelectedCollection,
  loading = false,
  handleSubmit = () => {},
  setValue = () => {},
}) {
  const {t} = useTranslation();
  return (
    <>
      <div className={classes.dialogContainer}>
        <Typography variant="h5" className={classes.headerContent}>
          Multi Company
        </Typography>
        <div className={classes.formArea}>
          {computedCompanies?.length !== 1 && (
            <div className={classes.formRow}>
              <p className={classes.label}>{t("company")}</p>
              <HFSelect
                required
                control={control}
                name="company_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("enter.company")}
                options={computedCompanies}
              />
            </div>
          )}
          {computedProjects?.length !== 1 && (
            <div className={classes.formRow}>
              <Typography className={classes.label}>{t("project")}</Typography>
              <HFSelect
                required
                control={control}
                name="project_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("enter.project")}
                options={computedProjects}
              />
            </div>
          )}
          {computedEnvironments?.length !== 1 && (
            <div className={classes.formRow}>
              <Typography className={classes.label}>
                {t("Environment")}
              </Typography>
              <HFSelect
                required
                control={control}
                name="environment_id"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={t("select.environment")}
                options={computedEnvironments}
              />
            </div>
          )}
          {computedClientTypes?.length !== 1 && (
            <div className={classes.formRow}>
              <Typography
                sx={{fontSize: "16px", margin: "15px 0  10px 0"}}
                variant="h6"
                className={classes.label}>
                {"Client Type"}
              </Typography>
              <HFSelect
                required
                control={control}
                name="client_type"
                size="large"
                fullWidth
                className={classes.dialogSelect}
                placeholder={"Choose client type"}
                options={computedClientTypes}
              />
            </div>
          )}
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
                  options={connection?.options}
                  companies={companies}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                />
              ))
            : null}
        </div>
        <div className={classes.footerContent}>
          <PrimaryButton
            className={classes.primaryButton}
            onClick={handleSubmit}
            loader={loading}>
            {"Enter"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}

export default LoginCompaniesList;
