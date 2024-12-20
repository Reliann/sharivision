import {  Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import FeedIcon from '@mui/icons-material/Feed';

import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/context";
const minDrawerWidth = 240
const drawerWidth = '20%'
const maxwith = 300
const navbarHeight = "9vh" // actually  +2 of navbar height

export default function MenuDrawer(props){
    const {logout} = useContext(AuthContext)
    return <Drawer variant="permanent" open={props.open} onClose={props.toggleDrawer} sx={{
        minWidth: minDrawerWidth,
        width:drawerWidth,
        maxWidth:maxwith,
        display:{sm:"block",xs:props.open?"block":"none"},
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {maxWidth:maxwith, width:drawerWidth,minWidth: minDrawerWidth, boxSizing: 'border-box' },
    }}>
        <List sx={{marginTop:navbarHeight}}> 
            <ListSubheader>
                MENU
            </ListSubheader>
            <Divider/>
            <ListItemButton component={Link} to=''>
                <ListItemIcon>
                    <FeedIcon/>
                </ListItemIcon>
                <ListItemText primary="Feed"/>
            </ListItemButton>
            <ListItemButton component={Link} to='movies'>
                <ListItemIcon>
                    <LiveTvIcon/>
                </ListItemIcon>
                <ListItemText primary="Browse Movies"/>
            </ListItemButton>
            <ListItemButton component={Link} to='watchList'>
                <ListItemIcon>
                    <FactCheckIcon/>
                </ListItemIcon>
                <ListItemText primary="Watch List"/>
                
            </ListItemButton>
            <Divider/>
            <ListItemButton component={Link} to="MyProfile">
                <ListItemIcon>
                    <PersonIcon/>
                </ListItemIcon>
                <ListItemText primary="My Profile"/>
            </ListItemButton>
            <ListItemButton component={Link} to='people/'>
                <ListItemIcon>
                    <GroupIcon/>
                </ListItemIcon>
                <ListItemText primary="Discover People"/>
            </ListItemButton>
            <ListItemButton component={Link} to='people/friends'>
                <ListItemIcon>
                    <GroupIcon/>
                </ListItemIcon>
                <ListItemText primary="My Friends"/>
            </ListItemButton>
            <ListItemButton component={Link} to='people/friendRequests'>
                <ListItemIcon>
                    <GroupIcon/>
                </ListItemIcon>
                <ListItemText primary="My Friend Requests"/>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary="Settings"/>
            </ListItemButton>
            <Divider/>
            <ListItemButton onClick={logout}>
                <ListItemIcon>
                    <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary="Logout"/>
            </ListItemButton>
        </List>
    </Drawer>
}