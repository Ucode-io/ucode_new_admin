import { Box } from "@mui/material";
import React from "react";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";

function CommonPermission({
  control,
  tablesList,
  clientTypeList,
  getRoleList,
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          padding: "15px",
          paddingBottom: "0",
        }}
      >
        <FRow label="User type">
          <HFSelect
            control={control}
            name={"client_type"}
            options={clientTypeList}
          />
        </FRow>
        <FRow label="Role">
          <HFSelect control={control} name={"guid"} options={getRoleList} />
        </FRow>
      </Box>
    </>
  );
}

export default CommonPermission;
