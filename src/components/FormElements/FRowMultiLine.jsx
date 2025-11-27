import { useState } from "react";
import "../FormElements-backup/style.scss";

const FRowMultiLine = ({ label = "", children, position = "vertical", componentClassName = "", required = false, extra, extraClassName, ...props }) => {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className={`FRowMultiLine ${position} ${extraClassName}`} {...props}>
      {extra && (
        <div className="desc">
          {label && (
            <div className="label">
              {required && <span className="requiredStart">*</span>}{" "}
              {label?.length > 20 ? (
                !showFullText ? (
                  <>
                    {label && label.substring(0, 20) + " "}
                    <span className="full_text" onClick={() => setShowFullText(true)}>
                      ...
                    </span>
                  </>
                ) : (
                  <>
                    {label && label + " "}
                    <span className="full_text" onClick={() => setShowFullText(false)}>
                      ...
                    </span>
                  </>
                )
              ) : (
                label && label + " "
              )}
            </div>
          )}
          <div className="extra">{extra}</div>
        </div>
      )}
      <div className={`component ${componentClassName}`}>{children}</div>
    </div>
  );
};

export default FRowMultiLine;
