import { useForm, useFormContext } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";

const QueryToolForm = ({ open, closeDrawer, data }) => {
  return (
    <DrawerCard
      title={"Tool Node"}
      onClose={closeDrawer}
      open={open}
      anchor={"bottom"}
    >
      tool
    </DrawerCard>
  );
};

export default QueryToolForm;
