import { createContext, useEffect, useRef, useState } from "react";
import useAxios from "../AxiosHook/useAxios";

const AuthContext = createContext()

export default AuthContext

export function ContextProvider({children}){
    const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')) || {info:{},token:{}})
    
    const [api,] = useState(useAxios({setUser:setUser, user:user}))
    const [loading,setLoading] = useState(false)
    const [msg,setMsg] = useState("")

    //console.log('rendered all');
    const contextExports = {...api.routes,user:{...user.info}}
    // {
    //     user:user.info,
    //     token:user.token,
    //     msg:msg,
    //     loading:loading,
    //     setLoading:setLoading,
    //     setMsg:setMsg,
    //     setUser:setUser,
    //     //setToken:setToken
    // }
    return <AuthContext.Provider value={contextExports}>
        {children}
    </AuthContext.Provider>

}