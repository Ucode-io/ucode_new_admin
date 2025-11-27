import { AiOutlineSetting } from "react-icons/ai";
import {
  BiAddToQueue,
  BiDockBottom,
  BiDockLeft,
  BiDockRight,
  BiDotsVerticalRounded,
  BiDownload,
  BiHistory,
  BiUpload,
} from "react-icons/bi";
import "../../scenarioOverrides.scss";
import HFAutoWidthInput from "../../../../../FormElements/HFAutoWidthInput";
import Header, {
  HeaderExtraSide,
  HeaderLeftSide,
  HeaderMiddleSide,
} from "../../../Header";
import { Box, Button, Divider, Menu, MenuItem, MenuList } from "@mui/material";

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const Navbar = ({
  onSubmit,
  handleSubmit,
  control,
  toggle,
  setToggle,
  openCommitView,
  watch,
  scenarioId,
}) => {
  //   const isBottomModalOpen = queryStore.queryBottomSidebarIsOpen;
  //   const isRightModalOpen = queryStore.queryRightSidebarIsOpen;
  return (
    <Header
      style={{
        width: toggle ? "calc(100% - 310px)" : "100%",
        marginLeft: "auto",
        transition: ".5s",
        marginRight: "10px",
        background: "#fff",
      }}
    >
      <HeaderLeftSide className="headerLeftSide">
        <Box className="input_group">
          <HFAutoWidthInput
            control={control}
            required
            name="dag.title"
            defaultValue="Title"
          />
        </Box>
      </HeaderLeftSide>
      <HeaderMiddleSide
        style={{
          margin: "auto",
        }}
      >
        <Box style={center} columnGap={"10px"}>
          <BiDockLeft
            size={20}
            cursor="pointer"
            onClick={() => setToggle(!toggle)}
            style={{
              color: toggle ? "#007AFF" : "#C0C0C0",
            }}
          />
          <BiDockBottom
            size={20}
            cursor="pointer"
            // onClick={() => {
            //   queryStore.toggleQueryBottomSidebar();
            // }}
            // style={{
            //   color: isBottomModalOpen ? "#007AFF" : "#C0C0C0",
            // }}
          />
          <BiDockRight
            size={20}
            cursor="pointer"
            // onClick={() => {
            //   queryStore.toggleQueryRightSidebar();
            // }}
            // style={{
            //   color: isRightModalOpen ? "#007AFF" : "#C0C0C0",
            // }}
          />
        </Box>
      </HeaderMiddleSide>
      <HeaderExtraSide>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          mr={5}
          ml={5}
        >
          Save
        </Button>
        <Menu>
          <Button
            shape="circle"
            aria-label="Options"
            icon={<BiDotsVerticalRounded />}
            variant="contained"
            bgSize={"md"}
            paddingRight={6}
          >
            <BiDotsVerticalRounded size={"20"} color={"#6E8BB7"} />
          </Button>
          <MenuList marginRight={4} zIndex="99999">
            <MenuItem icon={<BiUpload size={18} />} command="⌘T">
              Import JSON
            </MenuItem>
            <MenuItem icon={<BiDownload size={18} />} command="⌘N">
              Export JSON
            </MenuItem>
            <MenuItem icon={<BiAddToQueue size={18} />} command="⌘^T">
              Duplicate
            </MenuItem>
            <Divider />
            <MenuItem icon={<BiHistory size={18} />} command="⌘^F">
              Release and history
            </MenuItem>
            <Divider />
            <MenuItem icon={<AiOutlineSetting size={18} />} command="⌘^F">
              Settings
            </MenuItem>
          </MenuList>
        </Menu>
      </HeaderExtraSide>
    </Header>
  );
};

export default Navbar;
