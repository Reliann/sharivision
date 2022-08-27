import axios from 'axios'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/context';

// 2 types of clients - my server, and the tv api
// this is the same for every request

const baseConfig = {
    //baseURL: '/api',
    //url:'/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'responseType': "application/json",
    }}

export default function useAxios(props){
    //const [user,setUserRaw] = useState(JSON.parse(localStorage.getItem('user')) || {info:{},token:{}})
    //const {setUser, setMsg, user, token} = useContext(AuthContext)
    const user = props.user
    const navigate = useNavigate()
    console.log(user);
    const shariApi = axios.create(baseConfig);
    // those routes shouldn't use interceptors...
    
    
    const setUser = (newUser)=>{
        localStorage.setItem('user', JSON.stringify({...newUser}))
        props.setUser({...newUser})
    }
    // const setLocalStorage =()=>{
    //     localStorage.setItem('user', JSON.stringify({token:resp.data.token, info:resp.data.user}))
    // }
    const logout =async ()=>{
        //clear the tokens and send a logout request
        const resp = await axios.get('auth/logout',baseConfig)
        if (resp?.status ===200){
            navigate('../login')
            //localStorage.removeItem('user')
            setUser({})
        }
        return resp
    }
    const login = async(payload)=>{
        const resp = await axios.post('auth/login',payload, baseConfig)
        if (resp?.status===200){
            //setLocalStorage()
            setUser({token:resp.data.token, info:resp.data.user})
            navigate('../')
        }
        return resp
    }
    const googleLogin = async(payload)=>{
        const resp = await axios.post('auth/google-login',payload, baseConfig)
        if (resp?.status===200){
            //setLocalStorage()
            setUser({token:resp.data.token, info:resp.data.user})
            navigate('../')
        }
        return resp
    }
    const register = async(payload)=>{
        const resp = await axios.post('auth/register',payload, baseConfig)
        if (resp?.status===200){
            //setLocalStorage()
            setUser({token:resp.data.token, info:resp.data.user})
            navigate('../')
        }
        return resp
    }
    const refreshTokens = async()=>{
        // {withCredentials: true, credentials: 'include'} for the lovely cookie 
        const resp = await axios.post('auth/refresh',{withCredentials: true, credentials: 'include'},baseConfig)
        if(resp.status===200){
            setUser({info:{...user.info},token:resp.data.token})
        }else{
            // if tokens can't be refreshed, a login is required
            logout()
        }
        return resp
    }
    // Add a request interceptor for shari
    shariApi.interceptors.request.use(function (config) {
        // Before request is sent, add auth header 
        config.headers.Authorization = `JWT ${user.token}`
        return config;
    }, function (error){
        // probably network error
        console.log(error.messege)
        return Promise.reject(error);
    });
    // Add a response interceptor
    shariApi.interceptors.response.use(
        (res)=>{
            if (res.data?.userinfo){
                // if new info is recived update the user's info...
                setUser({info:{...user.info,...res.data.userinfo},token:user.token})
            }
            return res
        },
        async (error)=>{
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            console.dir(error);
            if (error.response.status === 401){
                const resp = await refreshTokens()
                console.log(resp);
                if (resp.status === 200){
                    let og_request = error.config
                    og_request.headers.Authorization = `JWT ${resp.data.token}` 
                    const newRes = await axios.request(og_request)
                    if (newRes.data?.userinfo){
                        // if new info is recived update the user's info...
                        setUser({info:{...user.info,...newRes.data.userinfo},token:user.token})
                    }
                    return newRes
                }
            // }else if([404,400].includes(error?.status)){
            //     // I consider only 404 and 400 as form errors, 
            //     // foor anything else i want a snackbar
            //     setMsg("Error!")
            //     return error // so it dosen't fail in trycatch
            }
            return Promise.reject(new Error(error))
            
        }
    );

    return{
        user: user.info,
        // only auth paths are special, they dont require auth..
        routes:{
            login: login,
            register: register,
            logout:logout,
            googleLogin:googleLogin,
            // user route
            
            getUserByName:(identifier)=>(shariApi.get(`users/username/${identifier}`)),
            getUserById:(identifier)=>(shariApi.get(`users/${identifier}`)),

            updateUser:(payload)=>(shariApi.put(`users/${user.info._id}`,payload)),
            deleteUser:()=>(shariApi.delete(`users/${user.info._id}`)),
            removeMovieRecommenation:(movieId)=>(shariApi.delete(`users/${user.info._id}/recommend/${movieId}`)),
            //uploadSignature:()=>(shariApi.get(`users/${user.info._id}/avatar-upload-signature`)),
            //uploadAvatar:(payload)=>(shariApi.patch(`users/${user.info._id}/avatar`,payload)),
            // people 
            sampleUsers:()=>(shariApi.get(`users/sample/${user.info._id}`)),
            fullFriends:()=>shariApi.get(`users/fullFriends/${user.info._id}`),
            fullFriendRequests:()=>shariApi.get(`users/fullFriendRequests/${user.info._id}`),
            //lists
            addMovieToWatchList:(movieId)=>(shariApi.post(`users/${user.info._id}/watchlist/${movieId}`)),
            removeMovieToWatchList:(movieId)=>(shariApi.delete(`users/${user.info._id}/watchlist/${movieId}`)),
            requestFriendship:(friendId)=>(shariApi.post(`users/${user.info._id}/friendrequest/${friendId}`)),
            removeFriendshipRequest:(friendId)=>(shariApi.delete(`users/${user.info._id}/friendrequest/${friendId}`)),
            removeFriend:(friendId)=>(shariApi.delete(`users/${user.info._id}/removefriend/${friendId}`)),
            followUser:(friendId)=>(shariApi.post(`users/${user.info._id}/follow/${friendId}`)),
            unfollowUser:(friendId)=>(shariApi.delete(`users/${user.info._id}/follow/${friendId}`)),
            removeFollower:(friendId)=>(shariApi.delete(`users/${user.info._id}/removefollower/${friendId}`)),
            recommendMovie:(movieId, friendId)=>(shariApi.post(`users/${user.info._id}/recommend/${movieId}/${friendId}`)),
            removeRecommenation:(movieId, friendId)=>(shariApi.delete(`users/${user.info._id}/recommend/${movieId}/${friendId}`)),
            addMovieTowatchedMovies:(movieId)=>(shariApi.post(`users/${user.info._id}/watched/${movieId}`)),
            removeMovieFromWatchedMovies:(movieId)=>(shariApi.delete(`users/${user.info._id}/watched/${movieId}`)),
            addMovieToFavorites:(movieId)=>(shariApi.post(`users/${user.info._id}/favorite/${movieId}`)),
            removeMovieFromFavorites:(movieId)=>(shariApi.delete(`users/${user.info._id}/favorite/${movieId}`)),
            // upload routes 
            signUpload:(params)=>(shariApi.get(`users/${user.info._id}/avatar-upload-signature`,{params:params})),
            uploadAvatar:(avatar_url)=>(shariApi.patch(`users/${user.info._id}/avatar`,{avatar_url:avatar_url})),
            deleteAvatar:()=>(shariApi.delete(`users/${user.info._id}/avatar`)),
            // posts route
            // ....
            addPost:(post)=>(shariApi.post('posts',post)),
            getReleventPosts:()=>(shariApi.get('posts/relevent')),
            getPostsByUser:(id)=>(shariApi.get(`posts/user/${id}`)),
            likePost:(postId)=>(shariApi.post(`posts/${postId}/like`)),
            unlikePost:(postId)=>(shariApi.delete(`posts/${postId}/like`)),
            // comments route
            //....
            getCommentsByPost:(postId)=>(shariApi.get(`comments/post/${postId}`)),
            getCommentsByUser:(userId)=>(shariApi.get(`comments/user/${userId}`)),
            addComment:(comment)=>(shariApi.post(`comments`,comment)),
            getCommentsByComment:(comment)=>(shariApi.get(`comments/comment/${comment}`)),
            likeComment:(comment)=>(shariApi.post(`comments/${comment}/like`)),
            unlikeComment:(comment)=>(shariApi.delete(`comments/${comment}/like`)),
        }
        
    }
}