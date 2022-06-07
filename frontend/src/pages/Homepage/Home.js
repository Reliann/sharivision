import { Box, Grid, Link, Typography } from "@mui/material";
import { Routes, Route} from "react-router-dom";
import Users from "./Users/Users";
import UserProfile from "./Users/UserProfile";
import Navbar from "./Navbar";
import E404 from "../Errors/404";
import { useContext, useState } from "react";
import MenuDrawer from "./MenuDrawer";
import WritePost from "./writePost";
import AuthContext from "../../context/context";
import useAxios from '../../AxiosHook/useAxios'
import MoviesBrowser from "./Movies/MovieBrowser";
import MyProfile from "./Users/MyProfile";
import WatchList from "./watchList";
import PeopleBrowser from "./friends/PeopleBrowser";

export default function Home(){
    const {user} = useContext(AuthContext)
    const [drawer, setDrawer] = useState(false)
    // same axios instance for everything... 
    const api = useAxios()
    const toggleDrawer= ()=>{
        setDrawer(!drawer)
    }
    if (Object.keys(user).length===0){
        return (
            <Box>
                <Link href="/login">log in </Link>to view homepage
            </Box>
        )
    }
    return (
        <Box sx={{ width:'100%' , display:'flex', justifyContent:'right'}} >
            <Navbar toggleDrawer={toggleDrawer} logout={api.logout} userId={user.info?._id} avatarSrc={user.info?.avatar}/>
            <MenuDrawer logout={api.logout} open = {drawer} toggleDrawer={toggleDrawer}/>
            <Grid container sx={{marginTop:'12vh',width:{xs:"95%",sm:"75%"},alignItems:"center", justifyContent:"center", display:"inline-block"}}>
                <Routes>
                    <Route path='MyProfile' element={<MyProfile user={user.info} api={api}/>}/>
                    <Route path='users/:userId' element={<UserProfile api = {api} loggedUser={user.info}/>}/>
                    <Route path='users/' element={<Users api = {api}/>}/>
                    <Route path='watchList' element={<WatchList api={api} user={user.info}/>}/>
                    <Route path='movies/*' element={<MoviesBrowser api = {api} user={user.info}/>}/>
                    <Route path='people/*' element={<PeopleBrowser api = {api} user={user.info}/>}/>
                </Routes>
            </Grid>
            
        </Box>
    )
}