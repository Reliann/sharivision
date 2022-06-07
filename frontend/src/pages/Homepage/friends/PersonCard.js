import { Avatar, IconButton, Paper, Typography, Box, Tooltip } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import BlockIcon from '@mui/icons-material/Block';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import RecommendIcon from '@mui/icons-material/Recommend';
import React from "react";

export default function PersonCard (props){
    return<Paper elevation={8} sx={{display:"flex", alignItems:"center", margin:"2%", padding:"2%"}}>
        <Tooltip title="View Profile">
            <Box sx={{display:"flex",alignItems:"center"}}>
                <Avatar src={props.info.avatar} sx={{margin:"5%"}}>{props.info.username.charAt(1)}</Avatar>
                <Typography component="h4" variant="h5">
                    {props.info.username}
                </Typography>
            </Box>
        </Tooltip>
        
        <Box sx={{ flexGrow: 2 }} />
        <Tooltip title={`Recommend a movie`}>
            <IconButton>
                <RecommendIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title={`Follow ${props.info.username}`}>
            <IconButton>
                <PersonAddIcon/>
            </IconButton>
        </Tooltip>
        
            
        <Tooltip title="Send Friend Request">
            <IconButton>
                <AddReactionIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title={`Block ${props.info.username}`}>
            <IconButton>
                <BlockIcon/>
            </IconButton>
        </Tooltip>
            
    </Paper>
}