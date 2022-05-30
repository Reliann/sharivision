import { Box } from "@mui/material";
import { Routes, Route} from "react-router-dom";
import { ContextProvider } from "./context/context";
import Home from "./pages/Homepage/Home";
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'

function App() {
  return (
    <Box sx={{display:"flex", justifyContent:"center"}}>
      <ContextProvider>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/*' element={<Home/>}/>
        </Routes>
      </ContextProvider>
    </Box>
  );
}

export default App;
