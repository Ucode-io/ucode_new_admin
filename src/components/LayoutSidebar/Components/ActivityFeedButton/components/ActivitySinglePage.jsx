import CustomDrawer from "./Drawer";
import CloseIcon from '@mui/icons-material/Close';
import style from "../style.module.scss";
import { Box, Typography } from "@mui/material";
import WidgetsIcon from '@mui/icons-material/Widgets';
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";
import ReactJson from "react-json-view";
import { ActivityFeedColors } from "../../../../Status";
import Tag from "../../../../Tag";
import RectangleIconButton from "../../../../Buttons/RectangleIconButton";
import { MdContentCopy } from "react-icons/md";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { format } from "date-fns";
import { zonedTimeToUtc } from 'date-fns-tz'


const ActivitySinglePage = ({ open, closeDrawer, history, versionHistoryByIdLoader }) => {
    const dispatch = useDispatch()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const utcDate = zonedTimeToUtc(history?.date, timezone)

    const copyJson = (text) => {
        dispatch(showAlert("Copied to clipboard", "success"));
        navigator.clipboard.writeText(JSON.stringify(text, null, 2))
    }

    return (
        <CustomDrawer
            title={"Start Node"}
            onClose={closeDrawer}
            open={open}
            className={style.drawer}
        >
            {versionHistoryByIdLoader ? (
                <RingLoaderWithWrapper style={{ height: "100%" }} />
            ) : (
                <>
                    <div className={style.addicon} onClick={closeDrawer}>
                        <CloseIcon />
                    </div>
                    <Box className={style.header}>
                        <Box className={style.leftside}>
                            <div className={style.foldericon}>
                                <WidgetsIcon />
                            </div>
                            <Typography variant="h3">Activity Item</Typography>
                        </Box>
                    </Box>

                    <Box className={style.content}>
                        <Box className={style.card}>
                            <Typography variant="h6">User:</Typography>
                            <Typography variant="p">{history?.user_info}</Typography>
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Action:</Typography>
                            <Tag
                                shape="subtle"
                                color={ActivityFeedColors(history?.action_type)}
                                size="large"
                                style={{
                                    background: `${ActivityFeedColors(history?.action_type)}`,
                                    width: '97px'
                                }}
                                className={style.tag}
                            >
                                {history?.action_type?.charAt(0).toUpperCase() + history?.action_type.slice(1).toLowerCase()}
                            </Tag>
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Date:</Typography>
                            {history && <Typography variant="p">{format(utcDate, 'yyyy-MM-dd HH:mm:ss')}</Typography>}
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Collection:</Typography>
                            <Typography variant="p">{history?.table_slug}</Typography>
                        </Box>
                        <Box className={style.promise}>
                            <Box width={"50%"} borderRadius={"10px"} className={style.promise_card}>
                                <Typography variant="h6">Request:</Typography>
                                <RectangleIconButton
                                    onClick={() =>
                                        copyJson(JSON.stringify(history?.request, null, 2))
                                    }
                                    className={style.copy}
                                >
                                    <MdContentCopy />
                                </RectangleIconButton>

                                <ReactJson
                                    src={history?.request && JSON.parse(history?.request)}
                                    theme="codeschool"
                                    style={{
                                        padding: "10px",
                                        borderRadius: "10px",
                                        overflow: "auto",
                                        height: "300px",

                                    }}
                                    enableClipboard={false}
                                    displayDataTypes={false}
                                    displayObjectSize={false}
                                />
                            </Box>
                            <Box width={"50%"} borderRadius={"10px"} className={style.promise_card}>
                                <Typography variant="h6">Response:</Typography>
                                <RectangleIconButton
                                    onClick={() =>
                                        copyJson(JSON.stringify(history?.response, null, 2))
                                    }
                                    className={style.copy}
                                >
                                    <MdContentCopy />
                                </RectangleIconButton>
                                <ReactJson
                                    src={history?.response && JSON.parse(history?.response)}
                                    theme="codeschool"
                                    style={{
                                        padding: "10px",
                                        borderRadius: "10px",
                                        overflow: "auto",
                                        height: "300px",

                                    }}
                                    displayDataTypes={false}
                                    enableClipboard={false}
                                    displayObjectSize={false}
                                />
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </CustomDrawer >
    );
};

export default ActivitySinglePage;
