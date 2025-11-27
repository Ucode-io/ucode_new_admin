import ClearIcon from "@mui/icons-material/Clear";
import { Box, Button, Card, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useReleasesListQuery,
  useSetCurrentReleaseMutation,
} from "../../../../services/releaseService";
import { useDispatch } from "react-redux";
import { companyActions } from "../../../../store/company/company.slice";
import useBooleanState from "../../../../hooks/useBooleanState";
import { store } from "../../../../store";
import styles from "./style.module.scss";
import { format } from "date-fns";
import ColorCircle from "../ColorCircle";
import VersionDetailModal from "./VersionDetailModal";
import { useQueryClient } from "react-query";

const VersionModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [detailModalIsOpen, openDetailModal, closeDetailModal] =
    useBooleanState(false);
  const selectedVersion = store.getState().company.version;
  const projectId = store.getState().company.projectId;

  const { data: releases } = useReleasesListQuery({
    projectId: projectId,
    queryParams: {
      select: (res) => res.releases,
    },
  });

  const { mutate: setCurrentRelease } = useSetCurrentReleaseMutation({});

  const onSelectClick = (id) => {
    const data = {
      project_id: projectId,
      version_id: id,
    };

    setCurrentRelease({
      data,
    });
  };

  const onRowClick = (release) => {
    if (release.is_current) dispatch(companyActions.setVersion(null));
    else {
      dispatch(companyActions.setVersion(release));
      queryClient.refetchQueries(["RELEASES"]);
    }
  };
  return (
    <div>
      <Modal open className="child-position-center">
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Version modal</Typography>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "8px",
              }}
            >
              <Button onClick={openDetailModal} variant="contained">
                Create new
              </Button>
              <ClearIcon
                color="primary"
                onClick={closeModal}
                width="46px"
                style={{
                  cursor: "pointer",
                }}
              />
            </Box>
          </div>

          <Box p={2}>
            {releases?.map((release) => (
              <Box
                key={release.id}
                className={`${styles.row} ${
                  selectedVersion?.id === release.id ? styles.active : ""
                }`}
                cursor="pointer"
                onClick={() => onRowClick(release)}
              >
                <Box>
                  <Box>
                    <Typography className={styles.title}>
                      <span color="primary.main" mr={1}>
                        {release.version}
                      </span>{" "}
                      {release.description}
                    </Typography>
                  </Box>
                  <Typography className={styles.subtitle}>
                    {format(new Date(release.created_at), "dd MMMM, HH:ss")}
                  </Typography>

                  {release.is_current && (
                    <Box className={styles.currentVersion}>
                      <ColorCircle color="#53973b" />
                      <Typography color="#53973b" fontWeight="bold">
                        Current version
                      </Typography>
                    </Box>
                  )}
                </Box>
                {!release.is_current && (
                  <Button
                    onClick={() => onSelectClick(release.id)}
                    variant="contained"
                  >
                    Select as current
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Card>
      </Modal>
      {detailModalIsOpen && (
        <VersionDetailModal closeModal={closeDetailModal} />
      )}
    </div>
  );
};

export default VersionModal;
