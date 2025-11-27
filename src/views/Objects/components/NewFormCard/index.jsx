import styles from "./style.module.scss";

const NewFormCard = ({title, children, icon, extra, topHeader, modalTitle}) => {
  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          paddingRight: "10px",
        }}>
        {topHeader && <div>{topHeader}</div>}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          width: "100%",
        }}>
        <div className={styles.header}>
          <div className={styles.headerLeftSide}>
            {/* {icon && <div className={styles.iconBlock} >
            <IconGenerator icon={icon} size={14}  />
          </div>} */}
            <h4 className={`${modalTitle ? styles.modalTitle : styles.title}`}>
              {modalTitle && title?.length > 50
                ? `${title?.slice(0, 25)}...`
                : title}
            </h4>
          </div>

          {extra && <div className={styles.headerRightSide}>{extra}</div>}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default NewFormCard;
