import { Box, Grid } from "@mui/material"
import WritePost from "./writePost"

export default function Feed (){
    return (
        <Box>
            <Grid container sx={{width:"100%",alignItems:"center", justifyContent:"center"}}>
                <Grid item>
                    <WritePost/>
                </Grid>
            </Grid>
        </Box>
    )
}