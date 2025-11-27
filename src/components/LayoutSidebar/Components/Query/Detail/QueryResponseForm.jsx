import { Box, Button, Switch, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { useTableByIdQuery } from "../../../../../services/constructorTableService";
import fieldService, {
  useFieldsListQuery,
} from "../../../../../services/fieldService";
import HFAutocomplete from "../../../../FormElements/HFAutocomplete";
import InputWithPopUp from "./InputWithPopUp";
import { useRelationsListQuery } from "../../../../../services/relationService";
import { useMemo, useState } from "react";
import ResponseRelationFields from "./ResponseRelationFields";
import RectangleIconButton from "../../../../Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import Header, { HeaderExtraSide, HeaderLeftSide } from "../../Header";

const QueryResponseForm = ({
  form,
  control,
  tables,
  setSearch,
  allText,
  setAllText,
}) => {
  const [tableId, setTableId] = useState();
  const {
    fields: relationFields,
    append: relationAppend,
    remove: relationRemove,
  } = useFieldArray({
    control,
    name: "body.query_mapping.response_map.relations",
  });

  const { fields } = useFieldArray({
    control,
    name: "body.query_mapping.response_map.field_match",
  });

  const tableIdByWatch = form.watch("body.query_mapping.response_map.table");

  const { isLoading } = useTableByIdQuery({
    id: tableIdByWatch,
    queryParams: {
      enabled: !!tableIdByWatch,
      onSuccess: (res) => {
        form.setValue("body.query_mapping.response_map.table_slug", res.slug);
      },
    },
  });

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: tableId,
    },
    queryParams: {
      enabled: Boolean(tableId),
      onSuccess: (res) => {
        form.setValue(
          "body.query_mapping.response_map.field_match",
          res?.fields?.map((item) => {
            return { key: item.slug, value: "", field_type: item.type };
          })
        );
      },
    },
  });

  const { data: relationsData, isLoading: relationsLoading } =
    useRelationsListQuery({
      params: {
        table_slug: form.watch("body.query_mapping.response_map.table_slug"),
      },
      queryParams: {
        enabled: Boolean(
          form.watch("body.query_mapping.response_map.table_slug")
        ),
      },
    });

  const filteredData = useMemo(() => {
    return relationsData?.relations?.filter(
      (item) =>
        item.type === "Many2One" &&
        item.table_to.slug ===
          form.watch("body.query_mapping.response_map.table_slug")
    );
  }, [relationsData]);

  const tableOptions = useMemo(() => {
    return filteredData?.map((item, index) => ({
      label: item.table_from?.label,
      value: item.table_from.id,
      slug: item.table_from.slug,
    }));
  }, [filteredData]);

  const getRelationField = (val, index) => {
    fieldService
      .getList({
        table_id: val,
      })
      .then((res) => {
        form.setValue(
          `body.query_mapping.response_map.relations.${index}.field_match`,
          res?.fields?.map((item) => {
            return { key: item?.slug, value: "", field_type: item.type };
          })
        );
      });
  };

  return (
    <>
      <Box display="flex" alignItems="flex-start" mt={2} px="16px">
        <Typography
          minWidth="110px"
          mt="5px"
          pr="10px"
          textAlign="end"
          fontWeight="bold"
        >
          Table
        </Typography>
        <Box width="100%">
          <Box>
            <Box mt={2} mb={2}>
              <HFAutocomplete
                name="body.query_mapping.response_map.table"
                control={control}
                placeholder="Type Error id"
                fullWidth
                options={tables}
                onChange={(val) => {
                  setTableId(val);
                }}
                onFieldChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Box>
            <Box
              border={fields?.length && "1px solid #E2E8F0"}
              borderRadius="0.375rem"
              mb={2}
            >
              <Box>
                {fields?.map((item, index) => (
                  <Box
                    borderBottom={fields?.length && "1px solid #E2E8F0"}
                    display="flex"
                    justifyContent="space-between"
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
                          `body.query_mapping.response_map.field_match.${index}.key`
                        )}
                      </Typography>
                      <marquee>
                        <Typography>
                          {form.watch(
                            `body.query_mapping.response_map.field_match.${index}.field_type`
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
                        name={`body.query_mapping.response_map.field_match.${index}.value`}
                        form={form}
                        placeholder={"Value"}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Header color="#000" border="none" borderTop="1px solid #e5e9eb">
        <HeaderLeftSide flex={1}>
          <Typography fontSize={"18px"} fontWeight="700" textAlign="end">
            Relation
          </Typography>
        </HeaderLeftSide>
        <HeaderExtraSide gap="15px">
          <Switch
            checked={form.watch("body.query_mapping.response_map.is_relation")}
            onChange={(e) => {
              form.setValue(
                "body.query_mapping.response_map.is_relation",
                e.target.checked
              );
            }}
          />
        </HeaderExtraSide>
      </Header>
      {form.watch("body.query_mapping.response_map.is_relation") && (
        <Box mt={2} mb={2}>
          {relationFields?.map((item, index) => (
            <>
              <Box display="flex" alignItems="flex-start" px="16px">
                <Typography
                  minWidth="110px"
                  mt="5px"
                  pr="10px"
                  textAlign="end"
                  fontWeight="bold"
                >
                  Relation
                </Typography>
                <Box width="100%">
                  <Box>
                    <Box mt={2} mb={2} display={"flex"} columnGap={"8px"}>
                      <HFAutocomplete
                        name={`body.query_mapping.response_map.relations.${index}.relation_id`}
                        control={control}
                        placeholder="Type Error id"
                        fullWidth
                        options={tableOptions}
                        onChange={(val) => {
                          getRelationField(val, index);
                        }}
                        customChange={(e) => {
                          form.setValue(
                            `body.query_mapping.response_map.relations.${index}.relation_slug`,
                            e.slug
                          );
                        }}
                      />
                      <RectangleIconButton
                        type="delete"
                        color="error"
                        onClick={() => relationRemove(index)}
                      >
                        <Delete color="error" />
                      </RectangleIconButton>
                    </Box>
                    <ResponseRelationFields
                      form={form}
                      control={control}
                      index={index}
                    />
                  </Box>
                </Box>
              </Box>
            </>
          ))}
        </Box>
      )}

      {form.watch("body.query_mapping.response_map.is_relation") && (
        <Box marginLeft={"auto"} px="16px">
          <Button
            fullWidth
            variant="contained"
            onClick={() => relationAppend({})}
          >
            Add relation
          </Button>
        </Box>
      )}
    </>
  );
};

export default QueryResponseForm;
