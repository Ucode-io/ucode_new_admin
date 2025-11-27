import React from "react";
import styles from "./styles.module.scss";

export default function ErrorPage() {
  return (
    <div className={styles.errorWrapper}>
      <p>
        Jadvalda nimadir xato ketdi, iltimos jadval tuzilishini o'zgartirib ko'ring yoki sahifani yangilab ko'ring. Yoki
        console ga qarang)
      </p>
    </div>
  );
}
