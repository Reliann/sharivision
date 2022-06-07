import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";
import PersonCard from "./PersonCard";


export default function PeopleBrowser(props){
    const [people,setPeople] = useState([])
    const getSampleUsers =async ()=>{
        try{
            const resp = await props.api.sampleUsers()
            setPeople(resp.data)
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getSampleUsers()
    },[])
    return <Box>
        <Box component='form' sx={{display:'flex', justifyContent:'center'}} >
            <TextField type='search' name="search" defaultValue=''/>
            <Button startIcon={<Search/>} type='submit'>search</Button>
        </Box>
        {people.map((person)=>(
            <PersonCard key={person._id} info={person}/>
        ))}
    </Box>
}