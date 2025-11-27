import {useState} from "react";
import {FiFilter} from "react-icons/fi";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {CTableCell, CTableHeadRow} from "../../../../../components/CTable";
import PermissionCheckbox from "./Components/PermissionCheckbox";
import FormCheckbox from "./Components/Checkbox/FormCheckbox";
import useBooleanState from "../../../../../hooks/useBooleanState";
import AutoFilterModal from "./Components/Modals/AutoFilterModal";
import FieldPermissions from "./Components/Modals/FieldPermissionModal";
import ActionPermissionModal from "./Components/Modals/ActionPermissionModal";
import TableViewPermission from "./Components/Modals/TableViewPermission";
import RelationPermissionModal from "./Components/Modals/RelationPermissionModal";
import CustomPermissionModal from "./Components/Modals/CustomPermissionModal";
import {Box, Icon} from "@mui/material";
import {MdDashboardCustomize} from "react-icons/md";
import {BiTable} from "react-icons/bi";
import {
  ActionPermissionIcon,
  FieldsPermissionIcon,
  RelationPermissionIcon,
} from "../../../../../assets/icons/icon";
import {useTranslation} from "react-i18next";
import styles from "../../../style.module.scss";

const TableRow = ({table, tableIndex, control, setValue, watch}) => {
  const [type, setType] = useState("");
  const {i18n} = useTranslation();

  const basePath = `data.tables.${tableIndex}.record_permissions`;
  const [
    fieldPermissionModalIsOpen,
    openFieldPermissionModal,
    closeFieldPermissionModal,
  ] = useBooleanState(false);
  const [autoFiltersModalIsOpen, openAutoFiltersModal, closeAutoFiltersModal] =
    useBooleanState(false);
  const [
    actionPermissionsModalIsOpen,
    openActionPermissionsModal,
    closeOpenActionPermissionsModal,
  ] = useBooleanState(false);
  const [
    tableViewPermissionModalIsOpen,
    openTableViewPermissionModal,
    closeTableViewPermissionModal,
  ] = useBooleanState(false);
  const [
    relationPermissionModalIsOpen,
    openRelationPermissionModal,
    closeRelationPermissionModal,
  ] = useBooleanState(false);
  const [
    customPermissionModalIsOpen,
    openCustomPermissionModal,
    closeCustomPermissionModal,
  ] = useBooleanState(false);

  return (
    <>
      <CTableHeadRow className={styles.head_row}>
        <CTableCell className={styles.sticky_header}>
          {table?.attributes?.[`label_${i18n?.language}`] ??
            table?.attributes?.[`title${i18n?.language}`] ??
            table.label}
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <PermissionCheckbox control={control} name={basePath + ".read"} />
            <RectangleIconButton
              size="small"
              onClick={() => {
                setType("read");
                openAutoFiltersModal();
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <PermissionCheckbox control={control} name={basePath + ".write"} />
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <PermissionCheckbox control={control} name={basePath + ".update"} />
            <RectangleIconButton
              onClick={() => {
                setType("update");
                openAutoFiltersModal();
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <PermissionCheckbox control={control} name={basePath + ".delete"} />
            <RectangleIconButton
              onClick={() => {
                setType("delete");
                openAutoFiltersModal();
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <FormCheckbox control={control} name={basePath + ".is_public"} />
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <RectangleIconButton size="lg" onClick={openFieldPermissionModal}>
              <FieldsPermissionIcon w={"34px"} h={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <RectangleIconButton size="lg" onClick={openActionPermissionsModal}>
              <ActionPermissionIcon w={"34px"} h={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <RectangleIconButton
              size="lg"
              onClick={openRelationPermissionModal}
            >
              <RelationPermissionIcon w={"26px"} h={"26px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <RectangleIconButton
              size="lg"
              onClick={openTableViewPermissionModal}
            >
              <BiTable width={"34px"} height={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{justifyContent: "center", display: "flex"}}>
            <RectangleIconButton size="lg" onClick={openCustomPermissionModal}>
              <MdDashboardCustomize width={"34px"} height={"34px"} />
            </RectangleIconButton>
          </Box>
        </CTableCell>
      </CTableHeadRow>

      {autoFiltersModalIsOpen && (
        <AutoFilterModal
          control={control}
          closeModal={closeAutoFiltersModal}
          tableIndex={tableIndex}
          type={type}
          setValue={setValue}
          watch={watch}
        />
      )}
      {fieldPermissionModalIsOpen && (
        <FieldPermissions
          control={control}
          tableIndex={tableIndex}
          closeModal={closeFieldPermissionModal}
          setValue={setValue}
          watch={watch}
        />
      )}
      {actionPermissionsModalIsOpen && (
        <ActionPermissionModal
          control={control}
          closeModal={closeOpenActionPermissionsModal}
          tableIndex={tableIndex}
          type={type}
        />
      )}
      {tableViewPermissionModalIsOpen && (
        <TableViewPermission
          control={control}
          closeModal={closeTableViewPermissionModal}
          tableIndex={tableIndex}
          type={type}
        />
      )}
      {relationPermissionModalIsOpen && (
        <RelationPermissionModal
          control={control}
          tableIndex={tableIndex}
          closeModal={closeRelationPermissionModal}
        />
      )}
      {customPermissionModalIsOpen && (
        <CustomPermissionModal
          control={control}
          closeModal={closeCustomPermissionModal}
          tableIndex={tableIndex}
          type={type}
          setValue={setValue}
          watch={watch}
        />
      )}
    </>
  );
};

export default TableRow;
