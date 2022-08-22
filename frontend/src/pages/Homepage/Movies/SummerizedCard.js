import AddBox from "@mui/icons-material/AddBox";
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import { Avatar, Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { useContext, useState } from "react";
import AuthContext from "../../../context/context";

export default function SummerizedCard (props){
    const {user, removeRecommenation, recommendMovie} = useContext(AuthContext)
    console.log(user,7);
    const isRec = props.friend?.recommended?.[props.data.id]?.includes(user._id)
    
    return <Paper sx={{display:'flex', flexDirection:'row', marginY:'2%'}}>
        <Avatar variant="square" src={`${props.data.image?.medium||
        'https://via.placeholder.com/200x300?text=No+image+available'}`}/>
        <Typography gutterBottom variant="h5" component="div">
            {props.data.name}
        </Typography>
        <Box sx={{flexGrow:1}}/>
        <Tooltip title={`${isRec?'Unrecommend':'Recommend'} ${props.data.name}`}>
            <IconButton onClick={async ()=>{
                try {
                    const resp =  isRec ? await removeRecommenation(props.data.id, props.friend._id):await recommendMovie(props.data.id, props.friend._id)
                    props.updateFriend(resp.data.resource)
                    props.clb(`Movie ${isRec?'unrecommended':'recommended'}`)
                    
                } catch (error) {
                    console.log(error);
                    props.clb('Oops')
                }
            }}>
                {isRec ? <RemoveCircle/>:<AddBox/>}
            </IconButton>
        </Tooltip>
    </Paper>
}