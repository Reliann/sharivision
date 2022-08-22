import { Box, Grid, Link, Typography } from "@mui/material";
import { Routes, Route} from "react-router-dom";
import Users from "./Users/Users";
import UserProfile from "./Users/UserProfile";
import Navbar from "./Navbar";
import E404 from "../Errors/404";
import { useContext, useState } from "react";
import MenuDrawer from "./MenuDrawer";
import AuthContext from "../../context/context";
import useAxios from '../../AxiosHook/useAxios'
import MoviesBrowser from "./Movies/MovieBrowser";
import MyProfile from "./Users/MyProfile";
import WatchList from "./watchList";
import PeopleBrowser from "./friends/PeopleBrowser";
import Feed from "./posts/Feed";


export default function Home(){
    const {user} = useContext(AuthContext)
    const [drawer, setDrawer] = useState(false)
    // same axios instance for everything... 
    // const api = useAxios()
    const toggleDrawer= ()=>{
        setDrawer(!drawer)
    }
    //console.log(Object.keys(user).length,1);
    if (Object.keys(user).length===0){
        return (
            <Box>
                <Link href="/login">log in </Link>to view homepage
            </Box>
        )
    }
    return (
        <Box sx={{ width:'100%' , display:'flex', justifyContent:'right'}} >
            <Navbar toggleDrawer={toggleDrawer}/>
            <MenuDrawer  open = {drawer} toggleDrawer={toggleDrawer}/>
            <Grid container sx={{marginTop:'12vh',width:{xs:"95%",sm:"75%"},alignItems:"center", justifyContent:"center", display:"inline-block"}}>
                
                
                
                <Routes>
                    <Route path='' element={<Feed />}/>
                    <Route path='MyProfile' element={<MyProfile/>}/>
                    <Route path='users/:username' element={<UserProfile />}/>
                    <Route path='users/' element={<Users/>}/>
                    <Route path='watchList' element={<WatchList />}/>
                    <Route path='movies/*' element={<MoviesBrowser/>}/>
                    <Route path='people/:list' element={<PeopleBrowser/>}/>
                    <Route path='people/' element={<PeopleBrowser />}/> 
                
                </Routes>
            </Grid>
            
        </Box>
    )
}