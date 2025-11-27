import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import TableCard from "../../../../components/TableCard";
import TableRowButton from "../../../../components/TableRowButton";
import Header from "../../../../components/Header";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { EditIcon } from "../../../../assets/icons/icon";
import { Delete } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import FieldDrawer from "./DetailPage";

const FieldsConfiguration = ({ control }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState();

  const closeDrawer = () => setDrawerIsOpen(false);

  const openCreateDrawer = () => {
    setSelectedField(null);
    setDrawerIsOpen(true);
  };

  const openEditDrawer = (field) => {
    setSelectedField(field);
    setDrawerIsOpen(true);
  };

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  });

  const deleteClickHandler = (index) => {
    remove(index);
  };

  const createField = (field) => {
    append(field);
  };

  const updateField = (field) => {
    const index = fields.findIndex((el) => el.id === field.id);
    update(index, field);
  };

  return (
    <Box>
      <Header
        title="Fields"
        extra={
          <>
            <Button variant="contained" onClick={openCreateDrawer}>
              Create field
            </Button>
          </>
        }
      />

      <TableCard>
        <CTable removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Field SLUG</CTableCell>
            <CTableCell>Field type</CTableCell>
            <CTableCell width={60}></CTableCell>
            {/* <CTableCell w={2}></CTableCell>
            <CTableCell width={60}></CTableCell> */}
          </CTableHead>
          <CTableBody
            // loader={isLoading}
            columnsCount={5}
            dataLength={fields?.length}
          >
            {fields?.map((field, index) => (
              <CTableRow
                key={field.id}
                onClick={() => {
                  openEditDrawer(field);
                }}
              >
                <CTableCell textAlign="center">{index + 1}</CTableCell>
                <CTableCell>{field.slug}</CTableCell>
                <CTableCell>{field.type}</CTableCell>
                <CTableCell>
                  {/* <RectangleIconButton
                    variant="outline"
                    onClick={() => openEditDrawer(field)}
                  >
                    <EditIcon />
                  </RectangleIconButton> */}
                  <RectangleIconButton
                    variant="outline"
                    color="error"
                    onClick={() => deleteClickHandler(index)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
      <FieldDrawer
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        closeDrawer={closeDrawer}
        selectedField={selectedField}
        createField={createField}
        updateField={updateField}
      />
    </Box>
  );
};

export default FieldsConfiguration;
