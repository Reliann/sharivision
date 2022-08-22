import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import AuthContext from "../../context/context";
import MoviesGrid from "./Movies/MoviesGrid";

export default function WatchList(){
    const {user} = useContext(AuthContext)
    return(
        <Box>
            <Typography component="h3" variant="h4">
                your watch list:
            </Typography>
            <MoviesGrid movies = {user.watchList}/>
        </Box>
    )
}