import "../FormElements-backup/style.scss";

const FRow = ({
  label = "",
  children,
  position = "vertical",
  componentClassName = "",
  required = false,
  extra,
  classname,
  ...props
}) => {
  return (
    <div className={`FRow ${position}`} {...props}>
      <div className="desc">
        <div className={`label ${classname}`}>
          {required && <span className="requiredStart">*</span>}{" "}
          {label && label + ":"}
        </div>
        <div className="extra">{extra}</div>
      </div>
      <div className={`component ${componentClassName}`}>{children}</div>
    </div>
  );
};

export default FRow;
