import HFSelect from "../../../../../../components/FormElements/HFSelect";
import {Box, Switch, Tooltip} from "@mui/material";
import RectangleIconButton from "../../../../../../components/Buttons/RectangleIconButton";
import {Delete} from "@mui/icons-material";
import FRow from "../../../../../../components/FormElements/FRow";
import {useWatch} from "react-hook-form";

const AutoFilterRow = ({
  control,
  basePath,
  index,
  relations,
  connections,
  remove,
  setValue,
  watch,
}) => {
  const filterBasePath = `${basePath}.${index}`;
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "5px",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <Box flex={1}>
        <HFSelect
          control={control}
          name={`${filterBasePath}.object_field`}
          placeholder="Object field"
          options={relations}
        />
      </Box>
      <Box flex={1}>
        <HFSelect
          control={control}
          name={`${filterBasePath}.custom_field`}
          placeholder="Custom field"
          options={connections}
        />
      </Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Tooltip title="Not use in tab">
          <Switch
            checked={watch(`${filterBasePath}.not_use_in_tab`)}
            onChange={(e) => {
              setValue(`${filterBasePath}.not_use_in_tab`, e.target.checked);
            }}
          />
        </Tooltip>
      </Box>
      <RectangleIconButton
        colorScheme="red"
        variant="outline"
        onClick={() => remove(index)}
      >
        <Delete color="error" />
      </RectangleIconButton>
    </Box>
  );
};

export default AutoFilterRow;
