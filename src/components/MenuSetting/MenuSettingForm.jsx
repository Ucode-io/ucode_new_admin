import { Box, Typography, Button } from "@mui/material";
import styles from "./style.module.scss";
import { Left } from "../../assets/icons/icon";
import NewColorInput from "../FormElements/HFNewColorPicker";
import { useForm } from "react-hook-form";
import HFTextField from "../FormElements/HFTextField";
import {
  useMenuTemplateCreateMutation,
  useMenuTemplateGetByIdQuery,
  useMenuTemplateUpdateMutation,
} from "../../services/menuTemplateService";

const MenuSettingForm = ({ setModalType, setCheck, formType }) => {
  const { control, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      background: "#000",
      active_background: "#000",
      text: "#000",
      active_text: "#000",
    },
  });

  const { isLoading } = useMenuTemplateGetByIdQuery({
    templateId: formType,
    queryParams: {
      enabled: Boolean(formType),
      onSuccess: (res) => {
        reset(res);
      },
    },
  });

  const { mutate: create, isLoading: createLoading } =
    useMenuTemplateCreateMutation({
      onSuccess: (res) => {
        setCheck(res);
        setModalType("CUSTOMIZE");
      },
    });
  const { mutate: update, isLoading: updateLoading } =
    useMenuTemplateUpdateMutation({
      onSuccess: (res) => {
        setCheck(res);
        setModalType("CUSTOMIZE");
      },
    });

  const submitHandler = (values) => {
    if (formType) update({ ...values });
    else
      create({
        ...values,
      });
  };

  return (
    <Box className={styles.color}>
      <div className={styles.header}>
        <Typography
          variant="h4"
          onClick={() => {
            setModalType("CUSTOMIZE");
          }}
        >
          <Left /> Create
        </Typography>
      </div>
      <form className={styles.formblock} onSubmit={handleSubmit(submitHandler)}>
        <Box className={styles.formcard}>
          <Typography className={styles.blocktitle} variant="h4">
            Backgound
          </Typography>
          <Box className={styles.colorpicker}>
            <NewColorInput control={control} name="background" />
            <HFTextField
              control={control}
              name="background"
              fullWidth
              className={styles.formcolorinput}
            />
            {/* <p>{watch("background")}</p> */}
          </Box>
        </Box>
        <Box className={styles.formcard}>
          <Typography className={styles.blocktitle} variant="h4">
            Active background
          </Typography>
          <Box className={styles.colorpicker}>
            <NewColorInput control={control} name="active_background" />
            <HFTextField
              control={control}
              name="active_background"
              fullWidth
              className={styles.formcolorinput}
            />
            {/* <p>{watch("active_background")}</p> */}
          </Box>
        </Box>
        <Box className={styles.formcard}>
          <Typography className={styles.blocktitle} variant="h4">
            Text
          </Typography>
          <Box className={styles.colorpicker}>
            <NewColorInput control={control} name="text" />
            <HFTextField
              control={control}
              name="text"
              fullWidth
              className={styles.formcolorinput}
            />
            {/* <p>{watch("text")}</p> */}
          </Box>
        </Box>
        <Box className={styles.formcard}>
          <Typography className={styles.blocktitle} variant="h4">
            Active text
          </Typography>
          <Box className={styles.colorpicker}>
            <NewColorInput
              control={control}
              name="active_text"
              defaultValue={watch("active_text")}
            />
            <HFTextField
              control={control}
              name="active_text"
              fullWidth
              className={styles.formcolorinput}
            />
            {/* <p>{watch("active_text")}</p> */}
          </Box>
        </Box>
        <Box className={styles.formcard}>
          <Typography
            className={styles.blocktitle}
            style={{
              color: watch("background"),
            }}
            variant="h4"
          >
            Color text
          </Typography>
          <HFTextField
            control={control}
            name="title"
            fullWidth
            className={styles.colorinput}
          />
        </Box>
      </form>
      <div className={styles.footer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(submitHandler)}
        >
          Apply
        </Button>
      </div>
    </Box>
  );
};

export default MenuSettingForm;
