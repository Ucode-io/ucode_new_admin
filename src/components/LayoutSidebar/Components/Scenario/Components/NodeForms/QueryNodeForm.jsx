import { useForm, useFormContext } from "react-hook-form";
import HFTextField from "../../../../../FormElements/HFTextField";
import DrawerCard from "../../../../../DrawerCard";
import FRow from "../../../../../FormElements/FRow";
import styles from "../../index.module.scss";
import { styled } from "styled-components";

const QueryNodeForm = ({ open, closeDrawer, data }) => {
  const MyPaper = styled.div`
    background: "none";
    flex: 1;
  `;
  return (
    <DrawerCard
      title={"Query Node"}
      onClose={closeDrawer}
      open={open}
      className={styles.drawer}
      PaperProps={{ component: MyPaper }}
    >
      Node
    </DrawerCard>
  );
};

export default QueryNodeForm;
