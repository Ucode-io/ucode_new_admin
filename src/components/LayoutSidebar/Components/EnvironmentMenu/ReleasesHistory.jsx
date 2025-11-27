import {Box, Button, Menu} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {useState} from "react";
import styles from "./styles.module.scss";
import {useQuery, useQueryClient} from "react-query";
import versionService from "../../../../services/versionService";
import AdjustIcon from "@mui/icons-material/Adjust";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {store} from "../../../../store";

const useStyles = {
  width: "69px",
  background: "rgb(49, 161, 49)",
  color: "#fff",
  padding: "0 8px",
  borderRadius: "5px",
  height: "23px",
  marginLeft: "10px",
  fontWeight: "700",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
};

function ReleasesHistory({
  selectedEnvironment,
  setSelectedMigrate,
  setVersion,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [version, setVersionTable] = useState();
  const company = store.getState().company;
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const {data: data, isLoading} = useQuery(["GET_ROLE_LIST"], () => {
    return versionService.getVersonsList({limit: 20, offsett: 0});
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {month: "short", day: "numeric"};
    const formattedDate = date?.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const publishRelease = () => {
    const data = {
      env_id: company?.environmentId,
      version: {
        ...version,
      },
    };
    versionService.publish(data).then(() => {
      queryClient.refetchQueries(["GET_ROLE_LIST"]);
      dispatch(showAlert("Successfully published!", "success"));
    });
  };

  return (
    <>
      <Box
        sx={{
          padding: "20px 20px",
          lineHeight: "26px",
          fontSize: "13px",
          height: "290px",
          overflow: "auto",
        }}>
        {data?.versions?.map((item) => (
          <Box
            key={item?.id}
            sx={{
              lineHeight: "28px",
              fontSize: "12px",
              marginTop: "15px",
              borderBottom: "1px solid #eee",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0 0px 0 0px",
            }}>
            <Box>
              <Box sx={{display: "flex"}}>
                <h2 style={{fontSize: "18px"}}>{item?.name}</h2>
                {item?.is_current && (
                  <Box sx={useStyles}>
                    <span
                      className={styles.liveIcon}
                      style={{height: "19px", marginRight: "5px"}}>
                      <AdjustIcon style={{height: "18px"}} />
                    </span>
                    Live
                  </Box>
                )}
              </Box>
              <p style={{color: "#999", fontWeight: "500"}}>
                {`Created By ${item?.user_info}, last change on ${formatDate(item?.created_at)}`}
              </p>
            </Box>
            <Button
              onClick={(event) => {
                setVersion(item);
                setVersionTable(item);
                handleClick(event);
              }}
              sx={{width: "20px", height: "40px"}}>
              <MoreHorizIcon />
            </Button>
          </Box>
        ))}
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <Box sx={{width: "200px"}}>
          <Box
            sx={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
            className={styles.releasePublish}
            onClick={() => {
              handleCloseMenu();
              setSelectedMigrate(false);
            }}>
            Publish Release
          </Box>
          <Box
            sx={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
            className={styles.releaseRevert}
            onClick={() => {
              handleCloseMenu();
              publishRelease();
              //   setSelectedMigrate(false);
            }}>
            Revert to this version
          </Box>
        </Box>
      </Menu>
    </>
  );
}

export default ReleasesHistory;
