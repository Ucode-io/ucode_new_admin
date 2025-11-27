import { forwardRef } from "react";

import styles from "./style.module.scss";

const SecondaryButton = forwardRef(
  ({ children, className, color = "primary", size, disabled = false,onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={`${styles.button} ${styles.secondary} ${styles[size]} ${styles[color]} ${
        disabled ? styles.disabled : ""
      } ${className}`}
      onClick={() => !disabled && onClick()}
      {...props}
    >
      {children}
    </button>
  )
);

export default SecondaryButton;
