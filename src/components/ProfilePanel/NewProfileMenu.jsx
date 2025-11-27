import ApartmentIcon from "@mui/icons-material/Apartment";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Button, Divider, Menu, MenuItem, Tooltip} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {PlusIcon} from "../../assets/icons/icon";
import CompanyModal from "../../layouts/MainLayout/CompanyModal";
import authService from "../../services/auth/authService";
import {
  useCompanyListQuery,
  useEnvironmentListQuery,
  useProjectListQuery,
} from "../../services/companyService";
import {store} from "../../store";
import {authActions} from "../../store/auth/auth.slice";
import {companyActions} from "../../store/company/company.slice";
import UserAvatar from "../UserAvatar";
import EnvironmentsList from "./EnvironmentList/EnvironmentsList";
import ProfileItem from "./ProfileItem";
import ProjectList from "./ProjectList/ProjectsList";
import ResourceList from "./ResourceList";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import styles from "./newprofile.module.scss";
import {useQueryClient} from "react-query";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import useBooleanState from "../../hooks/useBooleanState";
import VersionModal from "./Components/VersionModal/VersionModal";
import LayersIcon from "@mui/icons-material/Layers";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {languagesActions} from "../../store/globalLanguages/globalLanguages.slice";
import {useTranslation} from "react-i18next";
import {showAlert} from "../../store/alert/alert.thunk";

const NewProfilePanel = ({
  handleMenuSettingModalOpen,
  setSidebarAnchor,
  sidebarAnchorEl,
  handleTemplateModalOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {appId} = useParams();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const auth = store.getState().auth;
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [projectListEl, setProjectListEl] = useState(null);
  const [environmentListEl, setEnvironmentListEl] = useState(null);
  const [companyModal, setCompanyModal] = useState(null);
  const [selected, setSelected] = useState(false);
  const menuVisible = Boolean(anchorProfileEl || sidebarAnchorEl);
  const projectVisible = Boolean(projectListEl);
  const environmentVisible = Boolean(environmentListEl);
  const location = useLocation();
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const settings = location.pathname.includes("settings");
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [versionModalIsOpen, openVersionModal, closeVersionModal] =
    useBooleanState(false);
  const defaultLanguage = useSelector(
    (state) => state.languages.defaultLanguage
  );
  const params = {
    refresh_token: auth?.refreshToken,
    env_id: company.environmentId,
    project_id: company.projectId,
    for_env: true,
  };

  const permissions = useSelector((state) => state.auth.globalPermissions);
  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);

  const projectId = useSelector((state) => state.company.projectId);
  const {data: projectInfo = []} = useProjectGetByIdQuery({projectId});

  const handleEnvNavigate = () => {
    navigate(`/main/${appId}/environments`);
  };
  const handleCompanyNavigate = () => {
    navigate(`/main/${appId}/company`);
  };
  const handleProjectNavigate = () => {
    navigate(`/main/${appId}/projects`);
  };

  const closeMenu = (e) => {
    e.stopPropagation();
    setSidebarAnchor(false);
    setProfileAnchorEl(null);
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleCompanySelect = (item, e) => {
    setSelected(true);
    dispatch(companyActions.setCompanyItem(item));
    dispatch(companyActions.setCompanyId(item.id));
    setProfileAnchorEl(e.currentTarget);
  };

  const openProjectList = (event) => {
    setProjectListEl(event.currentTarget);
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProjectList = () => {
    setProjectListEl(null);
  };

  const openEnvironmentList = (event) => {
    setEnvironmentListEl(event.currentTarget);
    setProfileAnchorEl(event.currentTarget);
  };

  const closeEnvironmentList = () => {
    setEnvironmentListEl(null);
  };

  const closeCompanyModal = () => {
    setCompanyModal(null);
  };

  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    dispatch(companyActions.setCompanies([]));
    closeMenu();
  };

  const refreshTokenFunc = (env_id) => {
    authService
      .updateToken({...params, env_id: env_id}, {...params})
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        window.location.reload();
        dispatch(companyActions.setEnvironmentId(env_id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(
      companyActions.setCompanyItem(
        company.companies.find((item) => item.id === company.companyId)
      )
    );
    dispatch(
      companyActions.setEnvironmentItem(
        company.environments?.find((item) => item.id === company.environmentId)
      )
    );
    dispatch(
      companyActions.setProjectItem(
        company.projects?.find((item) => item.project_id === company.projectId)
      )
    );
  }, [company.companies, company.environments]);

  const {isLoading} = useCompanyListQuery({
    params: {
      owner_id: auth.userId,
    },
    queryParams: {
      enabled: Boolean(auth.userId) && menuVisible,
      onSuccess: (res) => {
        dispatch(companyActions.setCompanies(res.companies));
      },
    },
  });

  const {isLoading: projectLoading} = useProjectListQuery({
    params: {
      company_id: company.companyId,
    },
    queryParams: {
      enabled: Boolean(company.companyId) && menuVisible,
      onSuccess: (res) => {
        dispatch(companyActions.setProjects(res.projects));
        if (selected) {
          dispatch(companyActions.setProjectItem(res.projects[0]));
          dispatch(companyActions.setProjectId(res.projects[0].project_id));
        }
      },
    },
  });

  const {isLoading: environmentLoading} = useEnvironmentListQuery({
    params: {
      project_id: company.projectId,
    },
    queryParams: {
      enabled: Boolean(company.projectId) && menuVisible,
      onSuccess: (res) => {
        if (selected) {
          dispatch(companyActions.setEnvironmentItem(res.environments[0]));
          dispatch(companyActions.setEnvironmentId(res.environments[0].id));
        }
        dispatch(companyActions.setEnvironments(res.environments));
        setSelected(false);
      },
    },
  });

  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const getDefaultLanguage = () => {
    const isLanguageExist = languages?.some(
      (item) => defaultLanguage === item?.slug
    );

    if (languages?.length) {
      if (languages?.length === 1) {
        dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
        i18n.changeLanguage(languages?.[0]?.slug);
      } else if (languages?.length > 1) {
        if (!defaultLanguage) {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        } else if (defaultLanguage && isLanguageExist) {
          dispatch(languagesActions.setDefaultLanguage(defaultLanguage));
          i18n.changeLanguage(defaultLanguage);
        } else {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        }
      }
    }
  };

  useEffect(() => {
    if (projectId) {
      dispatch(languagesActions.setLanguagesItems(languages));
    }
  }, [languages, projectId, dispatch]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
    dispatch(showAlert(`Language changed to ${lang} successfully`, "success"));
  };

  useEffect(() => {
    getDefaultLanguage();
  }, [languages?.length]);

  const handleClickLanguages = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onClose = (e) => {
    closeMenu(e);
    if (selected) refreshTokenFunc();
  };

  return (
    <div>
      <UserAvatar
        user={{
          name: "User",
          photo_url: "https://image.emojisky.com/71/8041071-middle.png",
        }}
        onClick={openMenu}
      />
      <Menu
        id="lock-menu"
        anchorEl={anchorProfileEl || sidebarAnchorEl}
        open={menuVisible}
        onClose={(e) => {
          onClose(e);
        }}
        classes={{
          list: styles.profilemenu,
          paper: settings ? styles.settingspaper : styles.profilepaper,
        }}>
        <Box className={styles.leftblock}>
          <div className={styles.block}>
            <div className={styles.companyblock}>
              {company.companies?.map((item) => (
                <ProfileItem
                  children={
                    <Tooltip title={item?.name}>
                      <p
                        className={
                          item.id === company.companyId
                            ? styles.avatarborder
                            : styles.avatar
                        }
                        onClick={(e) => {
                          handleCompanySelect(item, e);
                          queryClient.refetchQueries(["PROJECT"], item.id);
                        }}>
                        {item?.name?.charAt(0).toUpperCase()}
                      </p>
                    </Tooltip>
                  }
                  key={item.id}
                  type="company"
                  className={styles.company}
                />
              ))}

              {roleInfo === "DEFAULT ADMIN" && (
                <p
                  className={styles.createbutton}
                  onClick={() => {
                    setCompanyModal(true);
                  }}>
                  <PlusIcon fill={"#007AFF"} />
                </p>
              )}
            </div>
          </div>
        </Box>
        <Box className={styles.centerblock}>
          <div className={styles.block}>
            <ProfileItem
              children={
                <>
                  <ApartmentIcon
                    style={{
                      color: "#747474",
                    }}
                  />
                  {company.companyItem?.name}
                </>
              }
              onClick={() => {
                permissions?.settings_button && handleCompanyNavigate();
              }}
            />
          </div>
          <Divider />
          <Box className={styles.block}>
            {permissions?.project_button && (
              <ProfileItem
                children={
                  <ResourceList
                    item={company.projectItem?.title || "No project"}
                    className={styles.projectavatar}
                    colorItem={company.projectItem}
                    icon={
                      <LayersIcon
                        style={{
                          color: "#747474",
                        }}
                      />
                    }
                  />
                }
                onClick={openProjectList}
              />
            )}
            {permissions?.environments_button && (
              <ProfileItem
                children={
                  <ResourceList
                    item={company.environmentItem?.name || "No environment"}
                    className={styles.environmentavatar}
                    colorItem={company.environmentItem}
                    icon={
                      <LocalOfferIcon
                        style={{
                          color: "#747474",
                        }}
                      />
                    }
                  />
                }
                onClick={openEnvironmentList}
              />
            )}

            <ProfileItem
              children={
                <GTranslateIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Languages"}
              onClick={handleClickLanguages}
            />

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}>
              {languages?.map((item) => (
                <MenuItem
                  onClick={() => {
                    changeLanguage(item.slug);
                  }}
                  key={item.id}
                  style={{
                    backgroundColor:
                      item.slug === defaultLanguage ? "#E5E5E5" : "#fff",
                  }}>
                  {item?.title}
                </MenuItem>
              ))}
            </Menu>
            <Box>
              {defaultAdmin && (
                <ProfileItem
                  children={
                    <WidgetsIcon
                      style={{
                        color: "#747474",
                      }}
                    />
                  }
                  text={"Template"}
                  onClick={() => {
                    handleTemplateModalOpen();
                    closeMenu();
                  }}
                />
              )}
              {permissions?.menu_setting_button && (
                <ProfileItem
                  children={
                    <SettingsIcon
                      style={{
                        color: "#747474",
                      }}
                    />
                  }
                  text={"Menu settings"}
                  onClick={() => {
                    handleMenuSettingModalOpen();
                    closeMenu();
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box className={styles.centerblock}>
          <div className={styles.block}>
            <ProfileItem
              children={
                <>
                  <p className={styles.companyavatar}>
                    {auth?.userInfo?.name?.charAt(0).toUpperCase() ||
                      auth?.userInfo?.login?.charAt(0).toUpperCase()}
                  </p>
                  {auth?.userInfo?.name || auth?.userInfo?.login}
                </>
              }
            />
          </div>
          <Divider />
          <div className={styles.block}>
            {permissions?.profile_settings_button && (
              <ProfileItem
                text={"Profile settings"}
                onClick={() => {
                  navigate(`/settings/auth/matrix/profile/crossed`);
                }}
              />
            )}

            <ProfileItem text={"Logout"} onClick={logoutClickHandler} />
          </div>
        </Box>
      </Menu>

      <ProjectList
        projectListEl={projectListEl}
        closeProjectList={closeProjectList}
        projectVisible={projectVisible}
        projectList={company.projects}
        setSelected={setSelected}
        handleProjectNavigate={handleProjectNavigate}
      />
      <EnvironmentsList
        environmentListEl={environmentListEl}
        closeEnvironmentList={closeEnvironmentList}
        environmentVisible={environmentVisible}
        environmentList={company.environments}
        handleEnvNavigate={handleEnvNavigate}
        setSelected={setSelected}
        refreshTokenFunc={refreshTokenFunc}
      />
      {versionModalIsOpen && <VersionModal closeModal={closeVersionModal} />}

      {companyModal && <CompanyModal closeModal={closeCompanyModal} />}
    </div>
  );
};

export default NewProfilePanel;
