import { Avatar, Button, Divider, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { getMovieById } from "../../../AxiosHook/MoviesApi";
import AuthContext from "../../../context/context";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentsGrid from "./Comments/CommentsGrid";
import WriteComment from "./Comments/WriteComment";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function (props){
  const [allowSpoiler,setAllowSpoiler] = useState(!props.post.spoiler)
  const [comments,setComments] = useState([])
  const {user, likePost, unlikePost, getCommentsByPost} = useContext(AuthContext)
  const [movie,setMovie] = useState({})
  const isLiked = props.post.likes.includes(user._id)
  
  const updatePost = (post)=>{
    props.updatePost({...post, author:props.post.author})
  }
  const getMovie = async()=>{
    try {
      const resp = await getMovieById(props.post.movie)
      setMovie(resp.data)
    } catch (error) {
      console.log(error);
    }
  }
  const getComments = async ()=>{
    try {
      const resp = await getCommentsByPost(props.post._id)
      console.log(resp.data);
      setComments(resp.data.resource)
      
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    //getprops.post.author()
    props.post.movie&&getMovie()
  },[])
  return <Paper sx={{display:'flex', flexDirection:'row'}}>
      <Avatar src={props.post.author?.avatar}/>
      <Box>
        <Typography>
          <b>{props.post.title}</b>
        </Typography>
        <Divider/>
        
          <Typography>
            {props.post.body}
          </Typography>
          <Box>
        <Button startIcon={isLiked?<ThumbDownIcon/>:<ThumbUpIcon/>}
            onClick={async()=>{
              try {
                const resp = isLiked? await unlikePost(props.post._id):await likePost(props.post._id)
                updatePost(resp.data.resource)
              } catch (error) {
                console.log(error);
              }
            }}
          >
          {(isLiked?'UNLIKE':'LIKE') + ` (${props.post.likes.length})`}
        </Button>
        <Button startIcon={<ExpandMore/>} onClick={getComments}>
          View Comments ({props.post.commentsCount})
        </Button>
        
      </Box>
      <CommentsGrid comments={comments} updateComment={(com)=>{
        setComments(comments.map((c)=>(c._id===com._id?com:c)))
      }}/>
      <WriteComment post = {{_id :props.post._id, author:props.post.author}} pushComment={(myComment)=>{
          setComments([myComment,...comments])
          updatePost({...props.post, commentsCount:props.post.commentsCount+1})
        }}/>
      </Box>
      <Box>
        
      
      <Avatar variant="square" src={ movie?.image?.medium ||
          'https://via.placeholder.com/200x300?text=No+image+available'}
          />
      
      
      
      </Box>
    
  </Paper>
}