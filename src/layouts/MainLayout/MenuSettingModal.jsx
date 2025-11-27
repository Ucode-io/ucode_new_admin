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
import styles from "./style.module.scss";
import {useEffect, useState} from "react";
import {LeftArrow, ModernSidebar, UdevsLogo} from "../../assets/icons/icon";
import {Search} from "@mui/icons-material";
import {Sidebar, sidebarElements} from "./mock/sidebarElements";
import IconGenerator from "../../components/IconPicker/IconGenerator";
import MenuSettingTheme from "../../components/MenuSetting/MenuSettingTheme";
import MenuSettingForm from "../../components/MenuSetting/MenuSettingForm";
import {useForm} from "react-hook-form";
import {
  useMenuSettingGetByIdQuery,
  useMenuSettingUpdateMutation,
} from "../../services/menuSettingService";
import {useQueryClient} from "react-query";
import {store} from "../../store";

const MenuSettingModal = ({closeModal}) => {
  const [modalType, setModalType] = useState("SETTING");
  const [check, setCheck] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const queryClient = useQueryClient();
  const [formType, setFormType] = useState("");

  const selectedMenuTemplate = store.getState().menu.menuTemplate;
  const {data: menuTemplate} = useMenuSettingGetByIdQuery({
    params: {
      template_id:
        selectedMenuTemplate?.id || "f922bb4c-3c4e-40d4-95d5-c30b7d8280e3",
    },
    menuId: "adea69cd-9968-4ad0-8e43-327f6600abfd",
  });
  const [type, setType] = useState(menuTemplate?.icon_style || "");
  const [size, setSize] = useState(menuTemplate?.icon_size || "");

  const {control, reset, handleSubmit, setValue} = useForm({
    defaultValues: {},
  });

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const {mutate: create, isLoading: createLoading} =
    useMenuSettingUpdateMutation({
      onSuccess: () => {
        //   setModalType("CUSTOMIZE");
        closeModal();
        queryClient.refetchQueries(
          ["MENU_SETTING_GET_BY_ID"],
          "adea69cd-9968-4ad0-8e43-327f6600abfd"
        );
      },
    });

  const submitHandler = () => {
    create({
      icon_size: size,
      icon_style: type,
      menu_template_id: selectedTemplate?.id,
      id: "adea69cd-9968-4ad0-8e43-327f6600abfd",
    });
  };

  useEffect(() => {
    if (menuTemplate) {
      setSelectedTemplate(menuTemplate?.menu_template);
    }
  }, [menuTemplate]);

  return (
    <div>
      <Modal open className={styles.modal}>
        <Card className={styles.menusetting}>
          {modalType === "SETTING" && (
            <>
              <div className={styles.header}>
                <Typography variant="h4">Layout settings</Typography>
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
                      Style
                    </Typography>
                    <Box className={styles.radio}>
                      <RadioGroup
                        name="type"
                        value={type}
                        onChange={handleTypeChange}>
                        <Box className={styles.group}>
                          <FormControlLabel
                            value="SIMPLE"
                            control={<Radio />}
                            label={
                              <>
                                <h4>Simple</h4>
                                <p>Default navigation</p>
                              </>
                            }
                            className={
                              type === "SIMPLE"
                                ? styles.active
                                : styles.inactive
                            }
                          />
                          <FormControlLabel
                            value="MODERN"
                            control={<Radio />}
                            label={
                              <>
                                <h4>Modern</h4>
                                <p>Only icons</p>
                              </>
                            }
                            className={
                              type === "MODERN"
                                ? styles.active
                                : styles.inactive
                            }
                          />
                        </Box>
                      </RadioGroup>
                    </Box>
                  </Box>
                  <Divider />
                  <Box className={styles.card}>
                    <Typography h="4" className={styles.text}>
                      Size
                    </Typography>
                    <Box className={styles.size}>
                      <RadioGroup
                        name="sizes"
                        value={size}
                        onChange={handleSizeChange}>
                        <Box className={styles.group}>
                          <FormControlLabel
                            value="SMALL"
                            control={<Radio />}
                            label={<p>Small</p>}
                            className={
                              size === "SMALL" ? styles.active : styles.inactive
                            }
                          />
                          <FormControlLabel
                            value="MEDIUM"
                            control={<Radio />}
                            label={<p>Medium</p>}
                            className={
                              size === "MEDIUM"
                                ? styles.active
                                : styles.inactive
                            }
                          />
                          <FormControlLabel
                            value="BIG"
                            control={<Radio />}
                            label={<p>Big</p>}
                            className={
                              size === "BIG" ? styles.active : styles.inactive
                            }
                          />
                        </Box>
                      </RadioGroup>
                    </Box>
                  </Box>
                  <Divider />
                  <Box className={styles.card}>
                    <Typography h="4" className={styles.text}>
                      Color themes
                    </Typography>
                    <Box className={styles.theme}>
                      {/* <Box className={styles.block}>
                        {colors.map((item) => (
                          <span
                            className={styles.color}
                            style={{ background: item.color }}
                          ></span>
                        ))}
                      </Box> */}
                      <Typography variant="h5" color={selectedTemplate?.text}>
                        {selectedTemplate?.title}
                      </Typography>
                      <Button
                        style={{
                          background: "#2D6CE51A",
                        }}
                        onClick={() => {
                          setModalType("CUSTOMIZE");
                        }}>
                        Customize
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box className={styles.sidebarsection}>
                  <Box className={styles.sidebar}>
                    {type === "MODERN" ? (
                      <div
                        className={styles.menu}
                        style={{
                          background: selectedTemplate?.background,
                        }}>
                        <UdevsLogo fill={"#007AFF"} />
                        <Search className={styles.searchicon} />
                        {Sidebar.map((element) => (
                          <div
                            className={styles.element}
                            style={{
                              background: element.active
                                ? selectedTemplate?.active_background
                                : selectedTemplate?.background,
                            }}>
                            <IconGenerator
                              icon={element.icon}
                              size={
                                size === "SMALL"
                                  ? 10
                                  : size === "MEDIUM"
                                    ? 13
                                    : 17
                              }
                              style={{
                                color: element.active
                                  ? selectedTemplate?.active_text
                                  : selectedTemplate?.text,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={styles.modernmenu}
                        style={{
                          background: selectedTemplate?.background,
                        }}>
                        <UdevsLogo className={styles.logo} fill={"#007AFF"} />
                        <ModernSidebar />
                        {Sidebar.map((element) => (
                          <div
                            className={styles.element}
                            style={{
                              background: element.active
                                ? selectedTemplate?.active_background
                                : selectedTemplate?.background,
                            }}>
                            <IconGenerator
                              icon={element.icon}
                              style={{
                                color: element.active
                                  ? selectedTemplate?.active_text
                                  : selectedTemplate?.text,
                              }}
                            />
                            <p
                              style={{
                                color: element.active
                                  ? selectedTemplate?.active_text
                                  : selectedTemplate?.text,
                              }}>
                              {element.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={styles.submenu}
                      style={{
                        background: selectedTemplate?.background,
                      }}>
                      <div className={styles.submenuheader}>
                        <p style={{color: selectedTemplate?.text}}>
                          Mobile apps
                        </p>
                        <LeftArrow fill={selectedTemplate?.text} />
                      </div>
                      <div className={styles.search}>
                        <Search />
                        <p>Search</p>
                      </div>
                      {sidebarElements.map((element) => (
                        <div
                          className={styles.element}
                          style={{
                            background: element.active
                              ? selectedTemplate?.active_background
                              : selectedTemplate?.background,
                          }}>
                          <IconGenerator
                            icon={element.icon}
                            style={{
                              color: element.active
                                ? selectedTemplate?.active_text
                                : selectedTemplate?.text,
                            }}
                          />
                          <p
                            style={{
                              color: element.active
                                ? selectedTemplate?.active_text
                                : selectedTemplate?.text,
                            }}>
                            {element.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <div className={styles.header}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}>
                  Apply
                </Button>
              </div>
            </>
          )}
          {modalType === "CUSTOMIZE" && (
            <MenuSettingTheme
              setModalType={setModalType}
              setSelectedTemplate={setSelectedTemplate}
              check={check}
              setCheck={setCheck}
              setFormType={setFormType}
            />
          )}
          {modalType === "MENUFORM" && (
            <MenuSettingForm
              setModalType={setModalType}
              setCheck={setCheck}
              formType={formType}
            />
          )}
        </Card>
      </Modal>
    </div>
  );
};

export default MenuSettingModal;
