import { Avatar, Box, Button, Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecommendMovie from "../friends/RecommendMovie";
import ProgressButton from '../../utils/ProgressButton'

export default function UserProfile(props){
    const {username} = useParams()
    const [user,setUser] = useState()
    const [recOpen,setRecOpen] = useState(false)
    const [followButton, setFollowButton] = useState(false)
    const navigate = useNavigate()

    const isFriend = user?  props.loggedUser.friends.includes(user._id) : false
    const isFollowing = user?  props.loggedUser.following.includes(user._id) : false
    const isRequesting = user?  props.loggedUser.friendRequests.includes(user._id) : false
    const [amRequesting,setAmRequesting] =   useState(user? user.friendRequests.includes(props.loggedUser._id): false)

    console.log(props.loggedUser, user);

    const getUser = async ()=>{
        try {
            const resp = await props.api.getUserByName(username)
            setUser(resp.data)
            console.log(resp.data);
        } catch (error) {
            navigate('404')
        }
    }

    useEffect (()=>{
        getUser()
    },[])
    if (!user){
        return 'loading...'
    }
    return(
        <Box>
            <Box>
                <Typography>
                    User {username}
                    {props.loggedUser.username}
                </Typography>
                <Avatar src={user.avatar}/>
            </Box>
            <Box>
            <Typography>
                {`followers: ${user.followers.length} following: ${user.following.length} friends: ${user.friends.length}`}
            </Typography>
            </Box>
            <Box>
                <Button>
                    Add friend
                </Button>
                <Button>
                    Follow
                </Button>
                <ProgressButton onClick={async ()=>{
                        setFollowButton(true)
                        try {
                            const resp = await isFollowing?props.api.unfollowUser(user._id):props.api.followUser(user._id)
                            getUser()
                        }  
                        catch (error) {
                            console.log(error);
                        }
                        setFollowButton(false)
                    }}
                    loading={followButton} text={isFollowing?'Unfollow':'Follow'}/>
                <Button onClick={()=>(setRecOpen(true))}>
                    Recommend
                </Button>
            </Box>
            {/* show user's recent posts and comments */}
            <Dialog open={recOpen} onClose={()=>{setRecOpen(false)}} sx={{zIndex:'1401',padding:'1%',position: "absolute", overflowY: "scroll", maxHeight: "90%"}}>
                <RecommendMovie api={props.api} user = {props.loggedUser} friend={user} updateFriend={
                    (movie)=>{
                        setUser({...user,recommended:{...user.recommended,[movie]:props.loggedUser._id}})
                    }
                }/>
            </Dialog>
        </Box>
    )
}