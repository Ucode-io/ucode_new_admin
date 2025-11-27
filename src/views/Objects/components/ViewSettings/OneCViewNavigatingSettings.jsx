import {Box} from "@mui/material";
import React from "react";
import FEditableRow from "../../../../components/FormElements/FEditableRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import OneCNavigateGenerator from "./OneCNavigateGenerator";

function OneCNavigateSettings({form}) {
  return (
    <Box p={2}>
      <FEditableRow label="URL">
        <HFTextField
          fullWidth
          control={form.control}
          name="attributes.navigate.url"
          placeholder={"/url/{{$variable}}"}
        />
      </FEditableRow>

      <OneCNavigateGenerator form={form} />
    </Box>
  );
}

export default OneCNavigateSettings;
