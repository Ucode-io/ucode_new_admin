import { Box, Grid } from "@mui/material";
import IconCard from "../IconCard";

const GridItems = ({ list = [], ...props }) => {
  const onDragStart = (event, nodeTitle, nodeType, nodeId) => {
    event.dataTransfer.setData("application/title", nodeTitle);
    event.dataTransfer.setData("application/type", nodeType);
    event.dataTransfer.setData("application/id", nodeId);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Box {...props}>
      {list.map((item, idx) => (
        <Box key={item.label + idx}>
          <Box fontSize={"16"} marginBottom={3} fontWeight={600}>
            {item?.label || ""}
          </Box>
          <Grid container spacing={2}>
            {item.widgets.map((el) => (
              <Grid item>
                <Box
                  width="100%"
                  key={el.label}
                  onDragStart={(event) =>
                    onDragStart(event, el.label, el.type, el.id)
                  }
                  draggable
                >
                  <IconCard noTitle icon={el.icon} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default GridItems;
