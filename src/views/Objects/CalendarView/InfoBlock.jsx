import {Box, Typography} from "@mui/material";
import MultiselectCellColoredElement from "../../../components/ElementGenerators/MultiselectCellColoredElement";
import {dateValidFormat} from "../../../utils/dateValidFormat";
import {getRelationFieldTableCellLabel} from "../../../utils/getRelationFieldLabel";
import styles from "./style.module.scss";
import {format} from "date-fns";

const flex = {
  display: "flex",
  alignItems: "center",
  columnGap: "6px",
};

const InfoBlock = ({viewFields, data, isSingleLine}) => {
  if (isSingleLine)
    return (
      <div className={`${styles.infoBlock} ${styles.singleLine}`}>
        {data.calendar?.elementFromTime
          ? format(data.calendar?.elementFromTime, "HH:mm")
          : ""}
        -
        {data.calendar?.elementToTime
          ? format(data.calendar?.elementToTime, "HH:mm")
          : ""}
      </div>
    );

  return (
    <div className={`${styles.infoBlock}`}>
      <div>
        <Typography variant="h6" fontSize={"18px"}>
          {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
          {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
        </Typography>
      </div>

      {viewFields?.map((field) => (
        <p>
          {field.type === "LOOKUP" ? (
            <Box style={flex}>
              <Typography variant="h6" fontSize={"18px"}>
                {field.label}:
              </Typography>{" "}
              {getRelationFieldTableCellLabel(
                field,
                data,
                field.slug + "_data"
              )}
            </Box>
          ) : field.type === "DATE_TIME" ? (
            <Box style={flex}>
              <Typography variant="h6" fontSize={"18px"}>
                {field.label}:
              </Typography>{" "}
              {dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")}
            </Box>
          ) : field.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
            <Box style={flex}>
              <Typography variant="h6" fontSize={"18px"}>
                {field.label}:
              </Typography>{" "}
              {dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")}
            </Box>
          ) : field.type === "MULTISELECT" ? (
            <MultiselectCellColoredElement
              style={{padding: "2px 5px", marginBottom: 4}}
              value={data[field.slug]}
              field={field}
            />
          ) : (
            <Box style={flex}>
              <Typography variant="h6" fontSize={"18px"}>
                {field.label}:
              </Typography>{" "}
              {data[field.slug]}
            </Box>
          )}
        </p>
      ))}
    </div>
  );
};

export default InfoBlock;
