import { Dialog, Grid } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getMoviesPage, getMovieById, searchMovies} from '../../../AxiosHook/MoviesApi'
import SummerizedCard from './SummerizedCard'


export default function SummerizedMoviesGrid(props){
    const [movies,setMovies] = useState([])
    const [msg,setMsg] = useState('')
    const navigate= useNavigate()
    console.log(movies);
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

    return <Grid sx={{flexDirection:'column'}}>
        {
            movies.map(movie=><SummerizedCard clb ={m=>setMsg(m)} key={movie.id} data={movie} api = {props.api} friend= {props.friend}/>)
        }
        <Dialog open={msg} onClose={()=>setMsg('')}>
            {msg}
        </Dialog>
    </Grid>
}