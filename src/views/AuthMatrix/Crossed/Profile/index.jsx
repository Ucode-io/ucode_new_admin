import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFAvatarUpload from "../../../../components/FormElements/HFAvatarUpload";
import HFTextField from "../../../../components/FormElements/HFTextField";
import Header from "../../../../components/Header";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import authService from "../../../../services/auth/authService";
import userService from "../../../../services/auth/userService";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box } from "@mui/material";
import { showAlert } from "../../../../store/alert/alert.thunk";

const UsersForm = () => {
  const navigate = useNavigate();
  const isUserInfo = useSelector((state) => state?.auth?.userInfo);
  const isUserId = useSelector((state) => state?.auth?.userId);
  const role = useSelector((state) => state?.auth?.roleInfo);
  const clientType = useSelector((state) => state?.auth?.clientType);
  const userTableSlug = useSelector((state) => state?.auth?.loginTableSlug);
  const projectId = useSelector((state) => state?.auth?.projectId);
  const [inputType, setInputType] = useState(true)
  const [passwordType, setPasswordType] = useState(true)
  const dispatch = useDispatch()
  const [inputMatch, setInputMatch] = useState(false)
  const [getError, setGetError] = useState(false)


  const update = (data) => {
    const oldPassword = data?.old_password;
    const newPassword = data?.new_password

    const requestData = {
      ...data,
      guid: isUserInfo?.id,
    };

    // if(newPassword || oldPassword) {
    //   resetPasswordV2(oldPassword, newPassword)
    // } else {
    //   delete requestData.confirm_password;
    // }

    userService
      ?.updateV2({
       ...requestData,
      })
      .then((res) => {
        if(newPassword || oldPassword) {
          resetPasswordV2(oldPassword, newPassword)
        } else {
          delete requestData.confirm_password;
        }
      })
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      login: "",
      phone: "",
      password: '',
      client_type_id: clientType?.id ?? "",
      role_id: role?.id ?? "",
    },
  });

  // const resetPassword = (newPassword) => {
  //   authService.resetPasswordProfile( {
  //     password: newPassword,
  //     user_id: isUserId
  //   }).then(() => {

  //   }).catch(err => {
  //     console.log('errrrrr', err)
  //     dispatch(showAlert(err))
  //   })
  // }

  const resetPasswordV2 = (oldPassword, newPassword) => {
    authService.resetUserPasswordV2( {
      password: newPassword,
      old_password: oldPassword,
      user_id: isUserId
    }).then((res) => {
      dispatch(showAlert("Password successfuly updated", "success"));
    }).catch((err) => {
      dispatch(showAlert("Something went wrong on changing password"))
    })
  }

  const onSubmit = (values) => {
    if(values?.new_password && values?.old_password) {
      if(values?.new_password !== values?.confirm_password) {
        dispatch(showAlert("Confirm Password fields do not match"))
        setInputMatch(true)
      } else if(isUserInfo) {
          update(values)
          setInputMatch(false)
          }
    } else if(isUserInfo) {
      update(values)
      setInputMatch(false)
    };
  };

  useEffect(() => {
    authService.getUserById(isUserId, { 'project-id': projectId, 'client-type-id': clientType?.id }).then((res) => {
      reset(res);
    });
  }, []);


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title="Profile"
          backButtonLink={-1}
          extra={
            <>
              <CancelButton onClick={() => navigate(-1)} />
              <SaveButton type="submit" />
            </>
          }
        ></Header>

        <FormCard title="Main info" className="UsersForm p-2">
          <div>
            <HFAvatarUpload control={control} name="photo_url" />
          </div>

          <div className="side">
            <FRow label="Name">
              <HFTextField
                placeholder="Enter name"
                fullWidth
                control={control}
                autoFocus
                name="name"
              />
            </FRow>

            <FRow label="Email">
              <HFTextField
                placeholder="Enter email"
                fullWidth
                control={control}
                name="email"
              />
            </FRow>

            <FRow label="Phone">
              <HFTextField
                placeholder="Enter phone"
                fullWidth
                control={control}
                name="phone"
              />
            </FRow>

            <FRow label="Login">
              <HFTextField
                placeholder="Enter login"
                fullWidth
                control={control}
                name="login"
              />
            </FRow>


            <FRow label="Type">
              <HFTextField
                placeholder="Type"
                fullWidth
                control={control}
                name="client_type_id"
                value={clientType?.name}
                disabled
              />
            </FRow>

            <FRow label="Role">
              <HFTextField
                placeholder="Role"
                fullWidth
                control={control}
                name="role_id"
                disabled
                value={role?.name}
              />
            </FRow>

            <FRow label="Old Password">
              <HFTextField
                placeholder="password"
                fullWidth
                control={control}
                name="old_password"
              />
            </FRow>

            <FRow style={{position: 'relative'}} label="New Password">
              <HFTextField
                placeholder="New Password"
                fullWidth
                control={control}
                name="new_password"
                type={inputType ? 'password' : 'text'}
              />

              <Box onClick={() => setInputType(!inputType)} sx={{position: 'absolute', right: '15px', bottom: '5px', cursor: 'pointer'}}>
                {inputType ? (
                  <VisibilityIcon/>
                ) : (
                  <VisibilityOffIcon/>
                )}
              </Box>

            </FRow>

            <FRow style={{position: 'relative'}} label="Confirm password">
              <HFTextField
                placeholder="confirm password"
                fullWidth
                control={control}
                name="confirm_password"
                type={passwordType ? 'password' : 'text'}
                style={{ border: `1px solid ${inputMatch ? 'red' : '#eee'}`}}
              />

              <Box onClick={() => setPasswordType(!passwordType)} sx={{position: 'absolute', right: '15px', bottom: '5px', cursor: 'pointer'}}>
                {passwordType ? (
                  <VisibilityIcon/>
                ) : (
                  <VisibilityOffIcon/>
                )}
              </Box>
            </FRow>

          </div>
        </FormCard>
      </form>
    </>
  );
};

export default UsersForm;
