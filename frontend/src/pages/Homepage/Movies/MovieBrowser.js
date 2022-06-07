import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { Route, Routes} from "react-router-dom";
import MoviesGrid from "./MoviesGrid";
import MoviePage from "./MoviePage/MoviePage";
import Search from "@mui/icons-material/Search";
import { useState } from "react";
import AutorenewIcon from '@mui/icons-material/Autorenew';


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


export default function MoviesBrowser(props){
    const [search,setSearch] = useState('')
    const [refresh, setRefresh] = useState(0)

    const searchMovies = async (e)=>{
        e.preventDefault()
        setSearch(e.target.elements.search.value)
    }
    const searchBoxGrid = <Grid container sx={{justifyContent:'center'}}>
        <Box component='form'  onSubmit={searchMovies} sx={{display:'flex', justifyContent:'center'}} >
        <TextField defaultValue={''} name='search' type='search'/>
        <Button type = 'submit'endIcon={<Search/>}>
            Search
        </Button>
        <IconButton onClick={()=>setRefresh(refresh + 1)}>
            <AutorenewIcon/>
        </IconButton>
        </Box>
        <MoviesGrid api={props.api} search={search} refresh={refresh}/>
    </Grid>
    return <Box>
        <Routes>
            <Route path='/' element={searchBoxGrid}/> 
            <Route path='/:id' element={<MoviePage api={props.api} user={props.user} />}/> {/* includes full movie data, has own state */}
        </Routes>
    </Box>
}