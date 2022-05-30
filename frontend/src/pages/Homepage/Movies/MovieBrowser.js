import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { Route, Routes} from "react-router-dom";
import MoviesGrid from "./MoviesGrid";
import MoviePage from "./MoviePage/MoviePage";
import Search from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getMoviesPage} from '../../../AxiosHook/MoviesApi'
import AutorenewIcon from '@mui/icons-material/Autorenew';


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


export default function MoviesBrowser(props){
    const [movies,setMovies] = useState([])
    const navigate = useNavigate()

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
    useEffect(()=>{getRandomPage()},[])
    const searchMovies=async ()=>{
        
    }
    return <Box>
        <Grid container sx={{justifyContent:'center'}}>
            <Box sx={{display:'flex', justifyContent:'center'}}>
                <TextField type='search'/>
                <Button endIcon={<Search/>} onClick={searchMovies}>
                    Search
                </Button>
                <IconButton>
                    <AutorenewIcon/>
                </IconButton>
            </Box>
            
        </Grid>
        <Routes>
            <Route path='/' element={<MoviesGrid api={props.api} />}/> 
            <Route path='/:id' element={<MoviePage api={props.api}/>}/> {/* includes full movie data, has own state */}
        </Routes>
    </Box>
}