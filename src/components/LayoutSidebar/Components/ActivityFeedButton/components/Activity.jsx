import { Box } from "@mui/material";
import { useState } from "react";
import style from "../style.module.scss";
import ActivityFeedHeader from "./ActivityFeedHeader";
import ActivityFeedTable from "./ActivityFeedTable";
import { endOfMonth, format, startOfMonth } from "date-fns";

const ActivityFeedPage = () => {
    const [histories, setHistories] = useState(null)
    const [dateFilters, setDateFilters] = useState({
        $gte: startOfMonth(new Date()),
        $lt: endOfMonth(new Date()),
    });
    return (
        <>
            <Box className={style.activity}>
                <ActivityFeedHeader histories={histories?.histories} setDateFilters={setDateFilters} dateFilters={dateFilters} />
                <ActivityFeedTable setHistories={setHistories} dateFilters={dateFilters} />
            </Box>
        </>
    );
};

export default ActivityFeedPage;
