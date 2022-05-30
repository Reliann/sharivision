import {Card, CardActionArea, CardActions, CardContent, CardMedia, Icon, IconButton, Link, Typography} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { useContext } from 'react';

export default function MovieCard (props){
    useContext
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
            <IconButton>
                <AddBoxIcon/>
            </IconButton>
            <IconButton onClick={props.clickOnFavorite}>
                {props.favorite?<FavoriteIcon/>:<HeartBrokenIcon/>}
            </IconButton>
        </CardActions>
    </Card>
}