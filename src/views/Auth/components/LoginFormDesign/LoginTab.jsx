import React from 'react'
import HFTextFieldLogin from '../../../../components/FormElements/HFTextFieldLogin';
import { Box, Button, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import classes from './style.module.scss'
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';

function LoginTab({setFormType = () => {}, control, loading = false}) {
    const {t} = useTranslation();
  return (
   <>  
   <div className={classes.formRow}>
     <p className={classes.label}>{t("login")}</p>
     <HFTextFieldLogin
       required
       control={control}
       name="username"
       fullWidth
       placeholder={t("enter.login")}
       autoFocus
       InputProps={{
         startAdornment: (
           <InputAdornment position="start">
             <img src="/img/user-circle.svg" height={'23px'} alt="" />
           </InputAdornment>
         ),
       }}
     />
   </div>
   <div className={classes.formRow}>
     <p className={classes.label}>{t("password")}</p>
     <HFTextFieldLogin
       required
       control={control}
       name="password"
       type="password"
       fullWidth
       placeholder={t("enter.password")}
       InputProps={{
         startAdornment: (
           <InputAdornment position="start">
            <img src="/img/passcode-lock.svg" height={'23px'} alt="" />
           </InputAdornment>
         ),
       }}
     />
   </div>
       
       <Box sx={{display: "flex", alignItems: "center", justifyContent: 'flex-end', marginTop: "20px"}}>
          <Button
          sx={{fontSize: "14px", fontWeight: 600}}
            variant="text"
            type="button"
            onClick={() => {
                setFormType("LOGIN")
            }}>
            Забыли пароль?
          </Button>
       </Box>

       <PrimaryButton size="large" style={{width: "100%", marginTop: "20px", borderRadius: "8px"}} loader={loading}>
            {t("enter")}
        </PrimaryButton>

        <Box sx={{display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", marginTop: "20px"}}>
            <Box sx={{border: "1px solid #F2F4F7", width: "40%"}}></Box>
            <Box sx={{width: "20%", textAlign: "center", fontSize: "14px", color: "#475467"}}>Или</Box>
            <Box sx={{border: "1px solid #F2F4F7", width: "40%"}}></Box>
        </Box>

        <PrimaryButton size="large" style={{width: "100%", marginTop: "20px", background: "#fff", borderRadius: "8px",
             border: "1px solid #D0D5DD", color: "#344054", fontWeight: "600"}} loader={loading}>
            <img src="/img/google.svg" alt="" />
            Продолжить с Google
        </PrimaryButton>

        <PrimaryButton size="large" style={{width: "100%", marginTop: "20px", background: "#fff", borderRadius: "8px",
             border: "1px solid #D0D5DD", color: "#344054", fontWeight: "600"}} loader={loading}>
            <img src="/img/github.svg" alt="" />
            Продолжить с GitHub
        </PrimaryButton>

          <Box sx={{display: "flex", alignItems: "center", gap: "5px", marginTop: "24px", justifyContent: "center"}}>
            <p>У вас нет аккаунта?</p>
            <Box sx={{color: "#175CD3", fontSize: "14px"}}>Создайте его</Box>
         </Box>  


 </>
  )
}

export default LoginTab