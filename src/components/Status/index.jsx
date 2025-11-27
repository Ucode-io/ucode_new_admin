export const ActivityFeedColors = (name) => {
  switch (name) {
    case "GET":
      return "#61affe";
    case "POST":
      return "#49cc90";
    case "CREATE":
      return "#49cc90";
    case "LOGIN":
      return "#49cc90";
    case "UPDATE":
      return "#fca130";
    case "DELETE":
      return "#f93e3e";
    case "CREATE ITEM":
      return "#49cc90";
    case "UPDATE ITEM":
      return "#fca130";
    case "DELETE ITEM":
      return "#f93e3e";
    case "CREATE TABLE":
      return "#49cc90";
    case "UPDATE TABLE":
      return "#fca130";
    case "DELETE TABLE":
    case "CREATE MENU":
      return "#49cc90";
    case "UPDATE MENU":
      return "#fca130";
    case "DELETE MENU":
      return "#f93e3e";
    case "CREATE FIELD":
      return "#49cc90";
    case "UPDATE FIELD":
      return "#fca130";
    case "DELETE FIELD":
      return "#f93e3e";
    case "CREATE VIEW":
      return "#49cc90";
    case "UPDATE VIEW":
      return "#fca130";
    case "DELETE VIEW":
      return "#f93e3e";
    case "CREATE RELATION":
      return "#49cc90";
    case "UPDATE RELATION":
      return "#fca130";
    case "DELETE RELATION":
      return "#f93e3e";
    case "CREATE LAYOUT":
      return "#49cc90";
    case "UPDATE LAYOUT":
      return "#fca130";
    case "DELETE LAYOUT":
    case "CREATE CLIENT TYPE":
      return "#49cc90";
    case "UPDATE CLIENT TYPE":
      return "#fca130";
    case "DELETE CLIENT TYPE":
      return "#f93e3e";
    case "CREATE ROLE":
      return "#49cc90";
    case "UPDATE ROLE":
      return "#fca130";
    case "DELETE ROLE":
      return "#f93e3e";
    case "CREATE USER":
      return "#49cc90";
    case "UPDATE USER":
      return "#fca130";
    case "DELETE USER":
      return "#f93e3e";
    case "UPDATE PERMISSION":
      return "#fca130";
    default:
      return "-";
  }
};
export const ActivityFeedBackground = (name) => {
  switch (name) {
    case "GET":
      return "rgba(97,175,254,.1)";
    case "POST":
      return "rgba(73,204,144,.1)";
    case "CREATE":
      return "rgba(73,204,144,.1)";
    case "LOGIN":
      return "rgba(73,204,144,.1)";
    case "UPDATE":
      return "rgba(252,161,48,.1)";
    case "DELETE":
      return "rgba(249,62,62,.1)";
    case "CREATE ITEM":
      return "rgba(73,204,144,.1)";
    case "UPDATE ITEM":
      return "rgba(252,161,48,.1)";
    case "DELETE ITEM":
      return "rgba(249,62,62,.1)";
    case "CREATE TABLE":
      return "rgba(73,204,144,.1)";
    case "UPDATE TABLE":
      return "rgba(252,161,48,.1)";
    case "DELETE TABLE":
      return "rgba(249,62,62,.1)";
    case "CREATE MENU":
      return "rgba(73,204,144,.1)";
    case "UPDATE MENU":
      return "rgba(252,161,48,.1)";
    case "DELETE MENU":
      return "rgba(249,62,62,.1)";
    case "CREATE FIELD":
      return "rgba(73,204,144,.1)";
    case "UPDATE FIELD":
      return "rgba(252,161,48,.1)";
    case "DELETE FIELD":
      return "rgba(249,62,62,.1)";
    case "CREATE VIEW":
      return "rgba(73,204,144,.1)";
    case "UPDATE VIEW":
      return "rgba(252,161,48,.1)";
    case "DELETE VIEW":
      return "rgba(249,62,62,.1)";
    case "CREATE RELATION":
      return "rgba(73,204,144,.1)";
    case "UPDATE RELATION":
      return "rgba(252,161,48,.1)";
    case "DELETE RELATION":
      return "rgba(249,62,62,.1)";
    case "CREATE LAYOUT":
      return "rgba(73,204,144,.1)";
    case "UPDATE LAYOUT":
      return "rgba(252,161,48,.1)";
    case "DELETE LAYOUT":
      return "rgba(249,62,62,.1)";
    case "CREATE CLIENT TYPE":
      return "rgba(73,204,144,.1)";
    case "UPDATE CLIENT TYPE":
      return "rgba(252,161,48,.1)";
    case "DELETE CLIENT TYPE":
      return "rgba(249,62,62,.1)";
    case "CREATE ROLE":
      return "rgba(73,204,144,.1)";
    case "UPDATE ROLE":
      return "rgba(252,161,48,.1)";
    case "DELETE ROLE":
      return "rgba(249,62,62,.1)";
    case "CREATE USER":
      return "rgba(73,204,144,.1)";
    case "UPDATE USER":
      return "rgba(252,161,48,.1)";
    case "DELETE USER":
      return "rgba(249,62,62,.1)";
    case "UPDATE PERMISSION":
      return "rgba(252,161,48,.1)";
    default:
      return "-";
  }
};

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "transparent",
    width: "100%",
    display: "flex",
    alignItems: "center",
    // border: "0px solid #fff",
    minWidth: "200px",
    outline: "none",
    maxHeight: "35px",
    minHeight: "35px"
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    // border: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#007AFF" : provided.background,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};