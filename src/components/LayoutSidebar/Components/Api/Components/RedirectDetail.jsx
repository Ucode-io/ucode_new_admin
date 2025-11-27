import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box, Typography } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  useRedirectGetByIdQuery,
  useRedirectListQuery,
} from "../../../../../services/redirectService";
import FRow from "../../../../FormElements/FRow";
import HFTextField from "../../../../FormElements/HFTextField";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    // borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    borderRadius: 0,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  flexDirection: "row-reverse",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "15px",
  boxShadow: "none",
}));

const RedirectDetail = ({
  watch,
  mainForm,
  setValue,
  redirectId,
  setComputedData,
}) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const { isLoading: redirectLoading } = useRedirectGetByIdQuery({
    redirectId: redirectId,
    queryParams: {
      enabled: Boolean(redirectId),
      onSuccess: (res) => {
        mainForm.reset({
          ...res,
          from: res.from.slice(watch("attributes.base_url").length + 1),
          defaultFrom: watch("attributes.base_url"),
          to: res.to.slice(1),
          defaultTo: "/",
        });
      },
    },
  });

  const { isLoading: redirectListLoading } = useRedirectListQuery({
    queryParams: {
      onSuccess: (res) => setComputedData(res?.redirect_urls?.length),
    },
  });

  useEffect(() => {
    mainForm.setValue("from", watch("additional_url"));
    mainForm.setValue("defaultFrom", watch("attributes.base_url"));
  }, [watch("additional_url"), watch("attributes.base_url")]);

  return (
    <form>
      <Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Redirect</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FRow
              label={"From"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="defaultFrom"
                control={mainForm.control}
                fullWidth
                required
                disabled={true}
                style={{
                  width: "70%",
                }}
              />
              <HFTextField
                disabledHelperText
                name="from"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"To"}
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="defaultTo"
                control={mainForm.control}
                fullWidth
                required
                disabled={true}
                style={{
                  width: "40%",
                }}
              />
              <HFTextField
                disabledHelperText
                name="to"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
          </AccordionDetails>
        </Accordion>
      </Box>
    </form>
  );
};

export default RedirectDetail;
