import { Box } from "@mui/material";
import styles from "../style.module.scss";
import HFTextArea from "../../../../FormElements/HFTextArea";

const DetailQueryBox = ({ fields, control, title, fieldName }) => {
  return (
    <div className={styles.fields}>
      {fields?.length ? (
        <>
          <p className={styles.pathTitle}>{title}</p>
          <div className={styles.element}>
            {fields?.map((field, index) => (
              <div className={styles.card} key={field.id}>
                <div className={styles.section}>
                  <Box>
                    <div className={styles.desc}>
                      <p>{field.slug}</p>
                      <p>{field.type}</p>
                      <p>{field.required ? "required" : ""}</p>
                    </div>
                  </Box>
                  <Box className={styles.input}>
                    <HFTextArea
                      control={control}
                      name={`${fieldName}.${index}.title`}
                      placeholder="Type..."
                    />
                  </Box>
                </div>
                <p>{field.desc}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default DetailQueryBox;
