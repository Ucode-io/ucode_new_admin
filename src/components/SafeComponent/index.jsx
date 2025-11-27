import React from "react";
import styles from "./style.module.scss";

export default class SafeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.saveComponent}>
          <div className={styles.cloud}>
            {/* <img src="/img/weakInternet.svg" width={"100px"} alt="" />
            <h1>Week internet connection!</h1>
            <p>Please connect to the internet and try again.</p> */}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
