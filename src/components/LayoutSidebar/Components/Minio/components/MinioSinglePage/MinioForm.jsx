import { Box, IconButton } from "@mui/material";
import FormCard from "../../../../../FormCard";
import FRow from "../../../../../FormElements/FRow";
import HFTextField from "../../../../../FormElements/HFTextField";
import style from "./style.module.scss";
import DownloadIcon from "@mui/icons-material/Download";
import useDownloader from "../../../../../../hooks/useDownloader";
const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

const MinioForm = ({ control, file }) => {
  const { download } = useDownloader();
  const url = `${cdnURL}${file?.link}`;

  return (
    <>
      <Box className={style.form}>
        <FRow label={"Title"}>
          <HFTextField
            disabledHelperText
            name="title"
            control={control}
            fullWidth
            required
          />
        </FRow>
        <FRow label={"Storage"}>
          <HFTextField
            disabledHelperText
            name="storage"
            control={control}
            fullWidth
            disabled
            required
          />
        </FRow>

        <FormCard
          title={"File naming"}
          maxWidth={"100%"}
          className={style.formcard}
        >
          <FRow label={"Filename (Disk)"}>
            <HFTextField
              disabledHelperText
              name="file_name_disk"
              control={control}
              disabled
              fullWidth
              required
            />
          </FRow>
          <FRow label={"Filename (Download)"}>
            <HFTextField
              disabledHelperText
              name="file_name_download"
              control={control}
              fullWidth
              required
              endAdornment={
                <IconButton
                  onClick={() => download({ link: url, fileName: file?.title })}
                >
                  <DownloadIcon />
                </IconButton>
              }
            />
          </FRow>
        </FormCard>
      </Box>
    </>
  );
};

export default MinioForm;
