import {Delete} from "@mui/icons-material";
import {Box} from "@mui/material";
import React from "react";
import HFTextField from "../../../FormElements/HFTextField";
import RectangleIconButton from "../../../Buttons/RectangleIconButton";

function VariableRow({control, index, remove, summary}) {
  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <Box key={summary?.id} sx={{margin: "10px 15px"}}>
      <Box
        sx={{display: "flex", alignItems: "center", width: "100%", gap: "15px"}}
      >
        <HFTextField
          fullWidth
          control={control}
          name={`variables.${index}.key`}
          placeholder={"key"}
        />
        <HFTextField
          fullWidth
          control={control}
          name={`variables.${index}.value`}
          placeholder={"value"}
        />
        <Box sx={{margin: "0 5px"}}>
          <RectangleIconButton
            color="error"
            onClick={() => deleteSummary(index)}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default VariableRow;
