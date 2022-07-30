const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
// for path auth!

const authpath = 'api/auth'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const getAcssesToken = (content)=>{
    return jwt.sign(content, process.env.ACCESS_SECRET,{'expiresIn':'1h'})
}
const getRefreshToken=(content)=>{
    return jwt.sign(content, process.env.REFRESH_SECRET,{'expiresIn':'30d'})
}
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_SECRET, {expiresIn: '10m'})
}

const register = async (req, res)=>{
    // create a user and give them token.
    if (!req.body.password) return res.status(400).json({password:"Required field"})
    if (!req.body.email) return res.status(400).json({email:"Required field"})
    if (!req.body.username) return res.status(400).json({username:"Required field"})
    try {
        let user = await User.findOne({email:req.body.email})
        if (user){
            return res.status(400).json({email:"Email exists"})
        }
        user = await User.findOne({username:req.body.username})
        if (user){
            return res.status(400).json({username:"Username exists"})
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            username: req.body.username.toLowerCase(),
            email:req.body.email,
            password:hashedPassword,
        })

        const accessToken = getAcssesToken({id:user._id})
        const refreshToken = getRefreshToken({id:user._id})
        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: `${authpath}/refresh`,
        })
        const {password,...doc} = user._doc
        return res.status(201).json({token:accessToken,user:doc})    
    }catch (err){
        console.log(err)
        return res.status(500).json(err)
    }
    
}
const login = async (req,res)=>{
    if (!req.body.password) return res.status(400).json({password:"Required field"})
    if (!req.body.email) return res.status(400).json({email:"Required field"})
    try {
        const user = await User.findOne({$or:[{email:req.body.email},{username:req.body.email}]})
        if (!user){
            // no user with the email
            return res.status(404).json({msg:'No user exists with those credetials'})
        }else{
            //cheack password
            const passwordValid = await bcrypt.compare(req.body.password,user.password)
            if (passwordValid){
                //send user thier id token.
                const accessToken = getAcssesToken({id:user._id})
                const refreshToken = getRefreshToken({id:user._id})
                res.cookie('refreshtoken', refreshToken, {
                    httpOnly: true,
                    path: `${authpath}/refresh`,
                    maxAge: req.body.remember&&30*24*60*60*1000 // 30days
                })
                const {password,...doc} = user._doc
                return res.status(200).json({token:accessToken,user:doc})
            }else{
                //bad users
                return res.status(404).json({msg:'No user exists with those credetials'})
            }   
        }
    }catch(err){
        console.log(err)
        return res.status(500).json("unknown server error")
    }
    
}

const refreshToken= async (req, res) => {
    // when the client wants to get a new acsses token
    try {
        console.log(req.cookies);
        const refreshToken = req.cookies.refreshtoken
        if(refreshToken) {
            jwt.verify(refreshToken, process.env.refresh_SECRET, async(err, result) => {
                if(err) return res.status(401).json("Login Required")
                const user = await User.findById(result.id)
                if(!user) return res.status(404).json("user not found")
                const access_token = createAccessToken({id: result.id})
                return res.status(200).json({access:access_token})
            })
        }else{
            return res.status(401).json("Login Required")
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: err.message})
    }
}

const forgotPassword = async (req,res)=>{
    // send forgot password email to users with verified email (and verifycation code)
}
const activateEmail = async (req,res)=>{
    // send activation email (again)
}
const verifyMail = async (req,res)=>{
    // verify user activation token (set user's emailVerified to true)
}
const resetPassword = async (req,res)=>{
    // set a new password for user with authorization of the access token (given in forgot password mail)
    try {
        const {password} = req.body
        if(password){

        }
    } catch (error) {
        
    }
}
const logout = async (req,res)=>{
    // clear the refresh cookie...
    try {
        res.clearCookie('refreshtoken', {path: `${authpath}/refresh`})
        return res.json("Logged out")
    } catch (err) {
        return res.status(500).json("Some error happend here..")
    }
}
const googleLogin = async (req,res)=>{
    // continue https://github.com/devat-youtuber/mern-full-auth/blob/master/controllers/userCtrl.js
    // all this does is validate a user with his google account and log them in / register them. then give them tokens
    const {tokenId, username, remember} = req.body
    try {
        const verify = await client.verifyIdToken({idToken:tokenId ,audience:process.env.GOOGLE_CLIENT_ID})
        const {email_verified ,email, picture} = verify.getPayload()
        const password  = email + process.env.GOOGLE_PASSWORD_SECRET
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        if (email_verified){
            const user = await User.findOne({email})
            if (user){
                const match = await bcrypt.compare(password, user.password)
                if (match){
                    const accessToken = getAcssesToken({id:user._id})
                    const refreshToken = getRefreshToken({id:user._id})
                    res.cookie('refreshtoken', refreshToken, {
                        httpOnly: true,
                        path: `${authpath}/refresh`,
                        maxAge: remember&&30*24*60*60*1000 // 30days
                    })
                    const {password,...doc} = user._doc
                    return res.status(200).json({token:accessToken,user:doc})
                }else{
                    return res.status(409).json({msg:"password incorrect, perhaps you did not sign up with google?"})
                }
            }else{
                if (username){
                    const existingUser = await User.findOne({username})
                    if (existingUser) return res.status(400).json({msg:"username already exists"})
                    const user = await User.create({
                        username:username.toLowerCase(),
                        email:email,
                        password:hashedPassword,
                        avatar:picture,
                    })
                    const accessToken = getAcssesToken({id:user._id})
                    const refreshToken = getRefreshToken({id:user._id})
                    res.cookie('refreshtoken', refreshToken, {
                        httpOnly: true,
                        path: `${authpath}/refresh`,
                        maxAge: remember&&30*24*60*60*1000 // 30days
                    })
                    const {password,...doc} = user._doc
                    return res.status(200).json({token:accessToken,user:doc})
                }else{
                    return res.status(404).json({msg:"provide a username"}) // no existing acount found
                }
            }
        }else{
            return res.status(409).json({msg:"email verification failed"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}


module.exports = {
    register,
    login,
    refreshToken,
    logout,
    // login with external providers:
    googleLogin,
}