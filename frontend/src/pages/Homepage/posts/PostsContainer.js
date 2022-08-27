import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/context";
import PostGrid from "./PostGrid";
import WritePost from "./writePost";

export default function PostContainer (){
  const {getReleventPosts} = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const getPosts = async()=>{
    try {
      const resp = await getReleventPosts()
      setPosts(resp.data.resource)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getPosts()
  },[])
  console.log(posts,333);
  return <Box>
    <WritePost  pushPost={(post)=>{setPosts([post,...posts])}}/>
    <PostGrid posts ={ posts} updatePost={(post)=>{setPosts(posts.map((p)=>(p._id===post._id?post:p)))}}/>
  </Box>
}