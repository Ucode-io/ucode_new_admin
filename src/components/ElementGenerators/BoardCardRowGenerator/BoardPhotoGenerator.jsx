import { get } from "@ngard/tiny-get";
import { useMemo } from "react";
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel";
import styles from "./style.module.scss";

const BoardPhotoGenerator = ({ field, el }) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(el, field.slug, "");
    return getRelationFieldTableCellLabel(field, el, field.slug + "_data");
  }, [field, el]);

  return (
    <>
      {field.type === "PHOTO" &&
      value !== null &&
      value?.length &&
      !value.includes("undefined") ? (
        <div key={field.id} className={styles.photorow}>
          <img src={value} alt="board_image" className={styles.image} />
        </div>
      ) : null}
    </>
  );
};

export default BoardPhotoGenerator;
