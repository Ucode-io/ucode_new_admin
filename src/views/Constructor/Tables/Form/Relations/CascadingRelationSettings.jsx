import { useQuery } from "react-query";
import cascadingService from "../../../../../services/cascadingService";
import styles from "./style.module.scss";
import Menu from "@mui/material/Menu";
import { useMemo, useState } from "react";
import CascadingRecursiveBlock from "./CascadingRecursiveBlock";
import ClearIcon from "@mui/icons-material/Clear";

const CascadingRelationSettings = ({
  control,
  watch,
  slug,
  setValue,
  field_slug,
}) => {
  const [relations, setRelation] = useState();
  const cascading = watch("cascadings");
  const [menu, setMenu] = useState(null);
  const open = Boolean(menu);

  const handleClick = (e) => {
    setMenu(e.currentTarget);
    setValue("cascading_tree_table_slug", "");
    setValue("cascading_tree_field_slug", "");
    cascadingService
      .getList({
        table_slug: slug,
      })
      .then((res) => {
        setRelation(res?.data?.cascadings);
      });

    setValue("cascadings", [{ table_slug: slug, field_slug: field_slug }]);
  };
  const handleClose = () => {
    setMenu(null);
  };

  const cascadingValue = useMemo(() => {
    let value = "";
    if (cascading?.length > 1) {
      value += cascading[1]?.label ?? "";
      if (cascading[2]?.label) {
        value += ` => ${cascading[2]?.label}`;
        if (cascading[3]?.label) {
          value += ` => ${cascading[3]?.label}`;
        }
      }
    }
    return value;
  }, [cascading]);

  return (
    <div className={styles.customRow}>
      <div className={styles.customLabel}>
        <h2>Cascading</h2>
      </div>
      <div className={styles.input_control}>
        <span onClick={handleClick} className={styles.cascadingInput}>
          <input
            type="text"
            disabled
            value={cascadingValue && cascadingValue}
            className={styles.cascading_input}
            placeholder="value"
            control={control}
          />
        </span>
        {cascading?.length > 1 && (
          <button
            className={styles.cascadingButton}
            onClick={() => setValue("cascadings", [])}
          >
            <ClearIcon />
          </button>
        )}
      </div>
      <Menu anchorEl={menu} open={open} onClose={handleClose}>
        <div className={styles.cascading_collapse}>
          <CascadingRecursiveBlock
            fields={relations}
            cascading={cascading}
            setValue={setValue}
            handleClose={handleClose}
          />
        </div>
      </Menu>
    </div>
  );
};

export default CascadingRelationSettings;
