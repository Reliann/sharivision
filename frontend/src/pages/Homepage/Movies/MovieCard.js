import {Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader  ,CardMedia, Icon, IconButton, Menu, MenuItem, Typography} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function MovieCard (props){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isRec = Object.keys(props.user.recommended).includes(props.data.id.toString())


    const favorite = props.user.favorites.includes(props.data.id.toString())
    const watched = props.user.watchedList.includes(props.data.id.toString())
    const toWatch = props.user.watchList.includes(props.data.id.toString())

    const handleClose = () => {
        setAnchorEl(null);
    };
    return <Card sx={{ width:200, height:300,backgroundImage:`url(${props.data.image?.medium||
        'https://via.placeholder.com/200x300?text=No+image+available'})`,
            display:'flex',flexDirection:'column', textAlign:'center',
            alignItems:"center"}}>
        
            {isRec&&<ButtonGroup sx={{backgroundColor:'inherit', justifySelf:'flex-start',marginBottom:'auto'}}>
                <Button startIcon={<StarIcon sx={{color:'GoldenRod'}}/>} disabled>
                    Recommanded by {props.user.recommended[props.data.id].length} friends!
                </Button>
            </ButtonGroup>}
        
        <CardContent sx={{backgroundColor:'inherit', width:"100%", opacity:'80%', marginBottom:'auto'}}>
            <Typography gutterBottom variant="h5" component="div">
                {props.data.name}
            </Typography>
            <Typography color="text.secondary">
            {props.data.genres.join(' ★ ')}
            </Typography>
            <Typography color="text.secondary">
                {`${props.data.premiered?.split('-')[0]||'Unknown'}-${props.data.ended?.split('-')[0] || 'Present'}`}
            </Typography>
        </CardContent>
        <CardActions sx={{backgroundColor:'inherit', width:"100%", opacity:'85%', }}>
            <IconButton>
                <ShareIcon/>
            </IconButton>
            <IconButton onClick={(event)=>(setAnchorEl(event.currentTarget))}>
                <AddBoxIcon/>
            </IconButton>
            <IconButton onClick={ async ()=>{
                try{
                    if (favorite){     // TODO: add are you sure pop up
                        await props.api.removeMovieFromFavorites(props.data.id)
                        props.setMessage("Movie removed from favotites!")
                    }else{
                        await props.api.addMovieToFavorites(props.data.id)
                        props.setMessage("Movie added to favorites!")
                    }
                }catch (error){
                    props.setMessage("Ooops!")
                }
            }}>
                {favorite?<HeartBrokenIcon/>:<FavoriteIcon/>}
            </IconButton>
            <IconButton component={Link} to={`../../movies/${props.data.id}`}>
                <ArrowForwardIcon/>
            </IconButton>
        </CardActions>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            >
            <MenuItem onClick={async()=>{
                try{
                    if (watched){
                        await props.api.removeMovieFromWatchedMovies(props.data.id)
                        props.setMessage("Movie removed from watched movies!")
                    }else{
                        await props.api.addMovieTowatchedMovies(props.data.id)
                        props.setMessage("movie added to watched movies and was removed from watch list!")
                    }
                }catch(error){
                    props.setMessage("Ooops!")
                }
                handleClose()
                }}>
                    {watched?'remove from':'add to'} watched movies</MenuItem>
            <MenuItem onClick={async()=>{
                    try{
                        if (toWatch){
                            await props.api.removeMovieToWatchList(props.data.id)
                            props.setMessage("Movie removed from watch list!")
                        }else{
                            await props.api.addMovieToWatchList(props.data.id)
                            props.setMessage("movie added to watch list!")
                        }
                    }catch(error){
                        props.setMessage("Ooops!")
                    }
                
                handleClose()}}>
                    {toWatch?'remove from':'add to'} watch list</MenuItem>
        </Menu>
    </Card>
}