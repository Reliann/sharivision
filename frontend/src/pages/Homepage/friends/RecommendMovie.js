import Search from "@mui/icons-material/Search";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import SummerizedMoviesGrid from "../Movies/SummerizedMovieGris";



export default function RecommendMovie(props){
    const [search, setSearch] = useState('')
    
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
        <SummerizedMoviesGrid api={props.api} search = {search} friend = {props.friend} user={props.user}/>
        <Typography>
            Your Favorites
        </Typography>
        <SummerizedMoviesGrid api={props.api} movies = {props.user.favorites} friend = {props.friend} user={props.user}/>
        <Typography>
            Your Watched Movies
        </Typography>
        <SummerizedMoviesGrid api={props.api} movies = {props.user.watchedList} friend = {props.friend} user={props.user}/>
    </Box>
}