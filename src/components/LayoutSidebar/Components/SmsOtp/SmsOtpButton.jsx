import { Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { updateLevel } from "../../../../utils/level";
import SmsIcon from "@mui/icons-material/Sms";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const smsOtpButton = {
  label: "Sms otp",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "0011",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const SmsOtpButton = ({ level = 1, menuStyle, menuItem }) => {
  const { appId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      smsOtpButton?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      smsOtpButton?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "8px",
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const labelStyle = {
    paddingLeft: "15px",
    color:
      smsOtpButton?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = () => {
    navigate(`/main/${appId}/sms-otp`);
    dispatch(menuActions.setMenuItem(smsOtpButton));
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label" style={labelStyle}>
            <SmsIcon size={18} />
            {smsOtpButton?.label}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default SmsOtpButton;
