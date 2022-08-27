import { Avatar, IconButton, Paper, Typography, Box, Tooltip, Dialog } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import RecommendIcon from '@mui/icons-material/Recommend';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecommendMovie from "./RecommendMovie";
import AuthContext from "../../../context/context";

export default function PersonCard (props){
    const [recDialog,setRecDialog] = useState(false)
    const [errDialog,setErrDialog] = useState('')
    const {user,followUser, unfollowUser, getUserByName,
        removeFriend, removeFriendshipRequest, requestFriendship} = useContext(AuthContext)
    const isFriend = user.friends.includes(props.info._id)
    const isFollowing = user.following.includes(props.info._id)
    const isRequesting = user.friendRequests.includes(props.info._id)
    //const [amRequesting,setAmRequesting] = useState(props.info.friendRequests.includes(user._id))
    const amRequesting=user? props.info.friendRequests.includes(user._id): false

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
            <IconButton onClick={()=>setRecDialog(true)}>
                <RecommendIcon/>
            </IconButton>
        </Tooltip>
        }
        {/* follow / unfollow */}
        <Tooltip title={`${isFollowing?'Unfollow':'Follow'} ${props.info.username}`}>
            <IconButton onClick={async()=>{
                try {
                    const resp = isFollowing? await unfollowUser(props.info._id):await followUser(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
            }}>
                {isFollowing? <PersonRemoveIcon/>:<PersonAddIcon/>}
            </IconButton>
        </Tooltip>
        
        {/* {send friend request} */}
        {(!isFriend&&!isRequesting&&!amRequesting)&&<Tooltip title = 'Send friend request'>
            <IconButton onClick={async ()=>{
                try {
                    const resp = await requestFriendship(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
                
            }}>
                <AddReactionIcon/>
            </IconButton>
        </Tooltip>}
        {/* {cancle friend request} */}
        {(!isFriend&&amRequesting)&&<Tooltip title = 'Cancle friend request'>
            <IconButton onClick={async ()=>{
                try {
                    const resp = await removeFriendshipRequest(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
                
            }}>
                <RemoveCircleIcon/>
            </IconButton>
        </Tooltip>}
        {/* {remove friend} */}
        {(isFriend)&&<Tooltip title = 'Remove friend'>
            <IconButton onClick={async()=>{
                
                try {
                    const resp = await removeFriend(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
            }}>
                <ThumbDownAltIcon/>
            </IconButton>
        </Tooltip>}
        {/* {accept friend request} */}
        {(!isFriend&&isRequesting)&&<Tooltip title = 'Accept friend'>
            <IconButton onClick={async()=>{
                try {
                    const resp = await requestFriendship(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
                
            }}>
                <AddBoxIcon/>
            </IconButton>
        </Tooltip>}
        {/* {decline friend request} */}
        {(!isFriend&&isRequesting)&&<Tooltip title = 'Decline friend request'>
            <IconButton onClick={async()=>{
                try {
                    const resp = await removeFriendshipRequest(props.info._id)
                    props.updateFriend(resp.data.resource)
                } catch (error) {
                    console.log(error);
                    setErrDialog('Oops!')
                }
                
            }}>
                <RemoveCircleIcon/>
            </IconButton>
        </Tooltip>}

        <Tooltip title={`Block ${props.info.username}`}>
            <IconButton disabled>
                <BlockIcon/>
            </IconButton>
        </Tooltip>
        
            
        <Dialog open={recDialog} onClose={()=>setRecDialog(false)} sx={{zIndex:'1401',padding:'1%',position: "absolute", overflowY: "scroll", maxHeight: "90%"}}>
            <RecommendMovie friend={props.info} updateFriend={props.updateFriend}/>
        </Dialog>
        <Dialog open={errDialog?true:false} onClose={()=>setErrDialog('')}>
            <Typography>
                {errDialog}
            </Typography>
        </Dialog>
    </Paper>
}