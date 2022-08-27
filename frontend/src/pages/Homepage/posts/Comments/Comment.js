import { Avatar, Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ReplyIcon from '@mui/icons-material/Reply';
import AuthContext from "../../../../context/context";
import CommentsGrid from "./CommentsGrid";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WriteComment from "./WriteComment";

export default function Comment(props) {
  const [replies,setReplies] = useState([])
  const [showReplies,setShowReplies] = useState(false)
  const {getCommentsByComment, user, likeComment, unlikeComment} = useContext(AuthContext)
  const [writeComment, setWriteComment] = useState(false)
  const isLiked = props.comment.likes.includes(user._id)

  const getReplies= async()=>{
    try {
      const resp = await getCommentsByComment(props.comment._id)
      setReplies(resp.data.resource)
    } catch (error) {
      console.log(error);
    }
  }
  const clickOnLike = async()=>{
    try {
      const resp = isLiked? await unlikeComment(props.comment._id):await likeComment(props.comment._id)
      props.updateComment({...resp.data.resource,author:props.comment.author})
    } catch (error) {
      console.log(error);
    }
  }
  const pushComment = (myComment)=>{
    setReplies([myComment,...replies])
    props.updateComment({...props.comment, commentsCount:props.comment.commentsCount+1})
  }
  return <Paper >
    <Box sx={{display:'flex',flexDirection:'row'}}>
      <Avatar src={props.comment.author.avatar}/>
      <Box>
        <Typography>
        {`${props.comment.author.username} ${(props.comment.tag&&props.comment.reply)?`Replied to ${props.comment.tag}`:'said:'}`} 
      </Typography>
      <Divider/>
      <Typography>
        {props.comment.body}
      </Typography>
      </Box>
      {!props.viewOnly&&<Button onClick={()=>setWriteComment(!writeComment)}>
        {writeComment?'CANCEL':<ReplyIcon/>}
      </Button>}
      <Button onClick={clickOnLike}>
        {(isLiked?'UNLIKE':'LIKE') + `(${props.comment.likes.length})`}
      </Button>
    </Box>
    
    <Box display={writeComment?'block': 'none'}>
      {/* can only comment on first comments..  */}
      <WriteComment post={{...props.comment,reply:props.comment.reply?props.comment.reply:props.comment._id}}
      pushComment={props.comment.reply? props.pushComment:pushComment}/>
    </Box>
    {!props.comment.reply&&!props.viewOnly&&<React.Fragment>
      <Button onClick={()=>{getReplies();setShowReplies(!showReplies)}} >{showReplies?<ExpandLessIcon/>:<ExpandMoreIcon/>}</Button>
      <Box sx={{width:'80%', display:showReplies?'block':'none'}}  >
        <CommentsGrid comments={replies} pushComment={pushComment}/>
      </Box>
    </React.Fragment>}
    
  </Paper>
}