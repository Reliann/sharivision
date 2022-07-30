import { Button, Dialog, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";
import PersonCard from "./PersonCard";
import { useParams } from "react-router-dom";
import RecommendMovie from "./RecommendMovie";


export default function PeopleBrowser(props){
    const [people,setPeople] = useState([])
    const [loading,setLoading]  = useState(true)
    const [dialog, setDialog] = useState({})
    const {list} = useParams()
    console.log(people);

    const getPeople = async ()=>{
        let resp
        try{
            if (list === 'friends'){
                resp = await props.api.fullFriends()
            }else if(list ==='friendRequests'){
                resp = await props.api.fullFriendRequests()
            }
            else{
                resp = await props.api.sampleUsers()
            }
            setPeople(resp.data)
            setLoading(false)
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getPeople()
    },[list])

    if (people.length === 0 &&!loading){
        return <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
            <Typography variant='h3' component='h2'>
                No one to see here...
            </Typography>
        </Box>
    }

    return <Box sx={{alignItems:'center'}}>
        {/* only show searchbox on sample users (so you can search...) */}
        {!list&&<Box component='form' sx={{display:'flex', justifyContent:'center'}} >
            <TextField type='search' name="search" defaultValue=''/>
            <Button startIcon={<Search/>} type='submit'>search</Button>
        </Box>}
        <Box sx={{display:'flex',flexDirection:"column", justifyContent:'center', alignItems:'center'}}>
            {/* render the people asked for... */}
            {people.map((person)=>(
                <PersonCard key={person._id} info={person} api={props.api} user = {props.user} recommend={()=>setDialog(person)}/>
            ))}
        </Box>
        {/* dialog to reccomend a movie */}
        <Dialog open={Object.keys(dialog).length !== 0 } onClose={()=>setDialog({})} sx={{zIndex:'1401',padding:'1%',position: "absolute", overflowY: "scroll", maxHeight: "90%"}}>
            <RecommendMovie api={props.api} user = {props.user} friend={dialog} updateFriend={
                (rec,m)=>{
                    let newppl = people
                    newppl[dialog._id].recommended[m].push(rec)
                    setPeople(newppl)
                }
            }/>
        </Dialog>
    </Box>
}