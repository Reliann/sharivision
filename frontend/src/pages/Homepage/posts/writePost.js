import { Box, Button, Collapse, Dialog, IconButton, Paper, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChooseMovieList from "./ChooseMovieList";
import AuthContext from "../../../context/context";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BasicMovieCard from "./BasicMovieCard";

export default function WritePost(){
    const {user} = useContext(AuthContext)
    const [values, setValues] = useState({
        spoiler:"",
        body:"",
        title:"",
        movie:"",
        movieSearch:"",
    })
    const [openForm,setOpenForm] = useState(false)
    const [movieSearchDialog, setMovieSearchDialog] = useState(false)
    const handleInput = (prop)=>(e)=>{
        setValues({...values,[prop]:e.target.value})
    }
    const submitForm = async(e)=>{
        e.preventDefault()
    }
    
    const toggleMovieDialog = async()=>{
        setMovieSearchDialog(!movieSearchDialog)
    }
    
    return <Box>
        <Typography variant="h5">
            Have something to say?
        </Typography>
        <Button sx={{width:'100%'}} onClick={()=>setOpenForm(!openForm)}>
            {openForm?<ExpandLessIcon/>:<ExpandMoreIcon/>}
        </Button>
        <Collapse in={openForm}>
        <Paper component="form" onSubmit={submitForm} sx={{width:"100%", 
            display:"flex", flexDirection:"column", padding:"2%"}}>
        
            <TextField
                margin="normal"
                value={values.title}
                onChange={handleInput('title')}
                label="Post Title"
            />
            
            {values.movie&&<BasicMovieCard data={values.movie}/>}
            <Button onClick={()=>{values.movie?setValues({...values,movie:''}):toggleMovieDialog()}}>
                {values.movie?'Remove Movie':'Choose Movie'}
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
        </Collapse>
        
        <Dialog open={movieSearchDialog} onClose={toggleMovieDialog}>
            <Box sx={{padding:"10%"}} >
                <ChooseMovieList user={user} clb={(m)=>{
                    setValues({...values,movie:m})
                    toggleMovieDialog()}}/>
            </Box>
        </Dialog>
    </Box>
}