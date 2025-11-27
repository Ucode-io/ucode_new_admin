import { Box, Typography } from "@mui/material";
import HFSelect from "../../../../FormElements/HFSelect";
import { query_types } from "../mock/ApiEndpoints";
import styles from "../style.module.scss";
import InputWithPopUp from "./InputWithPopUp";
import { useFieldArray } from "react-hook-form";

const RelationFields = ({ form, control, index }) => {
  const { fields } = useFieldArray({
    control,
    name: `body.query_mapping.request_map.relations.${index}.field_match`,
  });

  return (
    <Box borderRadius="0.375rem" border={fields.length && `1px solid #E2E8F0`}>
      <Box>
        {fields?.map((item, fieldIndex) => (
          <Box
            display="flex"
            justifyContent="space-between"
            borderBottom={fields.length && `1px solid #E2E8F0`}
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
                  `body.query_mapping.request_map.relations.${index}.field_match.${fieldIndex}.key`
                )}
              </Typography>
              <marquee>
                <Typography>
                  {form.watch(
                    `body.query_mapping.request_map.relations.${index}.field_match.${fieldIndex}.field_type`
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
                name={`body.query_mapping.request_map.relations.${index}.field_match.${fieldIndex}.value`}
                form={form}
                placeholder={"Value"}
              />
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              pl="5px"
              maxHeight="32px !important"
              borderLeft="1px solid #E2E8F0"
            >
              <HFSelect
                name={`body.query_mapping.request_map.relations.${index}.field_match.${fieldIndex}.type`}
                form={form}
                placeholder={"Type"}
                options={query_types}
                className={styles.query_select}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RelationFields;
