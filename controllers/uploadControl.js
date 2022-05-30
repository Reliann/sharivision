const cloudinary = require("cloudinary").v2;
const User = require('../models/User')

// to upload image:
// 1. the client needs to get a signature for the widget
// 2. needs to send the public_id of image (which is technically known)


const generateSignature= async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if (user){
            //const timestamp = Math.round((new Date).getTime()/1000)
            const signature = cloudinary.utils.api_sign_request({
                timestamp: req.query.timestamp,
                upload_preset:"avatars",
                source: 'uw',
                public_id:`${user._id}`,},
            process.env.API_SECRET);
            // ideally the client should supply the public id of the upload
            // but because every user have 1 avatar and it's in the avatars preset, 
            // i can just update this here, it's the only value possible anyway...
            //await user.updateOne({avatar:`https://res.cloudinary.com/sharivision/image/upload/v1653765967/avatars/${user._id}`})
            // but im cheap on cloudinary credits haha...
            return res.status(200).json({ 
                signature: signature,
            });
            
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Unknown server error")
    }
}

const uploadImage = async (req,res)=>{
    try {
        const imgUrl = req.body.avatar_url
        const user = await User.findById(req.params.id)

        // just cheaking it's what it's supposed to be...
        //console.log(imgUrl.slice(0, imgUrl.lastIndexOf('.')));
        //Yeah it's possible to add  anything as avatar.. it makes sense idk
        if (imgUrl ){
            if (user){
                await User.findByIdAndUpdate(user._id,{avatar:imgUrl})
                return res.status(200).json({detail:"new info",avatar:imgUrl})
            }else{
                return res.status(404).json("user not found")
            }
        }else{
            return res.status(400).json("Bad image url")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Unknown server error")
    }
    
    
}

const removeImage = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if (user){
            const result = await cloudinary.uploader.destroy(`avatars/${user._id}`);
            console.log(result);
            if (result){
                await User.findByIdAndUpdate(user._id,{avatar:""})
                return res.status(200).json("image deleted")
            }else{
                return res.status(500).json("errors happen")
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Unknown server error")
    }
    
}

module.exports = {
    generateSignature,
    removeImage,
    uploadImage,
}