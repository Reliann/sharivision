import { Avatar, Box, Button, Checkbox, Divider, FormControlLabel, FormHelperText, IconButton, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GoogleLoginButton from "./GoogleLogin";
import useAxios from "../../AxiosHook/useAxios";


export default function Login(){
    
    const [values, setValues] = useState({
        password:"",
        email:"",
        remember:true,
        showPassword:false
    })
    const [message,setMessage] = useState({
        email:"",
        password:"",
        msg:""
    })
    const {login} = useAxios()

    const handleValueChange = (prop) => (event) => {
        setMessage({...message,[prop]:"", msg:""})
        setValues({ ...values, [prop]: event.target.value });
    }
    const handleShowPasswordClick = () => {
        setValues({...values, showPassword: !values.showPassword})
    }
    const submitForm = async (e)=>{
        e.preventDefault()
        const {showPassword,...credentials} = values
        try {
            await login(credentials)
        } catch (error) {
            if ([400,404].includes(error.response.status)){
                setMessage({...message,...error.response.data})
            }
        }        
    }

    return(
        <Box sx={{marginX:"3vw", marginY:"5vh", display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.light' ,width:"12vh", height:"12vh"}}>
                <LockOutlinedIcon fontSize="large"/>
            </Avatar>
            <Typography variant="h2" component="h1" sx={{textAlign:"center"}}>
                Login
            </Typography>
            <Box component="form" onSubmit={submitForm} noValidate sx={{display:"flex", flexDirection:"column"}}>
                <TextField
                    margin="normal"
                    fullWidth
                    error={(message.email?true:false || values.email?false:true)}
                    helperText={message.email}
                    label="Email or Username"
                    autoComplete="email"
                    value ={values.username}
                    required
                    onChange={handleValueChange('email')}
                    variant="filled"
                />
                <TextField 
                    variant="filled"
                    margin="normal"
                    label = "Password"
                    fullWidth
                    error={(message.password?true:false || values.password?false:true)}
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
                <FormControlLabel
                    control={<Checkbox checked={values.remember} onChange={()=>setValues({...values,remember:!values.remember})} color="primary" />}
                    label="Remember Me"
                />
                <FormHelperText error>{'*Required Field'}</FormHelperText>
                <FormHelperText>{message.msg}</FormHelperText>
                <Button type="submit" variant="contained">
                    Login
                </Button>
                Don't have an account? <Link href="/signup"> Signup</Link>
            </Box>
            <Divider  style={{width:'100%', margin:"2vh"}}>Or</Divider>
            <GoogleLoginButton/>
        </Box>
    )
}