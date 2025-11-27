import {
  Box,
  Card,
  Modal,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./template.module.scss";
import { useState } from "react";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  useEnvTemplateListQuery,
  useGlobalMenuTemplateListQuery,
  useGlobalTemplateCreateMutation,
  useProjectTemplateListQuery,
} from "../../services/globalService";
import TemplateTreeView from "./TemplateTreeView";
import { store } from "../../store";
import { showAlert } from "../../store/alert/alert.thunk";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
export const templateId = `${import.meta.env.VITE_TEMPLATE_ID}`;

const TemplateModal = ({ closeModal }) => {
  const [projectId, setProjectId] = useState(null);
  const [envId, setEnvId] = useState(null);
  const [check, setCheck] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleProjectChange = (event) => {
    setProjectId(event);
  };
  const handleEnvChange = (event) => {
    setEnvId(event);
  };

  const handleSelect = (e, itemId) => {
    setCheck(true);
  };

  const { data: projects } = useProjectTemplateListQuery({
    params: {
      company_id: templateId,
    },
  });

  const { data: environments } = useEnvTemplateListQuery({
    params: {
      company_id: templateId,
      project_id: projectId?.project_id,
    },
    queryParams: {
      enabled: !!projectId?.project_id,
    },
  });
  const { data: menuList } = useGlobalMenuTemplateListQuery({
    params: {
      "project-id": projectId?.project_id,
      "environment-id": envId?.id,
      parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
    },
    queryParams: {
      enabled: !!envId?.id,
    },
  });

  const { mutateAsync: createGlobalTemplate, isLoading: createLoading } =
    useGlobalTemplateCreateMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });

  const onSubmit = () => {
    createGlobalTemplate({
      menus: selectedItems,
      from_env_id: envId?.id,
      from_project_id: projectId?.project_id,
      to_env_id: "",
      to_project_id: "",
    });
  };

  return (
    <div>
      <Modal open className={styles.templatemodal}>
        <Card className={styles.menusetting}>
          {createLoading ? (
            <RingLoaderWithWrapper />
          ) : (
            <>
              <div className={styles.header}>
                <Typography variant="h4">Template settings</Typography>
                <ClearIcon
                  color="primary"
                  onClick={closeModal}
                  width="46px"
                  style={{
                    cursor: "pointer",
                  }}
                />
              </div>
              <Box className={styles.block}>
                <Box className={styles.section}>
                  <Box className={styles.card}>
                    <Typography h="4" className={styles.text}>
                      Projects
                    </Typography>
                    <Box className={styles.projectradio}>
                      <RadioGroup value={projectId}>
                        <Box className={styles.projectgroup}>
                          {projects?.projects?.map((item, index) => (
                            <>
                              <FormControlLabel
                                value={item?.projectId}
                                control={<Radio />}
                                label={<h4>{item?.title}</h4>}
                                className={
                                  projectId?.project_id === item?.project_id
                                    ? styles.active
                                    : styles.inactive
                                }
                                onChange={() => handleProjectChange(item)}
                              />
                            </>
                          ))}
                        </Box>
                      </RadioGroup>
                    </Box>
                  </Box>
                  {environments?.environments?.length && (
                    <>
                      <Divider />
                      <Box className={styles.card}>
                        <Typography h="4" className={styles.text}>
                          Envitonments
                        </Typography>
                        <Box className={styles.projectradio}>
                          <RadioGroup value={envId}>
                            <Box className={styles.projectgroup}>
                              {environments?.environments?.map(
                                (item, index) => (
                                  <>
                                    <FormControlLabel
                                      value={item?.project_id}
                                      control={<Radio />}
                                      label={<h4>{item?.name}</h4>}
                                      className={
                                        envId?.id === item?.id
                                          ? styles.active
                                          : styles.inactive
                                      }
                                      onChange={() => handleEnvChange(item)}
                                    />
                                  </>
                                )
                              )}
                            </Box>
                          </RadioGroup>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
                <Box className={styles.sidebarsection}>
                  {menuList?.menus?.length && (
                    <Box className={styles.tree} width={"100%"}>
                      <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        sx={{
                          height: "100%",
                          maxHeight: "480px",
                          flexGrow: 1,
                          display: "flex",
                          justifyContent: "center",
                          overflow: "auto",
                          padding: "10px",
                        }}
                        onNodeSelect={handleSelect}
                      >
                        <TreeItem
                          nodeId={"c57eedc3-a954-4262-a0af-376c65b5a284"}
                          label={"Root"}
                          sx={{
                            "& .MuiTreeItem-content": {
                              background: "none !important",
                              color: "#000",
                              padding: "10px",
                            },
                            "& .MuiTreeItem-label": {
                              fontSize: "14px !important",
                              fontWeight: "600 !important",
                            },
                          }}
                        >
                          {menuList?.menus?.map((item) => (
                            <TemplateTreeView
                              element={item}
                              setCheck={setCheck}
                              check={check}
                              projectId={projectId}
                              envId={envId}
                              setSelectedItems={setSelectedItems}
                              level={1}
                            />
                          ))}
                        </TreeItem>
                      </TreeView>
                    </Box>
                  )}
                </Box>
              </Box>
              <Divider />
              <div className={styles.footer}>
                <Button variant="contained" color="primary" onClick={onSubmit}>
                  Apply
                </Button>
              </div>
            </>
          )}
        </Card>
      </Modal>
    </div>
  );
};

export default TemplateModal;
