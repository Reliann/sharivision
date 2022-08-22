import {GoogleLogin} from 'react-google-login'
import GoogleIcon from '@mui/icons-material/Google';
import { Button, Checkbox, Dialog, FormControlLabel, FormHelperText, TextField, Typography } from '@mui/material';
import useAxios from '../../AxiosHook/useAxios';
import React, { useContext, useState } from 'react';
import { Box } from '@mui/system';
import AuthContext from '../../context/context';

// google button component that will log/ register user accourdingly

export default function GoogleLoginButton(){
    const {googleLogin} = useContext(AuthContext)
    const [token,setToken] = useState(null)
    const [values,setValues] = useState({
        username:"",
        remember:true
    })
    const [messege,setMessege]=useState()
    const doGoogleLogin = async()=>{
        try {
            await googleLogin({tokenId:token, ...values})
        } catch (error) {
            if(error?.response.status === 400){
                setMessege(error.response.data.msg)
            }
        }
    }
    const googleSuccess = async (res)=>{
        const token = res?.tokenId
        try {
            await googleLogin({tokenId:token,...values})
        } catch (error) {
            if (error?.response.status === 404){
                // registration it is
                setToken(token)
            }
        }
    }
    const googleFailure = (error)=>{
        console.log(error);
    }
    const handleChange = (prop)=>(e)=>{
        setValues({...values, [prop]:e.target.value})
    }
    return(
        <React.Fragment>
            <GoogleLogin
                clientId="978362655386-qed78df5f23k0v7upad7fajuop2ts8ce.apps.googleusercontent.com"
                render={(renderProps)=>(
                    <Button variant="contained"
                    onClick={renderProps.onClick} 
                    disabled={renderProps.disabled}
                    endIcon={<GoogleIcon/>}> Login with Google </Button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
            />
            <Dialog open={token?true:false} onClose={()=>setToken(null)}>
                <Box component="form" onSubmit={(e)=>{e.preventDefault();doGoogleLogin()}} sx={{
                    display:"flex",
                    flexDirection:"column",
                    padding:"2%"
                }}>
                    <Typography>
                        Pick your username:
                    </Typography>
                    <TextField
                        margin="normal"
                        value={values.username}
                        onChange={handleChange('username')}
                    />
                    <FormControlLabel
                        control={<Checkbox 
                        checked={values.remember} 
                        onChange={()=>setValues({...values,remember:!values.remember})} color="primary" />}
                        label="Remember Me"
                    />
                    <FormHelperText error>{messege}</FormHelperText>
                    <Button type="submit">
                        Register
                    </Button>
                </Box>
            </Dialog>
        </React.Fragment>
    )
}