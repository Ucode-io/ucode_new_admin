import {Box, Button, Modal} from "@mui/material";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import {useState} from "react";
import HFPolygonField from "../FormElements/HFPolygonField";
import CloseIcon from "@mui/icons-material/Close";
import {get} from "@ngard/tiny-get";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
function PolygonFieldTable({
  control,
  field,
  updateObject,
  computedSlug,
  isNewTableView,
  row,
  newColumn,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePolygon = () => {
    Boolean(!newColumn && isNewTableView) && updateObject();
    handleClose();
  };

  const value = get(row, field.slug, "");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        }}
        onClick={handleOpen}>
        <span>Polygon</span>
        <Button>
          <LocationSearchingIcon />
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box>
            <HFPolygonField
              width={"740px"}
              height={"400px"}
              control={control}
              field={field}
              updateObject={updateObject}
              name={computedSlug}
              isNewTableView={isNewTableView}
            />
          </Box>

          <Box
            sx={{
              bottom: "20px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 0 0 0",
            }}>
            <Button
              sx={{width: "150px"}}
              variant="outlined"
              color="error"
              onClick={handleClose}>
              Cancel
            </Button>
            <Button
              sx={{width: "150px"}}
              variant="contained"
              onClick={updatePolygon}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default PolygonFieldTable;
