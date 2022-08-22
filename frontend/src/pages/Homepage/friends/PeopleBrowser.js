import { Button, Dialog, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";
import PersonCard from "./PersonCard";
import { useParams } from "react-router-dom";
import RecommendMovie from "./RecommendMovie";
import AuthContext from "../../../context/context";


export default function PeopleBrowser(){
    const [people,setPeople] = useState([])
    const [loading,setLoading]  = useState(true)
    const {list} = useParams()
    const {sampleUsers, fullFriends, fullFriendRequests} = useContext(AuthContext)
    const getPeople = async ()=>{
        let resp
        try{
            if (list === 'friends'){
                resp = await fullFriends()
            }else if(list ==='friendRequests'){
                resp = await fullFriendRequests()
            }
            else{
                resp = await sampleUsers()
            }
            setPeople(resp.data.resource)
            setLoading(false)
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getPeople()
    },[list])


    const updatePeople = (newFriendInfo)=>{
        ///console.log(newFriendInfo.recommended, people[0].recommended);
        const newppl = people.map((p)=>{
            if (p._id===newFriendInfo._id){
                return newFriendInfo
            }
            return p
        })
        setPeople(newppl)
        //console.log(newFriendInfo.recommended);
    }
//console.log(people, people.length, 90);
    if (people.length === 0 ){
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
                <PersonCard key={person._id} info={person}  updateFriend={updatePeople} />
            ))}
        </Box>
        {/* dialog to reccomend a movie */}
        {/* <Dialog open={Object.keys(dialog).length !== 0 } onClose={()=>setDialog({})} sx={{zIndex:'1401',padding:'1%',position: "absolute", overflowY: "scroll", maxHeight: "90%"}}>
            <RecommendMovie api={props.api} user = {props.user} friend={dialog} updateFriend={updatePeople}/>
        </Dialog> */}
    </Box>
}