import { Box, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getMovieById } from "../../../../AxiosHook/MoviesApi";
import AuthContext from "../../../../context/context";

export default function MoviePage(){
    const {user} = useContext(AuthContext)
    const {id} = useParams()
    const [movie,setMovie] = useState({})
    const navigate = useNavigate()
    const getMovie = async()=>{
        try{
            const resp = await getMovieById(id)
            setMovie(resp.data)
        }
        catch (error){
            console.log(error);
            navigate('404')
        }
    }
    useEffect(()=>{
        getMovie()
    },[])
    console.log(movie)
    if (!movie?.name){
        return <Box></Box>
    }
    return <Box>
        
        <Paper sx={{display:'flex', flexDirection:'row', padding:'2%'}}>
            <Box component='img' src={movie?.image?.medium} alt='no image found'/>
            <Box  sx={{margin:'2%'}}>
                <Typography component='h2' variant='h2'>
            {movie.name}
            </Typography>
            <Typography>
                {movie.summary.substring(3,movie.summary.length-4)}
            </Typography>
            </Box>
            
        </Paper>
        <b>Genres: </b>{movie.genres.map((g,i)=>(`${i!==0?',':''} ${g}`))}
    </Box>
}