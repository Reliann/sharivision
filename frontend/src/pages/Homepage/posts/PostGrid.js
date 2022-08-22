import { Grid } from "@mui/material";
import Post from "./Post";

export default function PostGrid (props){
  console.log(props.posts);
  return <Grid container sx={{display:'flex', flexDirection:'column'}}>
    {props.posts.map(post=>(
      <Grid item key={post._id}>
        <Post post={post} updatePost={props.updatePost}/>
      </Grid>
    ))}
  </Grid>
}