import { Button, TextField, Paper} from "@mui/material";
import { useContext, useState } from "react";
import AuthContext from "../../../../context/context";

export default function WriteComment (props){
  console.log(props);
  const {user, addComment} = useContext(AuthContext)
  const [values, setValues] = useState({
    author:user._id,
    body:'',
    post:props.post._id,
    spoiler:false,
    tag:'',
    reply:props.post.reply || '',
    postAuthor:props.post?.author || props.post?.postAuthor
  })
  const handleInput = (prop)=>(e)=>{
    setValues({...values,[prop]:e.target.value})
  }
  const sendComment =async(e)=>{
    e.preventDefault()
    try {
      const resp = await addComment(values)
      props.pushComment(resp.data.resource)
    } catch (error) {
      console.log();
    }
  }
  return <Paper component='form' onSubmit={sendComment}>
    <TextField placeholder={props.post.reply?`reply @${props.post.reply}`:"something to say?"} value={values.body} onChange={handleInput('body')}/>
    <Button type="submit">
      Reply
    </Button>
  </Paper>
}