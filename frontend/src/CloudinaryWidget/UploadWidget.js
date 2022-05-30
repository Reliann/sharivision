
import { IconButton } from '@mui/material';
import React, { useContext } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import AuthContext from '../context/context';


export default function UploadWidget(props){
  const {user} = useContext(AuthContext)
  const generateSigneture= async (callback, params_to_sign)=>{
    try{
      const res = await props.api.signUpload(params_to_sign)
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
      public_id:`${user.info._id}`,
      multiple:false,
      uploadSignature:generateSigneture
    },
    async (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Updating url in database...", result.info.secure_url);
        const resp = props.api.uploadAvatar(result.info.secure_url)
        if (resp.status === '200'){
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
      <IconButton onClick={()=>{myWidget.open()}}>
        <EditIcon/>
      </IconButton>
    </React.Fragment>
  )
}
