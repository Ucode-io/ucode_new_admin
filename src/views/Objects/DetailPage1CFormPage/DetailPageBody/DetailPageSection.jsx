import React, {useState, useEffect} from "react";
import styles from "./style.module.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Form1CElementGenerator from "../Form1CElementGenerator";
import DetailPageTable from "../DetailPageTable";

function DetailPageSection({item, control, watch, selectedTab, selectedIndex}) {
  const {i18n} = useTranslation();
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    if (item?.sections) {
      setExpanded(new Array(item.sections.length).fill(true));
    }
  }, [item]);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = isExpanded;
      return newExpanded;
    });
  };

  return (
    <div className={styles.tabSections} id="detailPage">
      {item?.sections?.length ? (
        item?.sections?.map((section, index) => {
          const fieldCount = section?.attributes?.field_count || 2;
          const fields = section?.fields || [];
          return (
            <Accordion
              key={index}
              expanded={expanded[index] || false}
              onChange={handleChange(index)}>
              <AccordionSummary
                sx={{
                  padding: "0 24px 0 20px",
                  borderBottom: "1px solid #EAECF0",
                  borderTop: "1px solid #EAECF0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}>
                <Typography
                  sx={{
                    color: "#101828",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}>
                  {section?.attributes?.[`label_${i18n?.language}`] ||
                    "No Section Name!"}
                </Typography>
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  {expanded?.[index] ? (
                    <KeyboardArrowDownIcon sx={{fontSize: "20px"}} />
                  ) : (
                    <ArrowForwardIosIcon sx={{fontSize: "12px"}} />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${fieldCount}, 1fr)`,
                  padding: "0px",
                }}>
                {fields.map((field, idx) => (
                  <Box
                    key={field.id}
                    sx={{
                      gridColumn:
                        idx % fieldCount === 0 && idx === fields.length - 1
                          ? `span ${fieldCount}`
                          : "auto",
                      overflow: "auto",
                    }}>
                    {field?.attributes?.isTab ? (
                      <DetailPageTable
                        control={control}
                        field={field}
                        index={index}
                        selectedTab={selectedTab}
                      />
                    ) : (
                      <Box sx={{padding: "14px"}}>
                        <Form1CElementGenerator
                          control={control}
                          field={field}
                          fields={fields}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroun: "none",
          }}>
          <CircularProgress size={50} sx={{color: "#449424"}} />
        </Box>
      )}
    </div>
  );
}

export default DetailPageSection;
