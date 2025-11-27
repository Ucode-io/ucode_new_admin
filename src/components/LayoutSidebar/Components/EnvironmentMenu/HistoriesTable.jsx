import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {Box, Button, TableCell, Typography} from "@mui/material";
import HistoryRow from "./HistoryRow";
import styles from "./styles.module.scss";
import TableCard from "../../../TableCard";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeadCell,
  CTableHeadRow,
} from "../../../CTable";
import ClearIcon from "@mui/icons-material/Clear";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ReleasesHistory from "./ReleasesHistory";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import FRow from "../../../FormElements/FRow";
import HFTextField from "../../../FormElements/HFTextField";
import {LoadingButton} from "@mui/lab";
import versionService from "../../../../services/versionService";
import {useSelector} from "react-redux";

export default function HistoriesTable({
  histories,
  setSelectedEnvironment,
  selectedVersions,
  setSelectedVersions,
  setSelectedMigrate,
  handleClose,
  selectedEnvironment,
  setVersion,
}) {
  const [isForm, setIsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const access_type = useSelector((state) => state.auth.access_type?.payload);

  const {control, handleSubmit} = useForm();

  const handleSelectVersion = (e, index) => {
    if (e.target.checked) {
      const versionsUntilIndex = histories.slice(0, index + 1);
      setSelectedVersions(versionsUntilIndex);
    } else {
      const versionsUntilIndex = histories.slice(0, index);
      setSelectedVersions(versionsUntilIndex);
    }
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
    };
    setIsLoading(true);
    versionService
      .create(data)
      .then(() => {
        setIsForm(false);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {});
  };

  return (
    <div style={{height: 400, width: "100%", overflow: "auto"}}>
      <div className={styles.header}>
        <Box sx={{display: "flex", alignItems: "center"}}>
          {/* <Button
            className={styles.button}
            onClick={() => setSelectedMigrate(null)}>
            <ArrowBackRoundedIcon />
          </Button> */}
          <Typography variant="h4">History</Typography>
        </Box>
        <ClearIcon
          color="primary"
          onClick={handleClose}
          width="46px"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <Box sx={{position: "sticky", top: 0}}></Box>

      {isForm ? (
        <>
          <Box sx={{padding: "10px 15px"}}>
            <FRow label="Name">
              <HFTextField name="name" control={control} />
            </FRow>
            <FRow label="Description">
              <HFTextField
                name="description"
                inputHeight={"120px"}
                control={control}
              />
            </FRow>

            <Box sx={{width: "100%", textAlign: "right"}}>
              <LoadingButton
                onClick={handleSubmit(onSubmit)}
                sx={{margin: "0 10px"}}
                variant="contained"
                type="submit"
                loading={isLoading}>
                Create
              </LoadingButton>
              <Button
                onClick={() => setIsForm(false)}
                variant="outlined"
                color="error"
                type="submit">
                Cancel
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}>
            <TabList style={{paddingLeft: "15px", top: "40px"}}>
              <Tab>Releases</Tab>
              <Tab>History</Tab>
              {tabIndex === 0 && access_type === "public" && (
                <Box sx={{position: "absolute", right: "20px", top: "12px"}}>
                  <Button
                    onClick={() => {
                      setIsForm(true);
                    }}
                    variant="contained">
                    Create version
                  </Button>
                </Box>
              )}
            </TabList>

            <TabPanel>
              <ReleasesHistory
                setIsForm={setIsForm}
                selectedEnvironment={selectedEnvironment}
                setSelectedMigrate={setSelectedMigrate}
                setVersion={setVersion}
              />
            </TabPanel>

            <TabPanel>
              <TableCard
                cardStyles={{height: "290px", overflow: "auto"}}
                type={"withoutPadding"}
                withBorder
                borderRadius="md">
                <CTable
                  removableHeight={0}
                  tableStyle={{
                    height: "auto",
                  }}>
                  <CTableHead>
                    <CTableHeadRow>
                      <CTableHeadCell width={40}>Action</CTableHeadCell>
                      <CTableHeadCell width={160}>Action Type</CTableHeadCell>
                      <CTableHeadCell>Action Source</CTableHeadCell>
                      <CTableHeadCell width={200}>Version</CTableHeadCell>
                      <CTableHeadCell width={130}>Action</CTableHeadCell>
                    </CTableHeadRow>
                  </CTableHead>
                  <CTableBody
                    style={{
                      overflow: "auto",
                    }}
                    dataLength={histories?.length}>
                    {histories?.map((history, index) => (
                      <HistoryRow
                        history={history}
                        index={index}
                        handleSelectVersion={handleSelectVersion}
                        selectedVersions={selectedVersions}
                      />
                    ))}
                  </CTableBody>
                </CTable>
              </TableCard>
            </TabPanel>
          </Tabs>
        </>
      )}
    </div>
  );
}
