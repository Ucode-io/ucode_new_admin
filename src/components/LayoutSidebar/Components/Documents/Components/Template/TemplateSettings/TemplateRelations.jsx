import { Box, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SidebarBody, SidebarHeader, SidebarTitle } from "../../Sidebar-old";
import TemplateRelationTable from "../../TemplateRelationTable";

const TemplateRelations = ({ setFieldIsLoading }) => {
  const form = useFormContext();

  const {
    fields: tables,
    append,
    remove: removeTable,
  } = useFieldArray({
    control: form.control,
    name: "tables",
    keyName: "key",
  });

  return (
    <Box>
      <SidebarHeader>
        <SidebarTitle>Document relations</SidebarTitle>
      </SidebarHeader>

      <SidebarBody height="calc(100vh - 100px)">
        <Box p={2}>
          <Typography fontSize="16px" fontWeight="500" mb={2} color="#000">
            Input tables
          </Typography>

          <TemplateRelationTable
            form={form}
            setFieldIsLoading={setFieldIsLoading}
            type="input"
            control={form.control}
            tables={tables}
            removeTable={removeTable}
          />
        </Box>

        <Box p={2}>
          <Typography fontSize="16px" fontWeight="500" mb={2} color="#000">
            Output tables
          </Typography>

          <TemplateRelationTable
            setFieldIsLoading={setFieldIsLoading}
            form={form}
            type="output"
            control={form.control}
            tables={tables}
            removeTable={removeTable}
          />
        </Box>
      </SidebarBody>
    </Box>
  );
};

export default TemplateRelations;
