import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function Tag({
  children,
  icon: Icon,
  className,
  bgColor = "bg-blue-100",
  textColor = "text-blue-600",
  borderColor = "border-blue-600",
  loading = false,
  disabled,
  shape = "filled",
  removable = false,
  size = "medium",
  textStyle,
  ...rest
}) {
  const [isClicked, setIsClicked] = useState(false);

  const getSize = (key) => {
    switch (key) {
      case "small":
        return {
          size: "px-1",
          fontSize: "text-xs",
          radius: "rounded",
        };
      case "medium":
        return {
          size: "px-3",
          fontSize: "text-md",
          radius: "rounded-md",
        };
      case "large":
        return {
          size: "px-3 py-1",
          fontSize: "text-md",
          radius: "rounded-md",
        };

      default:
        break;
    }
  };

  const getShape = (key) => {
    switch (key) {
      case "filled":
        return {
          color: `${bgColor} iconColor-filled `,
          background: "",
        };
      case "outlined":
        return {
          color: `bg-transparent ${textColor} border ${borderColor} `,
        };
      case "subtle":
        return { color: `${bgColor} ${textColor}` };

      default:
        return { color: "iconColor-filled" };
    }
  };

  return (
    !isClicked && (
      <div
        className={`
          flex
          focus:outline-none
          transition
          justify-center
          text-white 
          ${children ? "" : "w-9 h-9"}
          focus:ring focus:border-blue-300 
          ${getSize(size).size}
          ${getSize(size).radius}
          ${disabled ? "bg-gray-200 cursor-not-allowed" : getShape(shape).color}
          ${className}
        `}
        {...rest}
      >
        <div
          className={`flex  items-center ${
            children ? "space-x-1" : ""
          } font-semibold`}
        >
          {Icon && <Icon style={{ fontSize: "18px" }} />}

          <div className={`${getSize(size).fontSize}`} style={textStyle}>
            {children}
          </div>
          {removable && (
            <CloseIcon
              style={{ fontSize: "14px" }}
              className="cursor-pointer"
              onClick={() => setIsClicked((prev) => !prev)}
            />
          )}
        </div>
      </div>
    )
  );
}
