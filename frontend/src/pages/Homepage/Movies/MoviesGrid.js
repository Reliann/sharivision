import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from "@mui/material";
import MovieCard from "./MovieCard";
import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";

import {getMoviesPage, getMovieById, searchMovies} from '../../../AxiosHook/MoviesApi'
import AuthContext from "../../../context/context";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function MoviesGrid(props){
    const [movies,setMovies] = useState([])
    const [open, setOpen] = useState(false)
    const [friendsDialog,setFriendsDialog] = useState(false)
    const [message, setMessage] = useState("")
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
        else{
            getRandomPage()
        }
    },[props.movies,props.search,props.refresh])

    // useEffect(()=>{
    //     if (props.search){
    //         getMoviesBySearch(props.search)
    //     }
    // },[props.search])
    if ((props.movies&& props.movies.length ===0)|| (props.search && movies.length===0)){
        return <Box>
            nothing to see here...
        </Box>
    }
    return <Grid container sx={{justifyContent:'center'}}>
        {
            
            movies.slice(0,20).map(movie=>{
                const favorite = user.info.favorites.includes(movie.id.toString())
                const watched = user.info.watchedList.includes(movie.id.toString())
                const toWatch = user.info.watchList.includes(movie.id.toString())
                return <Grid item key={movie.id} sx={{margin:'5px'}}>
                    <MovieCard data={movie} favorite={favorite} watched={watched} toWatch={toWatch}
                    clickOnFavorite={async ()=>{
                        try{
                            if (favorite){     // TODO: add are you sure pop up
                                await props.api.removeMovieFromFavorites(movie.id)
                                setMessage("Movie removed from favotites!")
                            }else{
                                await props.api.addMovieToFavorites(movie.id)
                                setMessage("Movie added to favorites!")
                            }
                        }catch (error){
                            setMessage("Ooops!")
                        }
                        // dialog will be openned either way...
                        setOpen(true)
                        
                    }}
                    clickOnWatched={
                        async ()=>{
                            try{
                                if (watched){
                                    await props.api.removeMovieFromWatchedMovies(movie.id)
                                    setMessage("Movie removed from watched movies!")
                                }else{
                                    await props.api.addMovieTowatchedMovies(movie.id)
                                    setMessage("movie added to watched movies and was removed from watch list!")
                                }
                            }catch(error){
                                setMessage("Ooops!")
                            }
                            // dialog will be openned either way...
                            setOpen(true)
                        }
                    }
                    clickOnToWatch={
                        async ()=>{
                            try{
                                if (toWatch){
                                    await props.api.removeMovieToWatchList(movie.id)
                                    setMessage("Movie removed from watch list!")
                                }else{
                                    await props.api.addMovieToWatchList(movie.id)
                                    setMessage("movie added to watch list!")
                                }
                            }catch(error){
                                setMessage("Ooops!")
                            }
                            // dialog will be openned either way...
                            setOpen(true)
                        }
                    }
                    />
                </Grid>
                })
        }
        <Dialog open={open} onClose={()=>setOpen(false)}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}>
                        OK!
                </Button>
            </DialogActions>
        </Dialog>
    </Grid>
}