const router = require('express').Router()
const authControl = require('../controllers/authControl')

// register
router.post('/register',(req,res)=>{
    return authControl.register(req,res)
})

// login
router.post('/login',(req,res)=>{
    return authControl.login(req,res)
})

router.post('/refresh', (req,res)=>{
    return authControl.refreshToken(req,res)
})
router.get('/logout', (req,res)=>{
    return authControl.logout(req,res)
})

router.post('/forgot-password', (req,res)=>{
    return authControl.forgotPassword(req,res)
})
router.post('/forgot-password', (req,res)=>{
    return authControl.forgotPassword(req,res)
})

// google authentication
router.post('/google-login',(req,res)=>{
    return authControl.googleLogin(req,res)
})



module.exports = router