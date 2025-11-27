import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SortIcon from "@mui/icons-material/Sort";

const ActivityFeedFilterBlock = ({ menuItem }) => {
    return (
        <>
            <Box className={style.filterblock}>
                <Box className={style.block}>
                    <Box className={style.select}>
                        <Typography
                            variant="h5"
                            className={style.title}
                        >
                            <CheckCircleOutlineIcon /> Select All
                        </Typography>
                    </Box>
                    <Box className={style.filter}>

                        <Tooltip title="Sort description">
                            <SortIcon />
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ActivityFeedFilterBlock;
