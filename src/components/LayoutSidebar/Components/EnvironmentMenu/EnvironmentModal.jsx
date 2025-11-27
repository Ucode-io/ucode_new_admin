import {Box, Button, CircularProgress, Modal} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useEnvironmentListQuery} from "../../../../services/environmentService";
import {store} from "../../../../store";
import httpsRequestV2 from "../../../../utils/httpsRequestV2";
import EnvironmentsTable from "./EnvironmentsTable";
import HistoriesTable from "./HistoriesTable";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {useNavigate} from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "0",
  boxShadow: 24,
  borderRadius: "8px",
  outline: "none",
};

export default function EnvironmentModal({open, handleClose}) {
  const company = store.getState().company;
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedMigrate, setSelectedMigrate] = useState(true);
  const [versions, setVersions] = useState([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [version, setVersion] = useState();
  const companyStore = store.getState().company;
  const environmentId = companyStore.environmentId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateVersions = (ids) => {
    const selectedVersionsIds = selectedVersions.map((version) => version.id);

    httpsRequestV2
      .put(`/version/history/${selectedEnvironment}`, {
        env_id: environmentId,
        ids: ids,
        project_id: company.projectId,
      })
      .then((res) => {
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
      });
  };

  const updateMigrate = () => {
    httpsRequestV2
      .post("/version/migrate", {
        histories: selectedVersions,
      })
      .then((res) => {
        updateVersions(res?.ids);
        navigate("/reloadRelations", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      });
  };
  const updateDown = () => {
    httpsRequestV2
      .post(
        `/version/history/migrate/${selectedMigrate.toLowerCase()}/${selectedEnvironment}`,
        {
          data: selectedVersions,
        }
      )
      .then((res) => {
        updateVersions(res?.ids);
        navigate("/reloadRelations", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      });
  };

  const {data: {environments} = [], isLoading: environmentLoading} =
    useEnvironmentListQuery({
      params: {
        project_id: company.projectId,
      },
      onSuccess: (data) => {
        return data;
      },
    });

  useEffect(() => {
    if (environments && environments.length > 0) {
      const id = environments.find((env) => env.name === "Production")?.id;
      setSelectedEnvironment(id);
      if (id) {
        setVersionLoading(true);
        httpsRequestV2
          .get(`/version/history/${id}?type=UP&limit=100&offset=0`, {})
          .then((res) => {
            setVersions(res.histories);
          })
          .finally(() => {
            setVersionLoading(false);
          });
      } else {
        console.error("Production environment not found.");
      }
    } else {
      console.error("Environments list is empty or undefined.");
    }
  }, [environments]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Box>
          {environmentLoading || versionLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                height: "100%",
                width: "100%",
              }}>
              <CircularProgress />
            </Box>
          ) : selectedMigrate ? (
            <HistoriesTable
              histories={versions}
              setSelectedEnvironment={setSelectedEnvironment}
              selectedVersions={selectedVersions}
              setSelectedMigrate={setSelectedMigrate}
              setSelectedVersions={setSelectedVersions}
              handleClose={handleClose}
              selectedEnvironment={selectedEnvironment}
              setVersion={setVersion}
            />
          ) : (
            <EnvironmentsTable
              setSelectedEnvironment={setSelectedEnvironment}
              environments={environments}
              selectedEnvironment={selectedEnvironment}
              handleClose={handleClose}
              setSelectedMigrate={setSelectedMigrate}
              selectedMigrate={selectedMigrate}
              company={company}
              version={version}
            />
          )}
        </Box>

        {selectedMigrate && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "10px 15px",
              borderTop: "1px solid #e5e9eb",
            }}>
            {/* <Button
              variant="outlined"
              color="error"
              onClick={() => setSelectedVersions([])}>
              Cancel
            </Button> */}

            {selectedVersions?.length ? (
              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  selectedMigrate === "miggrate"
                    ? updateMigrate()
                    : updateDown();
                }}>
                Migrate
              </Button>
            ) : null}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
