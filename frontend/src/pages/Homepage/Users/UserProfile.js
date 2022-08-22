import { Avatar, Box, Button, Dialog, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import RecommendMovie from "../friends/RecommendMovie";
import ProgressButton from '../../utils/ProgressButton'
import TabPanel from "../../utils/TabPanel";
import MoviesGrid from "../Movies/MoviesGrid";
import AuthContext from "../../../context/context";
import PostGrid from '../../Homepage/posts/PostGrid'

export default function UserProfile(){
    const {user, followUser, unfollowUser, getUserByName,
        removeFriend, removeFriendshipRequest, requestFriendship,
        getPostsByUser,} = useContext(AuthContext)
    const {username} = useParams()
    const navigate = useNavigate()
    const [posts,setPosts] = useState([])
    username === user.username && navigate('../../MyProfile')

    const [viewUser,setViewUser] = useState()
    const [recOpen,setRecOpen] = useState(false)
    const [followButton, setFollowButton] = useState(false)
    const [friendButton, setFriendButton] = useState(false)
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    const a11yProps = (index)=> {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }
    const getUser = async ()=>{
        try {
            const resp = await getUserByName(username)
            setViewUser(resp.data.resource)
        } catch (error) {
            navigate('../../404')
        }
        
    }
    const getPosts = async()=>{
        if (!viewUser) return

        try {
            const resp = await getPostsByUser(viewUser._id)
            setPosts(resp.data.resource)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect (()=>{
        getUser()
    },[])
    useEffect (()=>{
        getPosts()
    },[viewUser])
    
    
    if (!viewUser){
        return <Typography>
            Loading...
        </Typography>
    }

    const isFriend = user?  user.friends.includes(viewUser._id) : false
    const isFollowing = user?  user.following.includes(viewUser._id) : false
    const isRequesting = user?  user.friendRequests.includes(viewUser._id) : false
    const amRequesting =user? viewUser.friendRequests.includes(user._id): false
    


    return(
        <Box >
            <Box sx={{display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Typography>
                    User {username}
                </Typography>
                    <Avatar src={viewUser.avatar}/>
                <Typography>
                    {`followers: ${viewUser.followers.length} following: ${viewUser.following.length} friends: ${viewUser.friends.length}`}
                </Typography>
                <Box sx={{display:'flex', flexDirection:'row'}}>
                    <ProgressButton onClick={async ()=>{
                                setFriendButton(true)
                                try {
                                    const resp =  isFriend?await removeFriend(viewUser._id):await amRequesting?await removeFriendshipRequest(viewUser._id):await requestFriendship(viewUser._id)
                                    setViewUser(resp.data.resource)
                                }  
                                catch (error) {
                                    console.log(error);
                                }
                                setFriendButton(false)
                            }}
                    loading={friendButton} text={isFriend?'Unfriend':isRequesting?'Accept Request':amRequesting?'Undo Request':'Send Request'}/>
                        
                    <ProgressButton onClick={async ()=>{
                            setFollowButton(true)
                            try {
                                const resp = isFollowing? await  unfollowUser(viewUser._id): await followUser(viewUser._id)
                                console.log(resp);
                                setViewUser(resp.data.resource)
                            }  
                            catch (error) {
                                console.log(error);
                            }
                            setFollowButton(false)
                        }} loading={followButton} text={isFollowing?'Unfollow':'Follow'}/>
                
            </Box>
            {isFriend&&<Button onClick={()=>(setRecOpen(true))} variant='outlined' sx={{width:'50%'}}>
                    Recommend A movie
                </Button>}
        </Box>
            
            {/* show user's recent posts and comments */}
            <Dialog open={recOpen} onClose={()=>{setRecOpen(false)}} sx={{zIndex:'1401',padding:'1%',position: "absolute", overflowY: "scroll", maxHeight: "90%"}}>
                <RecommendMovie friend={user} updateFriend={
                    (newResource)=>{
                        setViewUser({...newResource})
                    }
                }/>
            </Dialog>
            <Divider sx={{marginY:'2%'}}/>

            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} onClick={getPosts}/>
                <Tab label="Comments" {...a11yProps(1)} />
                <Tab label="Favorites" {...a11yProps(2)} />
            </Tabs>
            
            <TabPanel value={value} index={0}>
                <PostGrid posts={posts} />
            </TabPanel>
            <TabPanel value={value} index={1}>
            Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                <MoviesGrid movies={viewUser.favorites}/>
            </TabPanel>
        </Box>
    )
}