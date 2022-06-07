import { createContext, useEffect, useState } from "react";

const AuthContext = createContext()

export default AuthContext

export function ContextProvider({children}){
    const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState("")
    const [loading,setLoading] = useState(false)
    const [msg,setMsg] = useState("")

    useEffect (()=>{
        // every time the user changes it needs to be cached (in case of a refresh)
        localStorage.setItem('user', JSON.stringify(user))
    },[user])
    const contextExports = {
        user:user,
        tokens:token,
        msg:msg,
        loading:loading,
        setLoading:setLoading,
        setMsg:setMsg,
        setUser:setUser,
        setToken:setToken
    }
    return <AuthContext.Provider value={contextExports}>
        {children}
    </AuthContext.Provider>

}