import { Avatar, Paper, Typography } from "@mui/material";
import { useState } from "react";


export default function (props){
  const [allowSpoiler,setAllowSpoiler] = useState(!props.post.spoiler)

  return <Paper sx={{display:'flex', flexDirection:'row'}}>
      <Avatar/>
      <Typography>
        props.post.title
      </Typography>
      <Typography>
        props.post.body
      </Typography>
      <Avatar variant="square" src={ '' ||
          'https://via.placeholder.com/200x300?text=No+image+available'}/>
  </Paper>
}