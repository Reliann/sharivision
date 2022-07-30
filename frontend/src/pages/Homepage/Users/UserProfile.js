import { Avatar, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function UserProfile(props){
    const {username} = useParams()
    const [user,setUser] = useState()
    const navigate = useNavigate()
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
                <Button>
                    Recommend
                </Button>
            </Box>
            {/* show user's recent posts and comments */}
        </Box>
    )
}