import Search from "@mui/icons-material/Search";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import BasicMovieGrid from "./BasicMovieGrid";




export default function ChooseMovieList(props){
    const [search, setSearch] = useState('')
    
    const searchMovies = async (e)=>{
        e.preventDefault()
        setSearch(e.target.elements.search.value)
    }
    return <Box sx={{padding:'2%',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        {/* searchbox for movies */}
        <Typography>
                Choose Movie
        </Typography>
        <Box component='form' onSubmit={searchMovies} sx={{ display:'flex',alignItems:'center'}}>
            <TextField defaultValue={''} name='search' type='search'/>
            <Button type='submit' startIcon={<Search/>}>Search</Button>
        </Box>
        <BasicMovieGrid clb={props.clb}  search = {search} friend = {props.friend}  updateFriend = {props.updateFriend}/>
        <Typography>
            Your Favorites
        </Typography>
        <BasicMovieGrid clb={props.clb}  movies = {props.user.favorites} friend = {props.friend}  updateFriend = {props.updateFriend}/>
        <Typography>
            Your Watched Movies
        </Typography>
        <BasicMovieGrid clb={props.clb}  movies = {props.user.watchedList} friend = {props.friend}  updateFriend = {props.updateFriend}/>
    </Box>
}