import {Box, Button, Tooltip} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import DeleteIcon from "@mui/icons-material/Delete";
import {BsThreeDots} from "react-icons/bs";
import EnvironmentModal from "../EnvironmentMenu/EnvironmentModal";
import {useNavigate, useParams} from "react-router-dom";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import {useDispatch} from "react-redux";

function RecursiveBlock({level = 1, menuStyle, menuItem}) {
  const [open, setOpen] = useState(false);
  const {appId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const styles = {
    color: "#a8a8a8",
    borderRadius: "8px",
    margin: "5px 0",
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgb(255, 255, 255)",
        color: "rgb(168, 168, 168)",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderRadius: "10px",
        margin: "0px",
      }}>
      <div className="parent-block column-drag-handle">
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            navigate(`/main/${appId}/project-setting`);
          }}>
          <div className="label" style={{padding: "0 10px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>Project Settings</p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            navigate(`/main/${appId}/environments`);
          }}>
          <div className="label" style={{padding: "0 10px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>Environments</p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
        <Button
          style={styles}
          className="nav-element"
          onClick={(e) => {
            e?.stopPropagation();
            handleOpen();
            navigate("main/c57eedc3-a954-4262-a0af-376c65b5a280");
          }}>
          <div className="label" style={{padding: "0 10px"}}>
            <Tooltip title="Project Settings" placement="top">
              <p>Versions</p>
            </Tooltip>
          </div>
          <Box className="icon_group">
            <Tooltip title="Resource settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots size={13} />
              </Box>
            </Tooltip>
          </Box>
        </Button>
      </div>
      {open && <EnvironmentModal open={open} handleClose={handleClose} />}
    </Box>
  );
}

export default RecursiveBlock;
