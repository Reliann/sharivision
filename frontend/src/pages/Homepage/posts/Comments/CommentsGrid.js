import { Grid } from "@mui/material";
import Comment from "./Comment";

export default function CommentsGrid(props) {
  return <Grid container>
    {
      props.comments?.map((comment)=>(
        <Grid key={comment._id} sx={{width:'100%'}}>
          <Comment comment={comment} updateComment={props.updateComment}/>
        </Grid>
      ))
    }
  </Grid>
}