import {CircularProgress} from "@mui/material";
import "./style.scss";

const TableLoader = ({isVisible = false}) => {
  if (Boolean(!isVisible)) return null;

  return (
    <div className="AbsoluteTableLoader">
      <CircularProgress />
    </div>
  );
};

export default TableLoader;
