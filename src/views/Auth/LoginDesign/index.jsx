import LoginFormDesign from "../LoginFormDesign";
import styles from "./style.module.scss";

const LoginDesign = () => {
  return (
    <>
      <div className={styles.outlet}>
        <div className={styles.page}>
          <LoginFormDesign
          // setFormType={setFormType}
          // formType={formType}
          // setIndex={setIndex}
          // index={index}
          // selectedTabIndex={selectedTabIndex}
          // setSelectedTabIndex={setSelectedTabIndex}
          />
        </div>
      </div>
    </>
  );
};

export default LoginDesign;
