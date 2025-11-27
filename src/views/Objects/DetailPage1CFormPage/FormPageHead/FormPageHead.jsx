import React from "react";
import styles from "./style.module.scss";
import {useSearchParams} from "react-router-dom";
import useRelationTabRouter from "../../../../hooks/useRelationTabRouter";
import FormPageBackBtn from "./FormPageBackBtn";

function FormPageHead({onSubmit = () => {}, getRelatedTabeSlug, selectedTab}) {
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const {navigateToRelationForm} = useRelationTabRouter();
  return (
    <div className={styles.tableHeadTitle}>
      <div className={styles.tabBackBtn}>
        <FormPageBackBtn />
      </div>
      <div className={styles.tableHeadLinks}>
        {selectedTab?.type !== "section" && (
          <button
            onClick={() => {
              navigateToRelationForm(
                getRelatedTabeSlug?.relation_table_slug,
                "CREATE",
                {},
                {},
                menuId
              );
            }}
            className={styles.headRegisterClose}>
            Добавить
          </button>
        )}
        <button onClick={onSubmit} className={styles.headRegister}>
          Записать
        </button>
      </div>
    </div>
  );
}

export default FormPageHead;
