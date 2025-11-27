import styles from "./style.module.scss";

const Footer = ({ children, extra, style }) => {
  return (
    <div className={styles.footer} style={style}>
      <div>{children}</div>

      <div className={styles.extra}>{extra}</div>
    </div>
  );
};

export default Footer;
