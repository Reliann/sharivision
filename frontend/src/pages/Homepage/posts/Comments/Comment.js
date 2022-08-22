import { Avatar, Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../context/context";
import CommentsGrid from "./CommentsGrid";
import WriteComment from "./WriteComment";

export default function Comment(props) {
  const [replies,setReplies] = useState([])
  const {getCommentsByComment} = useContext(AuthContext)

  const getReplies= async()=>{
    try {
      const resp = await getReplies(props.comment._id)
      setReplies(resp.data.resource)
    } catch (error) {
      console.log(error);
    }
  }
  return <Paper >
    <Box sx={{display:'flex',flexDirection:'row'}}>
      <Avatar src={props.comment.author.avatar}/>
      <Box>
        <Typography>
        {props.comment.author.username}
      </Typography>
      <Divider/>
      <Typography>
        {props.comment.body}
      </Typography>
      </Box>
      
    </Box>
    <Button>
        Reply
    </Button>
    <Box>
      <WriteComment post={{...props.comment,reply:props.comment.author.username}} pushComment={(myComment)=>{
          setReplies([myComment,...replies])
          props.updateComment({...props.comment, commentsCount:props.comment.commentsCount+1})
        }}/>
    </Box>
    <Box display={props.comment.reply?'none':'block'}>
      <CommentsGrid comments={replies} />
    </Box>
  </Paper>
}