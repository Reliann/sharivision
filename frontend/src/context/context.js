import { createContext, useEffect, useState } from "react";
import useAxios from "../AxiosHook/useAxios";

const AuthContext = createContext()

export default AuthContext

export function ContextProvider({children}){
    //const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')) || {info:{},token:{}})
    const [api,setApi] = useState(useAxios())
    const [loading,setLoading] = useState(false)
    const [msg,setMsg] = useState("")

    
    const contextExports = {api:{...api.routes},user:{...api.user}}
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