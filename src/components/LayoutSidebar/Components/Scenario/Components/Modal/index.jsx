import { Box, Divider, Typography } from "@mui/material";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

function CardModal({ children, closeBtn, ...props }) {
  return (
    <Box {...props} overflow="scroll" position={"relative"}>
      <Box px="12px" py="4px">
        <Box style={{ ...center, justifyContent: "space-between" }}>
          <Typography fontSize={"16px"} fontWeight={600}>
            Create
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box px="16px" py="20px">
        {children}
      </Box>
    </Box>
  );
}

export default CardModal;
