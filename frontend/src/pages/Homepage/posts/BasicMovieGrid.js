import { Dialog, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getMoviesPage, getMovieById, searchMovies} from '../../../AxiosHook/MoviesApi'
import BasicMovieCard from './BasicMovieCard'




export default function BasicMovieGrid(props){
    const [movies,setMovies] = useState([])

    const navigate= useNavigate()
    //console.log(movies);
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
    const getMoviesBySearch= async (q)=>{
        try {
            const resp = await searchMovies(q)
            const searchedMovies = resp.data.map(movie=>movie.show)
            setMovies(searchedMovies)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if (props.movies){
            getMovies()
        }
        else if(props.search){
            getMoviesBySearch(props.search)
        }
        
    }, [props.search, props.movies])

    return <Grid sx={{flexDirection:'column', width:'100%'}}>
        {
            movies.map(movie=><BasicMovieCard key={movie.id} data={movie}  clb={()=>props.clb(movie)}/>)
        }
    </Grid>
}