import { Box, Grid } from "@mui/material";
import MovieCard from "./MovieCard";
import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";

import {getMoviesPage, getMovieById} from '../../../AxiosHook/MoviesApi'
import AuthContext from "../../../context/context";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function MoviesGrid(props){
    const [movies,setMovies] = useState([])
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const getRandomPage = async()=>{
        // api has 240 pages
        const page = getRandomInt(240)
        try {
            const resp = await getMoviesPage(page)
            setMovies(resp.data)
        } catch (error) {
            console.log(error);
            navigate('error')
        }
    }
    const getMovies = async ()=>{
        const fullmovies_promises = props.movies.flatMap(async (movieId)=>{
            try{
                const resp = await getMovieById(movieId)
                return resp.data
            }
            catch (error){
                console.log(error);
                navigate('error')
            }
        })
        const fullmovies = await Promise.all(fullmovies_promises)
        setMovies(fullmovies)
    }
    useEffect(()=>{
        if (props.movies){
            getMovies()
        }else{
            getRandomPage()
        }
    },[])
    
    return <Grid container sx={{justifyContent:'center'}}>
        {
            
            movies.slice(0,20).map(movie=>{
                const favorite = user.info.favorites.includes(movie.id)
                return <Grid item key={movie.id} sx={{margin:'5px'}}>
                    <MovieCard data={movie} favorite={favorite} clickOnFavrite={()=>{
                        if (favorite){     // TODO: add are you sure pop up
                            props.api.removeMovieFromFavorites(movie.id)
                        }else{
                            props.api.addMovieToFavorites(movie.id)
                        }
                    }}
                    />
                </Grid>
                })
        }
    </Grid>
}