import { Avatar, Paper, Typography } from "@mui/material"

export default function BasicMovieCard(props){
    return <Paper sx={{display:'flex', flexDirection:'row', marginY:'2%'}} onClick={props.clb}>
        <Avatar variant="square" src={`${props.data.image?.medium||
        'https://via.placeholder.com/200x300?text=No+image+available'}`}/>
        <Typography gutterBottom variant="h5" component="div">
            {props.data.name}
        </Typography>
    </Paper>
}