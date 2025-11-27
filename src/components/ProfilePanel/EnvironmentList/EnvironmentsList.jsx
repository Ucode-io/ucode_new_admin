import {Menu} from "@mui/material";
import styles from "./environment.module.scss";
import {useDispatch, useSelector} from "react-redux";
import ProfileItem from "../ProfileItem";
import {companyActions} from "../../../store/company/company.slice";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {useMemo} from "react";

const alignCenterStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const EnvironmentsList = ({
  environmentListEl,
  closeEnvironmentList,
  environmentVisible,
  environmentList,
  handleEnvNavigate,
  setSelected,
  refreshTokenFunc,
}) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.globalPermissions);
  const environmentIDs = useSelector((state) => state?.auth?.environment_ids);

  const computedEnvironmentList = useMemo(() => {
    return environmentList?.filter((item) => {
      return environmentIDs?.includes(item?.id);
    });
  }, [environmentList, environmentIDs]);

  return (
    <Menu
      id="lock-menu"
      portalTarget={document.body}
      portal={true}
      anchorEl={environmentListEl}
      open={environmentVisible}
      onClose={closeEnvironmentList}
      classes={{
        list: styles.environmentslist,
        paper: styles.environmentpaper,
      }}>
      <div className={styles.block}>
        {computedEnvironmentList?.map((item) => (
          <ProfileItem
            children={
              <>
                <p
                  className={styles.projectavatar}
                  style={{
                    background: item?.display_color,
                  }}>
                  {item?.name?.charAt(0).toUpperCase()}
                </p>
                {item?.name}
              </>
            }
            onClick={() => {
              setSelected(true);
              dispatch(companyActions.setEnvironmentItem(item));
              dispatch(companyActions.setEnvironmentId(item.id));
              closeEnvironmentList(item?.id);
              refreshTokenFunc(item?.id);
            }}
            className={styles.menuItem}
            key={item.id}
          />
        ))}
        {/* {permissions?.environments_button && (
          <ProfileItem
            className={styles.menuItem}
            text={"All Environments"}
            onClick={() => {
              handleEnvNavigate();
              closeEnvironmentList();
            }}
            style={{ ...alignCenterStyle }}
          />
        )} */}
      </div>
    </Menu>
  );
};

export default EnvironmentsList;
