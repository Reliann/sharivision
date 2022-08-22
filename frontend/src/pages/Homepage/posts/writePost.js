import { Box, Button, Collapse, Dialog, IconButton, Paper, Switch, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChooseMovieList from "./ChooseMovieList";
import AuthContext from "../../../context/context";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BasicMovieCard from "./BasicMovieCard";

export default function WritePost(props){
    const {user,addPost} = useContext(AuthContext)
    const [values, setValues] = useState({
        spoiler:false,
        body:"",
        title:"",
        movie:"",
    })
    const [openForm,setOpenForm] = useState(false)
    const [msg,setMsg] = useState('')
    const [movieSearchDialog, setMovieSearchDialog] = useState(false)
    const handleInput = (prop)=>(e)=>{
        if (prop =='spoiler'){
            setValues({...values,[prop]:e.target.checked})
        }else{
            setValues({...values,[prop]:e.target.value})
        }
        
    }
    const submitForm = async(e)=>{
        e.preventDefault()
        try {
            const resp = await addPost({...values, movie:values.movie.id})
            props.pushPost(resp.data.resource)
            setMsg('Sucsees!')
        } catch (error) {
            console.log(error);
            setMsg('Something went wrong!')
        }
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
            <Typography>
                Contains Spoiler?
            </Typography>
            <Switch onChange={handleInput('spoiler')}/>
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
        <Dialog open={msg?true:false} onClose={()=>setMsg(false)}>
            <Typography>
                {msg}
            </Typography>
        </Dialog>
    </Box>
}