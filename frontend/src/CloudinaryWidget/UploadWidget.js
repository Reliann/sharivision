
import { Button } from '@mui/material';
import React, { useContext } from 'react'
import AuthContext from '../context/context';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function UploadWidget(props){
  const {user, signUpload, uploadAvatar} = useContext(AuthContext)
  const generateSigneture= async (callback, params_to_sign)=>{
    try{
      const res = await signUpload(params_to_sign)
      if (res.status ==="200"){
        console.log(res);
        callback(res.data.signature)
      }
      else{
        console.log(res);
        callback(res.data.signature)
      }
    }catch (error){
      console.log(error)
    }
  }
  
  const myWidget = window.cloudinary.createUploadWidget(
    {
      cloudName: "sharivision",
      uploadPreset: "avatars",
      api_key:"589975187121882",
      //cropping:true,
      public_id:`${user._id}`,
      multiple:false,
      uploadSignature:generateSigneture
    },
    async (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Updating url in database...", result.info.secure_url);
        const resp = await uploadAvatar(result.info.secure_url)
        if (resp.status == 200){
          console.log("avatar updated!")
          props.successCallBack()
        }else {
          console.log('error updating image',resp)
          props.failureCallBack()
        }
      }else{
        console.log(error, result);
        props.failureCallBack()
      }
    }
  );


  return (
    <React.Fragment>
      <Button onClick={()=>{myWidget.open()}}
        startIcon={<FileUploadIcon/>}
      >
        Upload
      </Button>
    </React.Fragment>
  )
}
