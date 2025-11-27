import {Box, Card} from "@mui/material";
import Header from "../../components/Header";
import {useParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {useState} from "react";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import {useForm} from "react-hook-form";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import {useQuery} from "react-query";
import RolePage from "./Roles";
import FormCard from "../../components/FormCard";
import ConnectionPage from "./Connections";
import styles from "./style.module.scss";
import connectionServiceV2 from "../../services/auth/connectionService";

const PermissionDetail = () => {
  const {clientId} = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const {control, reset} = useForm();
  const [connections, setConnections] = useState([]);

  const {isLoading} = useQuery(
    ["GET_CLIENT_TYPE_BY_ID", clientId],
    () => {
      return clientTypeServiceV2.getById(clientId);
    },
    {
      enabled: !!clientId,
      onSuccess: (res) => {
        setConnections([res?.data?.response]);
        reset(res.data.response);
      },
    }
  );

  return (
    <Box className={styles.permission}>
      <Header title="Matrix details" backButtonLink={-1} />
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
        className={styles.tabs}>
        <Card style={{paddingBottom: "0px", borderRadius: "0"}}>
          <TabList>
            <Tab>Role</Tab>
            <Tab>Connection</Tab>
          </TabList>

          <TabPanel style={{marginTop: "8px"}}>
            <div style={{padding: "10px 10px 0 10px", maxWidth: "30%"}}>
              <FRow label="Name">
                <HFTextField control={control} name="name" fullWidth />
              </FRow>
            </div>
            <RolePage />
          </TabPanel>
          <TabPanel>
            <ConnectionPage connections={connections} />
          </TabPanel>
        </Card>
      </Tabs>
    </Box>
  );
};

export default PermissionDetail;
