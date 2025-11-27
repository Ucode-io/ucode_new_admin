import React, {useEffect, useMemo} from "react";
import styles from "./style.module.scss";
import {get} from "@ngard/tiny-get";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(() => ({
  box: {
    padding: "0 10px",
  },
  formula_box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
  },
}));

function SingleLine({field, value, row}) {
  const classes = useStyles();

  const computedValue = useMemo(() => {
    const autofill_slug = field?.autofill_table?.split("#")?.[1];

    if (Boolean(autofill_slug) && Boolean(!value)) {
      return get(row?.[`${autofill_slug}_data`], field?.autofill_field);
    } else return value;
  }, [field, row]);

  return typeof value === "object" ? (
    <Box className={classes.box}>{JSON.stringify(computedValue)}</Box>
  ) : (
    <Box className={classes.box}>{computedValue}</Box>
  );
}

export default SingleLine;
