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
import Header from "../../../../components/Header";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import RelationDrawer from "./DetailPage";

const RelationsConfiguration = ({ control }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState();

  const closeDrawer = () => setDrawerIsOpen(false);

  const openCreateDrawer = () => {
    setSelectedRelation(null);
    setDrawerIsOpen(true);
  };

  const openEditDrawer = (field) => {
    setSelectedRelation(field);
    setDrawerIsOpen(true);
  };

  const {
    fields: relations,
    remove,
    append,
    update,
  } = useFieldArray({
    control,
    name: "relations",
    keyName: "key",
  });

  const deleteClickHandler = (index) => {
    remove(index);
  };

  const createRelation = (field) => {
    append(field);
  };

  const updateRelation = (field) => {
    const index = relations.findIndex((el) => el.id === field.id);
    update(index, field);
  };

  return (
    <Box>
      <Header
        title="Relation"
        extra={
          <>
            <Button variant="contained" onClick={openCreateDrawer}>
              Create relation
            </Button>
          </>
        }
      />

      <TableCard>
        <CTable removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Table from</CTableCell>
            <CTableCell>Table to</CTableCell>
            <CTableCell>Relation type</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            // loader={isLoading}
            columnsCount={5}
            dataLength={relations?.length}
          >
            {relations?.map((relation, index) => (
              <CTableRow
                key={relation.id}
                onClick={() => openEditDrawer(relation)}
              >
                <CTableCell textAlign="center">{index + 1}</CTableCell>
                <CTableCell>{relation.table_from}</CTableCell>
                <CTableCell>{relation.table_to}</CTableCell>
                <CTableCell>{relation.type}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    variant="outline"
                    colorScheme="red"
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
      <RelationDrawer
        open={drawerIsOpen}
        initialValues={drawerIsOpen}
        formIsVisible={drawerIsOpen}
        closeDrawer={closeDrawer}
        selectedRelation={selectedRelation}
        updateRelation={updateRelation}
        createRelation={createRelation}
      />
    </Box>
  );
};

export default RelationsConfiguration;
