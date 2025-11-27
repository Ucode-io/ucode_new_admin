import {Box, Typography} from "@mui/material";
import styles from "../style.module.scss";
import {dateValidFormat} from "../../../../utils/dateValidFormat";
import {getRelationFieldTableCellLabel} from "../../../../utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../../../../components/ElementGenerators/MultiselectCellColoredElement";
import {format} from "date-fns";

const flex = {
  display: "flex",
  alignItems: "center",
  columnGap: "6px",
};

const InfoBlockWeek = ({viewFields, data, isSingleLine}) => {
  if (isSingleLine)
    return (
      <div className={`${styles.infoBlock} ${styles.singleLine}`}>
        {viewFields?.map((item) => {
          return `${data[item?.slug]} `;
        })}
      </div>
    );

  // {data.calendar?.elementFromTime
  //   ? format(data.calendar?.elementFromTime, "HH:mm")
  //   : ""}
  // -
  // {data.calendar?.elementToTime
  //   ? format(data.calendar?.elementToTime, "HH:mm")
  //   : ""}

  return (
    <div className={`${styles.infoBlock}`}>
      <div>
        <Typography variant="p" fontSize={"12px"} fontWeight={"bold"}>
          {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
          {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
        </Typography>
      </div>

      {viewFields?.map((field) => (
        <p>
          {field.type === "LOOKUP" ? (
            <Box style={flex}>
              <Typography variant="p" fontSize={"12px"} fontWeight={"bold"}>
                {field.label}:
              </Typography>{" "}
              <Typography fontSize={"12px"}>
                {getRelationFieldTableCellLabel(
                  field,
                  data,
                  field.slug + "_data"
                )}
              </Typography>
            </Box>
          ) : field.type === "DATE_TIME" ? (
            <Box style={flex}>
              <Typography variant="p" fontSize={"12px"} fontWeight={"bold"}>
                {field.label}:
              </Typography>{" "}
              <Typography fontSize={"12px"}>
                {dateValidFormat(data[field.slug], "dd.MM.yyyy")}
              </Typography>
            </Box>
          ) : field?.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
            <Box style={flex}>
              <Typography variant="p" fontSize={"12px"} fontWeight={"bold"}>
                {field.label}:
              </Typography>{" "}
              <Typography fontSize={"12px"}>
                {dateValidFormat(data[field.slug], "dd.MM.yyyy")}
              </Typography>
            </Box>
          ) : field.type === "MULTISELECT" ? (
            <MultiselectCellColoredElement
              style={{padding: "2px 5px", marginBottom: 4}}
              value={data[field.slug]}
              field={field}
            />
          ) : field?.type === "SINGLE_LINE" ? (
            <Box style={flex}>{data[field.slug]}</Box>
          ) : (
            <Box style={flex}>
              <Typography variant="p" fontSize={"12px"} fontWeight={"bold"}>
                {field.label}:
              </Typography>{" "}
              <Typography fontSize={"12px"}>{data[field.slug]}</Typography>
            </Box>
          )}
        </p>
      ))}
    </div>
  );
};

export default InfoBlockWeek;
