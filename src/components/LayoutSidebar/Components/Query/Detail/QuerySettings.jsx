import { Box, Input, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { SidebarBody } from "../../Documents/Components/Sidebar-old";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { useMemo, useState } from "react";
import styles from "../style.module.scss";
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
  padding: theme.spacing(1),
  boxShadow: "none",
}));

const QuerySettings = ({ form, queryVariables }) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const variables = form.watch("variables") ?? [];

  return (
    <Box className={styles.accordion}>
      <SidebarBody h="calc(100vh - 100px)">
      <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Resource Variables</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {queryVariables?.map((item) => (
              <Box
                display="flex"
                height="max-content"
                width="full"
                colorScheme="gray"
                variant="ghost"
                justifyContent="flex-start"
                  >
                <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                >
                  <Typography mb={2} color="#000">
                    {item?.key}
                  </Typography>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Variables</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {variables?.map((variable, index) => (
              <Box
                display="flex"
                height="max-content"
                width="full"
                colorScheme="gray"
                variant="ghost"
                justifyContent="flex-start"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Typography mb={2} color="#000">
                    {variable.key}
                  </Typography>

                  <Box width="100%" marginBottom={"10px"}>
                    <Controller
                      name={`variables.${index}.value`}
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <HFTextField
                          placeholder="Specify a value"
                          onChange={onChange}
                          value={value}
                          fullWidth
                          disabled={variable?.key?.includes('$$') ? true : false}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>Schema</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>No schema available</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>Usage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>This query isn't used in any apps.</Typography>
          </AccordionDetails>
        </Accordion>
      </SidebarBody>
    </Box>
  );
};

export default QuerySettings;
