import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";


export default function UserProfile(props){
    const {userId} = useParams()
    
    return(
        <Box>
            <Typography>
                User {userId}
                {props.loggedUser&& props.loggedUser._id}
            </Typography>
        </Box>
    )
}