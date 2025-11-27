import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Checkbox, Modal, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import TableCard from "../../../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../../../components/CTable";
import FormCheckbox from "../Checkbox/FormCheckbox";

const FieldPermissions = ({
  closeModal,
  control,
  tableIndex,
  setValue,
  watch,
}) => {
  const basePath = `data.tables.${tableIndex}.field_permissions`;

  const { fields } = useFieldArray({
    control,
    name: basePath,
  });

  const updateView = (val) => {
    const computedValue = fields?.map((el) => ({
      ...el,
      view_permission: val,
    }));
    setValue(basePath, computedValue);
  };
  const updateEdit = (val) => {
    const computedValue = fields?.map((el) => ({
      ...el,
      edit_permission: val,
    }));
    setValue(basePath, computedValue);
  };

  const allViewTrue = fields?.every(
    (permission) => permission.view_permission === true
  );
  const allEditTrue = fields?.every(
    (permission) => permission.edit_permission === true
  );

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Field permissions</Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box>
            <TableCard withBorder borderRadius="md">
              <CTable
                tableStyle={{
                  height: "auto",
                }}
              >
                <CTableHead>
                  <CTableHeadRow>
                    <CTableCell w={2}>No</CTableCell>
                    <CTableCell>Field name</CTableCell>
                    <CTableCell>
                      View permission
                      <Checkbox
                        checked={allViewTrue ? true : false}
                        onChange={(e) => {
                          updateView(e.target.checked);
                        }}
                      />
                    </CTableCell>
                    <CTableCell>
                      Edit permission
                      <Checkbox
                        checked={allEditTrue ? true : false}
                        onChange={(e) => {
                          updateEdit(e.target.checked);
                        }}
                      />
                    </CTableCell>
                  </CTableHeadRow>
                </CTableHead>
                <CTableBody columnsCount={4} dataLength={fields?.length}>
                  {fields?.map((field, fieldIndex) => (
                    <CTableHeadRow key={field.id}>
                      <CTableCell>{fieldIndex + 1}</CTableCell>
                      <CTableCell>{field.label}</CTableCell>
                      <CTableCell>
                        <Box sx={{ justifyContent: "center", display: "flex" }}>
                          <FormCheckbox
                            name={`${basePath}.${fieldIndex}.view_permission`}
                            control={control}
                          />
                        </Box>
                      </CTableCell>
                      <CTableCell>
                        <Box sx={{ justifyContent: "center", display: "flex" }}>
                          <FormCheckbox
                            name={`${basePath}.${fieldIndex}.edit_permission`}
                            control={control}
                          />
                        </Box>
                      </CTableCell>
                    </CTableHeadRow>
                  ))}
                </CTableBody>
              </CTable>
            </TableCard>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default FieldPermissions;
