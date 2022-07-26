import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";


export default function UserProfile(props){
    const {username} = useParams()
    
    return(
        <Box>
            <Typography>
                User {username}
                {props.loggedUser.username}
            </Typography>
        </Box>
    )
}