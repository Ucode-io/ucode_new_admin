import { Box, Typography } from "@mui/material";
import InputWithPopUp from "./InputWithPopUp";
import { useFieldArray } from "react-hook-form";

const ResponseRelationFields = ({ form, control, index }) => {
  const { fields } = useFieldArray({
    control,
    name: `body.query_mapping.response_map.relations.${index}.field_match`,
  });

  return (
    <Box borderRadius="0.375rem" border="1px solid #E2E8F0">
      <Box>
        {fields?.map((item, fieldIndex) => (
          <Box
            display="flex"
            justifyContent="space-between"
            borderBottom="1px solid #E2E8F0"
          >
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              pl="5px"
              maxHeight="32px !important"
              columnGap={"8px"}
            >
              <Typography>
                {form.watch(
                  `body.query_mapping.response_map.relations.${index}.field_match.${fieldIndex}.key`
                )}
              </Typography>
              <marquee>
                <Typography>
                  {form.watch(
                    `body.query_mapping.response_map.relations.${index}.field_match.${fieldIndex}.field_type`
                  )}
                </Typography>
              </marquee>
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              pl="5px"
              maxHeight="32px !important"
              borderLeft="1px solid #E2E8F0"
            >
              <InputWithPopUp
                name={`body.query_mapping.response_map.relations.${index}.field_match.${fieldIndex}.value`}
                form={form}
                placeholder={"Value"}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResponseRelationFields;
