const Post = require('../models/Post')
const permissions = require('./permissions/permissions')
const User = require('../models/User')
// be able to get post by author, likers, movie , id (incase it is )
const options = {new:true}       


const getPostByParams= async (req, res)=>{

}
const addPost= async (req, res)=>{
    const {author,title,body,movie, spoiler} = req.body
    try {
        const user = await User.findById(author)
        if (user){
            // cheack if the logged in user is the author 
            if (user._id.toString() === req.userId){
                const newPost = await Post.create({
                    author:author,
                    title:title,
                    body:body,
                    movie:movie,
                    spoiler:spoiler,
                })
                return res.status(201).json(newPost)
            }else{
                return res.status(403).json("you can't post for someone else.")
            }
        }else{
            return res.status(404).json("author not found")
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removePost = async (req,res)=>{
    try {
        const post = await Post.findById({id})
        if (post){
            if (permissions.isAuthor(req, post)){
                // this will also remove all the comments
                await post.remove()
            }else{
                return res.status(403).json("you are not the author of this post")
            }
            return res.status(200).json(post)
        }
        else{
            return res.status(404).json("Post not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
} 
const updatePost = async (req,res)=>{
    const {title,body,movie, spoiler} = req.body
    try {
        const post = await Post.findById(req.params.id)
        if (permissions.isAuthor(req,post)){
            await Post.findByIdAndUpdate(req.params.id,{
                title:title,
                body:body,
                movie:movie,
                spoiler:spoiler,

            },options)
            return res.status(201).json(post)
        }else{
            return res.status(403).json("you can't update someone else's post.")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const likePost = async (req,res)=>{
    try {
        // any logged user can like
        await Post.findByIdAndUpdate(req.params.id,{$addToSet:{likes:req.params.userId}})
        return res.status(200).json("post liked")

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unlikePost = async (req,res)=>{
    try {
        await Post.findByIdAndUpdate(req.params.id,{$pull:{likes:req.params.userId}})
        return res.status(200).json("post unliked")
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

module.exports = {
    getPostByParams,
    addPost,
    removePost,
    updatePost,
    likePost,
    unlikePost
}