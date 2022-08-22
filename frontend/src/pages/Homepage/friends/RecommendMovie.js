import Search from "@mui/icons-material/Search";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useContext, useState } from "react";
import AuthContext from "../../../context/context";
import SummerizedMoviesGrid from "../Movies/SummerizedMovieGris";



export default function RecommendMovie(props){
    const [search, setSearch] = useState('')
    const {user}  = useContext(AuthContext)
    const searchMovies = async (e)=>{
        e.preventDefault()
        setSearch(e.target.elements.search.value)
    }
    return <Box sx={{padding:'2%',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        {/* searchbox for movies */}
        <Typography>
                {`Reccomend movie to ${props.friend.username}`}
        </Typography>
        <Box component='form' onSubmit={searchMovies} sx={{ display:'flex',alignItems:'center'}}>
            <TextField defaultValue={''} name='search' type='search'/>
            <Button type='submit' startIcon={<Search/>}>Search</Button>
        </Box>
        <SummerizedMoviesGrid  search = {search} friend = {props.friend} updateFriend = {props.updateFriend}/>
        <Typography>
            Your Favorites
        </Typography>
        <SummerizedMoviesGrid  movies = {user.favorites} friend = {props.friend} updateFriend = {props.updateFriend}/>
        <Typography>
            Your Watched Movies
        </Typography>
        <SummerizedMoviesGrid  movies = {user.watchedList} friend = {props.friend}  updateFriend = {props.updateFriend}/>
    </Box>
}