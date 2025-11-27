import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Controller, useWatch} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {InputAdornment, TextField, Tooltip} from "@mui/material";

import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import request from "../../utils/request";
import {showAlert} from "../../store/alert/alert.thunk";
import constructorFunctionService from "../../services/constructorFunctionService";
import {Lock} from "@mui/icons-material";

const InventoryBarCode = ({
  control,
  watch = () => {},
  name = "",
  relatedTable,
  updateObject,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled = false,
  field,
  checkRequiredField,
  setFormValue,
  valueGenerator,
  ...props
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const [elmValue, setElmValue] = useState("");
  const time = useRef();

  const barcode = useWatch({
    control,
    name: name,
  });

  const sendRequestOpenFaas = () => {
    const params = {
      form_input: true,
    };
    constructorFunctionService
      .invoke(
        {
          function_id: field?.attributes?.function,
          object_ids: [id, elmValue],
          attributes: {
            barcode: elmValue.length > 0 ? elmValue : barcode,
          },
        },
        params
      )
      .then((res) => {
        dispatch(showAlert("Успешно!", "success"));

        // navigate("/reloadRelations", {
        //   state: {
        //     redirectUrl: window.location.pathname
        //   },
        // });
      })
      .finally(() => {
        // setFormValue(name, "");
        // setElmValue("");
        queryClient.refetchQueries(["GET_OBJECT_LIST"]);
      });
  };

  // useDebouncedWatch(
  //   () => {
  //     if (elmValue.length >= field.attributes?.length && !field.attributes?.pressEnter && field.attributes?.automatic) {
  //       sendRequestOpenFaas();
  //     }
  //   },
  //   [elmValue],
  //   300
  // );

  useEffect(() => {
    if (
      elmValue.length >= field.attributes?.length &&
      !field.attributes?.pressEnter &&
      field.attributes?.automatic
    ) {
      sendRequestOpenFaas();
    }
  }, [elmValue]);

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      if (field.attributes?.pressEnter) {
        sendRequestOpenFaas();
      }
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: checkRequiredField ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <TextField
            size="small"
            value={value}
            onChange={(e) => {
              const currentTime = new Date().getTime();
              if (
                currentTime - time.current > 50 &&
                !field.attributes?.automatic
              ) {
                onChange(
                  e.target.value.substring(value.length, e.target.value.length)
                );
              } else {
                onChange(e.target.value);
              }
              isNewTableView && updateObject();
              setElmValue(e.target.value);
              time.current = currentTime;
            }}
            onKeyDown={(e) => keyPress(e)}
            name={name}
            error={error}
            sx={{padding: 0}}
            fullWidth={fullWidth}
            InputProps={{
              readOnly: disabled,
              style: disabled
                ? {
                    background: "#c0c0c039",
                    paddingRight: "0px",
                  }
                : {
                    background: "inherit",
                    color: "#000",
                    height: "25px",
                    padding: 0,
                  },

              endAdornment: disabled && (
                <Tooltip title="This field is disabled for this role!">
                  <InputAdornment position="start">
                    <Lock style={{fontSize: "20px"}} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
            className="custom_textfield"
            helperText={!disabledHelperText && error?.message}
            {...props}
          />
        </>
      )}
    />
  );
};

export default InventoryBarCode;
