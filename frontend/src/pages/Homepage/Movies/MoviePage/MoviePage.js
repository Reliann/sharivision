import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getMovieById } from "../../../../AxiosHook/MoviesApi";

export default function MoviePage(props){
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
        <Typography component='h2' variant='h2'>
            {movie.name}
        </Typography>
        {props.user._id}
        <Box component='img' src={movie?.image?.medium} alt='no image found'/>
        
    </Box>
}