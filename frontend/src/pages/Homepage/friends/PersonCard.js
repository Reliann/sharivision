import { Avatar, IconButton, Paper, Typography, Box, Tooltip } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import RecommendIcon from '@mui/icons-material/Recommend';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PersonCard (props){

    const isFriend = props.user.friends.includes(props.info._id)
    const isFollowing = props.user.following.includes(props.info._id)
    console.log(props.user.following,props.info._id)
    const isRequesting = props.user.friendRequests.includes(props.info._id)
    const [amRequesting,setAmRequesting] = useState(props.info.friendRequests.includes(props.user._id))

    return<Paper elevation={8} sx={{width:'70%',display:"flex", alignItems:"center", margin:"2%", padding:"2%"}}>
        <Tooltip title="View Profile">
            <Box component={Link} to={`../../users/${props.info.username}`} sx={{ textDecoration: 'none' , color:'black',display:"flex",alignItems:"center"}}>
                <Avatar src={props.info.avatar} sx={{margin:"5%"}}>{props.info.username.charAt(1)}</Avatar>
                <Typography component="h4" variant="h5">
                    {props.info.username}
                </Typography>
            </Box>
        </Tooltip>
        
        <Box sx={{ flexGrow: 2 }} />
        {
            isFriend&&<Tooltip title={`Recommend a movie`}>
            <IconButton onClick={props.recommend}>
                <RecommendIcon/>
            </IconButton>
        </Tooltip>
        }
        {/* follow / unfollow */}
        <Tooltip title={`${isFollowing?'Unfollow':'Follow'} ${props.info.username}`}>
            <IconButton onClick={()=>(isFollowing?props.api.unfollowUser(props.info._id):props.api.followUser(props.info._id))}>
                {isFollowing? <PersonRemoveIcon/>:<PersonAddIcon/>}
            </IconButton>
        </Tooltip>
        
        {/* {send friend request} */}
        {(!isFriend&&!isRequesting&&!amRequesting)&&<Tooltip title = 'Send friend request'>
            <IconButton onClick={()=>{
                props.api.requestFriendship(props.info._id)
                setAmRequesting(true)
            }}>
                <AddReactionIcon/>
            </IconButton>
        </Tooltip>}
        {/* {cancle friend request} */}
        {(!isFriend&&amRequesting)&&<Tooltip title = 'Cancle friend request'>
            <IconButton onClick={async ()=>{
                await props.api.removeFriendshipRequest(props.info._id)
                setAmRequesting(false)
            }}>
                <RemoveCircleIcon/>
            </IconButton>
        </Tooltip>}
        {/* {remove friend} */}
        {(isFriend)&&<Tooltip title = 'Remove friend'>
            <IconButton onClick={()=>{
                props.api.removeFriend(props.info._id)
            }}>
                <ThumbDownAltIcon/>
            </IconButton>
        </Tooltip>}
        {/* {accept friend request} */}
        {(!isFriend&&isRequesting)&&<Tooltip title = 'Accept friend'>
            <IconButton onClick={()=>{
                props.api.requestFriendship(props.info._id)
            }}>
                <AddBoxIcon/>
            </IconButton>
        </Tooltip>}
        {/* {decline friend request} */}
        {(!isFriend&&isRequesting)&&<Tooltip title = 'Decline friend request'>
            <IconButton onClick={()=>{
                props.api.removeFriendshipRequest(props.info._id)
            }}>
                <RemoveCircleIcon/>
            </IconButton>
        </Tooltip>}

        <Tooltip title={`Block ${props.info.username}`}>
            <IconButton disabled>
                <BlockIcon/>
            </IconButton>
        </Tooltip>
            
    </Paper>
}