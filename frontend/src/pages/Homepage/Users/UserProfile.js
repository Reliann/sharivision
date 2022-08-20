import { Avatar, Box, Button, Dialog, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import RecommendMovie from "../friends/RecommendMovie";
import ProgressButton from '../../utils/ProgressButton'
import TabPanel from "../../utils/TabPanel";
import MoviesGrid from "../Movies/MoviesGrid";


export default function UserProfile(props){
    const {username} = useParams()
    const navigate = useNavigate()
    username === props.loggedUser.username && navigate('../../MyProfile')

    const [user,setUser] = useState()
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
            const resp = await props.api.getUserByName(username)
            setUser(resp.data.resource)
        } catch (error) {
            navigate('../../404')
        }
    }

    useEffect (()=>{
        getUser()
    },[])

    if (!user){
        return <Typography>
            Loading...
        </Typography>
    }

    const isFriend = user?  props.loggedUser.friends.includes(user._id) : false
    const isFollowing = user?  props.loggedUser.following.includes(user._id) : false
    const isRequesting = user?  props.loggedUser.friendRequests.includes(user._id) : false
    const amRequesting =user? user.friendRequests.includes(props.loggedUser._id): false
    


    return(
        <Box >
            <Box sx={{display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Typography>
                    User {username}
                </Typography>
                    <Avatar src={user.avatar}/>
                <Typography>
                    {`followers: ${user.followers.length} following: ${user.following.length} friends: ${user.friends.length}`}
                </Typography>
                <Box sx={{display:'flex', flexDirection:'row'}}>
                    <ProgressButton onClick={async ()=>{
                                setFriendButton(true)
                                try {
                                    const resp = await isFriend?props.api.removeFriend(user._id):amRequesting?props.api.removeFriendshipRequest(user._id):props.api.requestFriendship(user._id)
                                    setUser(resp.data.resource)
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
                                const resp = isFollowing? await  props.api.unfollowUser(user._id): await props.api.followUser(user._id)
                                console.log(resp);
                                setUser(resp.data.resource)
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
                <RecommendMovie api={props.api} user = {props.loggedUser} friend={user} updateFriend={
                    (newResource)=>{
                        setUser({...newResource})
                    }
                }/>
            </Dialog>
            <Divider sx={{marginY:'2%'}}/>

            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Comments" {...a11yProps(1)} />
                <Tab label="Favorites" {...a11yProps(2)} />
            </Tabs>
            
            <TabPanel value={value} index={0}>
            Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
            Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
            <MoviesGrid api={props.api} movies={user.favorites}/>
            </TabPanel>
        </Box>
    )
}