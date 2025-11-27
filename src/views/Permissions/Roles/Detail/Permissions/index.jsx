import {useWatch} from "react-hook-form";
import TableCard from "../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../components/CTable";
import {Box, Card, Checkbox} from "@mui/material";
import {useEffect, useState} from "react";
import TableRow from "./TableRow";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import MenuRow from "./MenuRow";
import CustomPermissionRow from "./CustomPermission";
import styles from "../../../style.module.scss";
import {permissions, recordPermission} from "./mock";
import PermissionInfoModal from "./Components/Modals/PermissionInfoModal";
import {GoInfo} from "react-icons/go";

const Permissions = ({
  control,
  setChangedData,
  changedData,
  setValue,
  watch,
}) => {
  const [checkBoxValues, setCheckBoxValues] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalData, setModalData] = useState(null);

  const closeModal = () => {
    setModalData(null);
  };

  const tables = useWatch({
    control,
    name: "data",
  });

  const allMenu = useWatch({
    control,
    name: "menus",
  });
  const allReadTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.read === "Yes"
  );
  const allWriteTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.write === "Yes"
  );
  const allUpdateTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.update === "Yes"
  );
  const allDeleteTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.delete === "Yes"
  );
  const allPublicTrue = tables?.tables?.every(
    (permission) => permission.record_permissions?.is_public === true
  );

  useEffect(() => {
    const obj = {};
    allMenu?.forEach((item, index) => {
      obj[item.id] = item.permission;
    });
    setCheckBoxValues((prev) => ({...prev, ...obj}));
  }, [allMenu]);

  return (
    <>
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}>
        <div>
          <Card style={{boxShadow: "none"}}>
            <TabList>
              <Tab>Table</Tab>
              <Tab>Menu</Tab>
              <Tab>Global Permission</Tab>
            </TabList>

            <TabPanel>
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell
                          rowSpan={2}
                          w={200}
                          className={styles.sticky_header}>
                          Objects
                        </CTableCell>
                        <CTableCell colSpan={5}>
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent="center"
                            columnGap={"4px"}>
                            Record permissions{" "}
                            <GoInfo
                              size={18}
                              style={{cursor: "pointer"}}
                              onClick={() => setModalData(recordPermission)}
                            />
                          </Box>
                        </CTableCell>
                        {permissions.map((item) => (
                          <CTableCell rowSpan={2}>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              columnGap={"4px"}>
                              {item.title}{" "}
                              <GoInfo
                                size={18}
                                style={{cursor: "pointer"}}
                                onClick={() =>
                                  item?.content && setModalData(item)
                                }
                              />
                            </Box>
                          </CTableCell>
                        ))}
                      </CTableHeadRow>
                      <CTableHeadRow>
                        <CTableCell>
                          Reading
                          <Checkbox
                            checked={allReadTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    read: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Adding
                          <Checkbox
                            checked={allWriteTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    write: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Editing
                          <Checkbox
                            checked={allUpdateTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    update: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Deleting
                          <Checkbox
                            checked={allDeleteTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    delete: e.target.checked ? "Yes" : "No",
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                        <CTableCell>
                          Public
                          <Checkbox
                            checked={allPublicTrue ? true : false}
                            onChange={(e) => {
                              setValue(
                                "data.tables",
                                tables?.tables?.map((el) => ({
                                  ...el,
                                  record_permissions: {
                                    ...el.record_permissions,
                                    is_public: e.target.checked,
                                  },
                                }))
                              );
                            }}
                          />
                        </CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody
                      //   loader={isLoading}
                      columnsCount={8}
                      dataLength={tables?.tables?.length}>
                      {tables?.tables?.map((table, tableIndex) => (
                        <TableRow
                          key={table.id}
                          table={table}
                          tableIndex={tableIndex}
                          control={control}
                          setValue={setValue}
                          watch={watch}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell rowSpan={2} w={200}>
                          Objects
                        </CTableCell>
                        <CTableCell colSpan={5} tex>
                          <Box sx={{justifyContent: "center", display: "flex"}}>
                            Menu permissions
                          </Box>
                        </CTableCell>
                      </CTableHeadRow>
                      <CTableHeadRow>
                        <CTableCell>Read</CTableCell>
                        <CTableCell>Add</CTableCell>
                        <CTableCell>Edit</CTableCell>
                        <CTableCell>Delete</CTableCell>
                        <CTableCell>Settings</CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody columnsCount={6} dataLength={allMenu?.length}>
                      {allMenu?.map((app, appIndex) => (
                        <MenuRow
                          key={app.id}
                          allMenus={allMenu}
                          app={app}
                          changedData={changedData}
                          appIndex={appIndex}
                          control={control}
                          checkBoxValues={checkBoxValues}
                          setCheckBoxValues={setCheckBoxValues}
                          setChangedData={setChangedData}
                          setValue={setValue}
                        />
                      ))}
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py={1}>
                <TableCard withBorder borderRadius="md" type={"withoutPadding"}>
                  <CTable>
                    <CTableHead>
                      <CTableHeadRow>
                        <CTableCell width={"50%"}>Global permission</CTableCell>
                        <CTableCell></CTableCell>
                      </CTableHeadRow>
                    </CTableHead>
                    <CTableBody columnsCount={2} dataLength={5}>
                      <CustomPermissionRow watch={watch} setValue={setValue} />
                    </CTableBody>
                  </CTable>
                </TableCard>
              </Box>
            </TabPanel>
          </Card>
        </div>
      </Tabs>
      {modalData && (
        <PermissionInfoModal modalData={modalData} closeModal={closeModal} />
      )}
    </>
  );
};

export default Permissions;
