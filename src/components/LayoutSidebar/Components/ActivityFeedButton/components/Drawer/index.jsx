import { Drawer } from "@mui/material";
import styles from "./style.module.scss";

const CustomDrawer = ({
    children,
    onClose = () => { },
    open,
    onSaveButtonClick = () => { },
    loader,
    anchor = "right",
    bodyStyle,
    sx,
    PaperProps,
    className,
    footer = true,
    titleStyle,
}) => {
    return (
        <Drawer
            sx={sx}
            open={open}
            anchor={anchor}
            className={className}
            classes={{ paperAnchorRight: styles.verticalDrawer }}
            onClose={onClose}
            PaperProps={PaperProps}
        >
            {children}
        </Drawer>
    );
};

export default CustomDrawer;
