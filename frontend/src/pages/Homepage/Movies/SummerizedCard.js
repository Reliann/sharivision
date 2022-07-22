import AddBox from "@mui/icons-material/AddBox";
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import { Avatar, Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

export default function SummerizedCard (props){
    const [isRec, setIsRec] = useState(props.friend?.recommended?.[props.data.id]?.includes(props.user._id))
    
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
                    isRec ? await props.api.removeRecommenation(props.data.id, props.friend._id): await props.api.recommendMovie(props.data.id, props.friend._id)
                    props.clb(`Movie ${isRec?'unrecommended':'recommended'}`)
                    setIsRec(!isRec)
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