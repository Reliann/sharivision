import {Card, CardActionArea, CardActions, CardContent, CardMedia, Icon, IconButton, Menu, MenuItem, Typography} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function MovieCard (props){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    return <Card sx={{ width:200, height:300,backgroundImage:`url(${props.data.image?.medium||
        'https://via.placeholder.com/200x300?text=No+image+available'})`,
            display:'flex',flexDirection:'column', textAlign:'center',
            justifyContent:"end", alignItems:"center"}}>
        <CardContent sx={{backgroundColor:'inherit', width:"100%", opacity:'85%', }}>
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
            <IconButton onClick={props.clickOnFavorite}>
                {props.favorite?<HeartBrokenIcon/>:<FavoriteIcon/>}
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
            <MenuItem onClick={async()=>{await props.clickOnWatched();handleClose()}}>{props.watched?'remove from':'add to'} watched movies</MenuItem>
            <MenuItem onClick={async()=>{await props.clickOnToWatch();handleClose()}}>{props.toWatch?'remove from':'add to'} watch list</MenuItem>
        </Menu>
    </Card>
}