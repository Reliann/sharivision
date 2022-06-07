import { Box, Typography } from "@mui/material";
import MoviesGrid from "./Movies/MoviesGrid";

export default function WatchList(props){
    return(
        <Box>
            <Typography component="h3" variant="h4">
                your watch list:
            </Typography>
            <MoviesGrid api = {props.api} movies = {props.user.watchList}/>
        </Box>
    )
}