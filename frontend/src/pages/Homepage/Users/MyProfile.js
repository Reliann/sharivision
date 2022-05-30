import { Avatar, Box, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UploadWidget from '../../../CloudinaryWidget/UploadWidget'
import { useState } from "react";
import MoviesGrid from '../Movies/MoviesGrid'
export default function MyProfile(props){
    const [widget,setwidget]= useState(false)
    return(
        <Box>
            <Avatar alt={props.user.username} src={props.user.avatar}/>
            <Typography>
                {props.user.username}
            </Typography>
            <MoviesGrid api = {props.api} movies = {props.user.favorites}/>
        {<UploadWidget id = {props.user._id} api={props.api} successCallBack={()=>{}} failureCallBack={()=>{/*console.log("error uploading");*/}}/>}
        </Box>
    )
}