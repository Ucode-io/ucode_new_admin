import {Box, Typography} from "@mui/material";
import styles from "./month.module.scss";
import {format} from "date-fns";
import {getRelationFieldTableCellLabel} from "../../../../utils/getRelationFieldLabel";
import {dateValidFormat} from "../../../../utils/dateValidFormat";
import MultiselectCellColoredElement from "../../../../components/ElementGenerators/MultiselectCellColoredElement";

const flex = {
  display: "flex",
  alignItems: "center",
  columnGap: "6px",
  justifyContent: "center",
};

const InfoBlockMonth = ({viewFields, data, isSingleLine}) => {
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
      {/* <div>
        <Typography variant="h6" fontSize={"18px"}>
          {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
          {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
        </Typography>
      </div> */}

      {/* {viewFields?.map((field) => ( */}
      <>
        {viewFields[0]?.type === "LOOKUP" ? (
          <Box style={flex}>
            <Typography variant="h6" fontSize={"18px"}>
              {viewFields[0]?.label}
            </Typography>{" "}
            {getRelationFieldTableCellLabel(
              viewFields[0],
              data,
              viewFields[0].slug + "_data"
            )}
          </Box>
        ) : viewFields[0]?.type === "DATE_TIME" ? (
          <Box style={flex}>
            <Typography variant="h6" fontSize={"18px"}>
              {viewFields[0]?.label}:
            </Typography>{" "}
            {dateValidFormat(data[viewFields[0]?.slug], "dd.MM.yyyy HH:mm")}
          </Box>
        ) : viewFields[0]?.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
          <Box style={flex}>
            <Typography variant="h6" fontSize={"18px"}>
              {viewFields[0]?.label}:
            </Typography>{" "}
            {dateValidFormat(data[viewFields[0]?.slug], "dd.MM.yyyy HH:mm")}
          </Box>
        ) : viewFields[0]?.type === "MULTISELECT" ? (
          <MultiselectCellColoredElement
            style={{padding: "2px 5px", marginBottom: 4}}
            value={data[viewFields[0]?.slug]}
            field={viewFields[0]}
          />
        ) : (
          <Box style={flex}>
            <Typography variant="h6" fontSize={"18px"}>
              {/* {viewFields[0]?.label}: */}
              {data[viewFields[0]?.slug]}
            </Typography>{" "}
          </Box>
        )}
      </>
      {/* ))} */}
    </div>
  );
};

export default InfoBlockMonth;
