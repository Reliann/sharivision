import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UploadWidget from '../../../CloudinaryWidget/UploadWidget'
import { useContext, useState } from "react";
import MoviesGrid from '../Movies/MoviesGrid'
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from "../../../context/context";

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
    const {user, deleteAvatar}  = useContext(AuthContext)

    return(
        <Grid container sx={{flexDirection:'column'}}>
            <Grid container alignItems="center">
                <Box sx={overlayContainer}>
                    <Avatar alt={user.username} src={user.avatar} sx={overlayImg}>
                        
                    </Avatar>
                    <IconButton  sx={overlay} onClick={()=>(setDialog(true))}>
                        <EditIcon sx={icon}/>
                    </IconButton>
                </Box>
            <Typography component="h2" variant="h2">
                {user.username}
            </Typography>
            </Grid>
            
            <Typography component="h3" variant="h4">
                your favorite movies:
            </Typography>
            
            <MoviesGrid  movies = {user.favorites}/>

            <Typography component="h3" variant="h4">
                your recommendations by friends:
            </Typography>
            <MoviesGrid movies = {Object.keys(user.recommended)}/>
            <Typography component="h3" variant="h4">
                your watched shows:
            </Typography>
            <MoviesGrid  movies = {user.watchedList}/>
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
                <UploadWidget id = {user._id} successCallBack={()=>{setDialog(false)}} failureCallBack={()=>{}}/>
                    {user.avatar&&<Button sx={{color:"fireBrick"}}
                        startIcon={<DeleteIcon/>}
                        onClick={async ()=>{
                            try{
                                const resp = await deleteAvatar()
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