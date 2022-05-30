import { Box, Button, Dialog, IconButton, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react"
import SearchIcon from '@mui/icons-material/Search';

export default function WritePost(){
    const [values, setValues] = useState({
        spoiler:"",
        body:"",
        title:"",
        movie:"",
        movieSearch:"",
    })
    const [movies, setMovies] = useState([])
    const [movieSearchDialog, setMovieSearchDialog] = useState(false)
    const handleInput = (prop)=>(e)=>{
        setValues({...values,[prop]:e.target.value})
    }
    const submitForm = async(e)=>{
        e.preventDefault()
    }
    const fetchMovies = async()=>{
        setMovies([1,2,3])
    }
    const toggleMovieDialog = async()=>{
        setMovieSearchDialog(!movieSearchDialog)
    }
    
    return <Box>

        <Paper component="form" onSubmit={submitForm} sx={{width:"fit-content", 
            display:"flex", flexDirection:"column", padding:"2%"}}>
        <Typography variant="h5">
            Have something to say?
        </Typography>
            <TextField
                margin="normal"
                value={values.title}
                onChange={handleInput('title')}
                label="Post Title"
            />
            <Button onClick={toggleMovieDialog}>
                Choose Movie
            </Button>
            <TextField
                margin="normal"
                value={values.body}
                onChange={handleInput('body')}
                label="Body"
                multiline
                rows={4}
            />

            <Button type="submit" color="primary" variant="contained">
                Post
            </Button>
        </Paper>
        <Dialog open={movieSearchDialog} onClose={toggleMovieDialog}>
            <Box sx={{padding:"10%"}} component="form" onSubmit={fetchMovies}>
                <Typography variant="h4">
                    Search movie
                </Typography>
                <TextField
                    value={values.movieSearch}
                    onChange={handleInput('movieSearch')}
                    InputProps={{endAdornment:<IconButton type="submit" edge="end">
                        <SearchIcon/>
                    </IconButton>}}
                />
            </Box>
        </Dialog>
    </Box>
}