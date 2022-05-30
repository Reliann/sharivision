import { Avatar, Box, Button, Checkbox, Divider, FormControlLabel, FormHelperText, IconButton, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import GoogleLoginButton from "../Login/GoogleLogin";
import useAxios from "../../AxiosHook/useAxios";

export default function Signup(){
    const [values, setValues] = useState({
        username:"",
        password:"",
        email:"",
        passwordValidation:"",
        remember:true,
        showPassword:false
    })
    const {register} = useAxios()
    const [message,setMessage] = useState({
        username:"",
        password:"",
        email:"",
        passwordValidation:"",
        msg:""
    })
    const handleValueChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setMessage({...message,msg:"",[prop]:""})
    }
    const handleShowPasswordClick = () => {
        setValues({...values, showPassword: !values.showPassword})
    }
    const submitForm = async(e)=>{
        e.preventDefault()
        if (values.passwordValidation!==values.password){
            setMessage({...message,passwordValidation:"passwords dont match"})
            return
        }
        const {showPassword,...registrationData} = values
        try {
            await register(registrationData)
        } catch (error) {
            if ([400,404].includes(error.response.status)){
                setMessage(error.response.data)
            }
        }
    }
    return(
        <Box sx={{marginX:"3vw", marginY:"5vh", display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.light' ,width:"12vh", height:"12vh"}}>
                <LockOutlinedIcon fontSize="large"/>
            </Avatar>
            <Typography variant="h2" component="h1" sx={{textAlign:"center"}}>
                Signup
            </Typography>
            <Box component="form" onSubmit={submitForm} noValidate sx={{display:"flex", flexDirection:"column"}}>
                <TextField
                    fullwidth
                    margin="normal"
                    error={Boolean(values.username === ""|| message.username)}
                    helperText={message.username}
                    label="Username"
                    autoComplete="username"
                    value ={values.username}
                    required
                    onChange={handleValueChange('username')}
                    variant="filled"
                />
                <TextField
                    margin="normal"
                    label="Email"
                    error={Boolean(values.email === ""|| message.email)}
                    helperText={message.email}
                    autoComplete="email"
                    value ={values.email}
                    required
                    onChange={handleValueChange('email')}
                    variant="filled"
                />
                <TextField 
                    variant="filled"
                    margin="normal"
                    label = "Password"
                    error={Boolean(values.password === ""|| message.password)}
                    helperText={message.password}
                    autoComplete="new-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    required
                    onChange={handleValueChange('password')}
                    InputProps={{
                        endAdornment: <IconButton
                            onClick={handleShowPasswordClick}
                            edge="end"
                        >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    }}
                />
                <TextField 
                    variant="filled"
                    margin="dense"
                    error={Boolean(values.passwordValidation === ""|| message.passwordValidation)}
                    helperText={message.passwordValidation}
                    label = "Password validation"
                    autoComplete="new-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.passwordValidation}
                    required
                    onChange={handleValueChange('passwordValidation')}
                />
                <FormControlLabel
                    control={<Checkbox checked={values.remember} onChange={()=>setValues({...values,remember:!values.remember})} color="primary" />}
                    label="Remember Me"
                />
                <FormHelperText error>{'*Required Field'}</FormHelperText>
                <Button type="submit" variant="contained">
                    Register
                </Button>
                <Typography variant="subtitle1">
                    Already have an account? <Link href="/login"> Login</Link>
                </Typography>
            </Box> 
            <Divider  style={{width:'100%', margin:"2vh"}}>Or</Divider>
            <GoogleLoginButton register={true}/>
        </Box>
    )
}