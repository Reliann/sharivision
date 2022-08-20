import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UploadWidget from '../../../CloudinaryWidget/UploadWidget'
import { useState } from "react";
import MoviesGrid from '../Movies/MoviesGrid'
import DeleteIcon from '@mui/icons-material/Delete';

const overlayContainer={
    position: 'relative',
    width: '15vh',
    hieght:'15vh',
    maxWidth: '400px',
    
}
const overlay = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    opacity: 0,
    transition: '.3s ease',
    
    '&:hover':{
        'opacity':1
    }
}
const icon = {
    
        color: 'white',
        fontSize: '6vh',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        'msTransform': 'translate(-50%, -50%)',
        textAlign: 'center',
    
}
const overlayImg={
    width: '15vh', 
    height: '15vh',
}

export default function MyProfile(props){
    const [dialog,setDialog]= useState(false)


    return(
        <Grid container sx={{flexDirection:'column'}}>
            <Grid container alignItems="center">
                <Box sx={overlayContainer}>
                    <Avatar alt={props.user.username} src={props.user.avatar} sx={overlayImg}>
                        
                    </Avatar>
                    <IconButton  sx={overlay} onClick={()=>(setDialog(true))}>
                        <EditIcon sx={icon}/>
                    </IconButton>
                </Box>
            <Typography component="h2" variant="h2">
                {props.user.username}
            </Typography>
            </Grid>
            
            <Typography component="h3" variant="h4">
                your favorite movies:
            </Typography>
            
            <MoviesGrid api = {props.api} movies = {props.user.favorites}/>

            <Typography component="h3" variant="h4">
                your recommendations by friends:
            </Typography>
            <MoviesGrid api = {props.api} movies = {Object.keys(props.user.recommended)}/>
            <Typography component="h3" variant="h4">
                your watched shows:
            </Typography>
            <MoviesGrid api = {props.api} movies = {props.user.watchedList}/>
            <Dialog
                open={dialog}
                onClose={()=>(setDialog(false))}
            >
                <DialogTitle>
                    What do you want to do?
                </DialogTitle>
                {/* <DialogContent>
                    
                </DialogContent> */}
                <DialogActions>
                <UploadWidget id = {props.user._id} api={props.api} successCallBack={()=>{setDialog(false)}} failureCallBack={()=>{}}/>
                    {props.user.avatar&&<Button sx={{color:"fireBrick"}}
                        startIcon={<DeleteIcon/>}
                        onClick={async ()=>{
                            try{
                                const resp = await props.api.deleteAvatar()
                                //succses dialog
                            }catch (error){
                                //fail dialog
                                console.log(error)
                            }
                            
                        }}
                    >
                        Remove
                    </Button>}
                </DialogActions>
                
            </Dialog>
        </Grid>
    )
}