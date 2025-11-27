import { Box, Icon, Typography } from "@mui/material";
import style from "./index.module.scss";
import { Handle, Position } from "reactflow";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const ConditionNodeCard = ({
  icon,
  title = "",
  color = "#007AFF",
  noTitle = false,
  iconStyle,
  conditions,
  handleStyle,
  isConnectable,
  data,
  ...rest
}) => {
  return (
    <Box style={center} className={style.condition_node} {...rest}>
      <Icon
        style={iconStyle}
        as={icon}
        w={noTitle ? 10 : 8}
        h={noTitle ? 10 : 8}
        className={style.icon}
      />
      {title && <div className={style.icon_title}> {title} </div>}
      {conditions?.map(
        (el) =>
          data.id === el.parent_id && (
            <Box className={style.handle} key={el.id}>
              {el.conditions.map((item, idx) => (
                <Box
                  style={center}
                  key={idx}
                  justifyContent="center"
                  columnGap={"5px"}
                >
                  <Typography color={"#000"}>{item?.key}</Typography>
                  <Typography color={"#000"}>{item?.operator}</Typography>
                  <Typography color={"#000"}>{item?.value}</Typography>
                </Box>
              ))}
              <Handle
                type="source"
                position={Position.Right}
                style={{
                  ...handleStyle,
                  position: "absolute",
                  zIndex: "9999",
                  right: "-6px",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  borderRadius: "3px",
                }}
                // isValidConnection={(connection) =>
                //   connection.sourceHandle !== el.id
                // }
                // onConnect={(params) => console.log("handle onConnect", params)}
                id={el.id}
                key={el.id}
                isConnectable={isConnectable}
              />
            </Box>
          )
      )}
    </Box>
  );
};

export default ConditionNodeCard;
