import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import { showAlert } from "../../../../store/alert/alert.thunk";
import request from "../../../../utils/request";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useDownloader from "../../../../hooks/useDownloader";

const ActionButton = ({ event, id, control, disable, getAllData }) => {
  const { tableSlug } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [disabled, setDisabled] = useState();
  const { download } = useDownloader();

  function getLastUnderscorePart(url) {
    let fileName = url.split("/").pop();
    let fileNameWithoutExtension = fileName.split(".")[0];
    let fileNameParts = fileNameWithoutExtension.split("_");

    if (fileNameParts.length > 1) {
      return fileNameParts.pop() + "." + fileName.split(".").pop();
    } else {
      return fileName;
    }
  }

  const invokeFunction = () => {
    const data = {
      function_id: event.event_path,
      object_ids: [id],
    };

    setBtnLoader(true);
    request
      .post("/invoke_function", data, {
        params: { use_no_limit: event?.attributes?.use_no_limit },
      })
      .then((res) => {
        dispatch(showAlert("Success", "success"));

        let url = res?.link ?? event?.url ?? "";
        if (res?.status === "error") {
          dispatch(showAlert(/*res?.data?.message,*/ "error"));
        } else {
          if (event?.action_type === "HTTP") {
            if (event?.attributes?.use_refresh) {
              navigate("/reloadRelations", {
                state: {
                  redirectUrl: window.location.pathname,
                },
              });
            } else {
              // queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
              getAllData()
            }
          } else if (url) {
            Object.entries(res?.data ?? {}).forEach(([key, value]) => {
              const computedKey = "${" + key + "}";
              url = url.replaceAll(computedKey, value);
            });
          } else if (url.includes("reload:")) {
            navigate("/reload", {
              state: {
                redirectUrl: url,
              },
            });
          } else if (url === "" || url === "reload") {
            navigate("/reload", {
              state: {
                redirectUrl: window.location.pathname,
              },
            });
          } else if (url === "reloadRelations") {
            navigate("/reloadRelations", {
              state: {
                redirectUrl: window.location.pathname,
              },
            });
          } else if (url?.includes("cdn")) {
            download({ link: url, fileName: getLastUnderscorePart(url) });
          } else {
            if (url.includes("http") || url.includes("https")) {
              window.open(url, "_blank");
            } else {
              navigate(`/${url}`);
            }
          }
        }
      })
      .finally(() => setBtnLoader(false));
  };
  useEffect(() => {
    if (event?.disable === false || event?.disable === undefined) {
      setDisabled(false);
    } else if (event?.disable === true) {
      const match = control[`${event.functions[0].path}_disable`];
      setDisabled(match);
    }
  }, [control, event]);
  // if(Object.keys(control).some(key => key === `${event?.functions?.[0].path}_disable`) === true) {
  //   setDisabled(true)
  // } else if(Object.keys(control).some(key => key === `${event?.functions?.[0].path}_disable`) === false) {
  //   setDisabled(false)
  // }
  return (
    <PrimaryButton
      disabled={disabled}
      loader={btnLoader}
      onClick={invokeFunction}
    >
      <IconGenerator icon={event.icon} /> {event.label}
    </PrimaryButton>
  );
};

export default ActionButton;
