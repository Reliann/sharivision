const Post = require('../models/Post')
const permissions = require('./permissions/permissions')
const User = require('../models/User')
const { simpleUser } = require('./usersControl')
// be able to get post by author, likers, movie , id (incase it is )
const options = {new:true}       

const getFullPost= async (post)=>{
    try {
        post = post.toObject()
        const author = await User.findById(post.author)
        if (author){
            post.author = simpleUser(author)
        }
        return post
    } catch (error) {
        console.log(error);
    }
}

const getPostByParams= async (req, res)=>{

    
}
const getPostsByUser = async(req,res)=>{
    try {
        const posts = await Post.find({author:req.params.userId},null,{sort: 'createdAt'})
        res.status(200).json({detail:'ok', resource: await Promise.all(posts.map(post=>(getFullPost(post))))})
    } catch (error) {
        console.log(error);
    }
}
const getRelevantPosts= async (req, res)=>{
    try {
        const posts = await Post.find()
        res.status(200).json({detail:'ok', resource: await Promise.all(posts.map(post=>(getFullPost(post))))})
    } catch (error) {
        console.log(error);
    }
}
const addPost= async (req, res)=>{
    const {title,body,movie, spoiler} = req.body
    try {
        const user = await User.findById(req.userId)
        if (user){
                const newPost = await Post.create({
                    author:req.userId,
                    title:title,
                    body:body,
                    movie:movie,
                    spoiler:spoiler,
                })
                return res.status(201).json({detail:'ok',resource:getFullPost(newPost)})
        }else{
            return res.status(404).json("user not found")
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
            return res.status(200).json({detail:'ok', resource:getFullPost(post)})
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
        const post = await Post.findByIdAndUpdate(req.params.id,{$addToSet:{likes:req.userId}},options)
        if (post){
            return res.status(200).json({detail:'ok', resource:post})
        }else{
            return res.status(404).json("post not found")
        }
        

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unlikePost = async (req,res)=>{
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,{$pull:{likes:req.userId}},options)
        if (post){
            return res.status(200).json({detail:'ok', resource:post})
        }else{
            return res.status(404).json("post not found")
        }
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
    unlikePost,
    getRelevantPosts,
    getPostsByUser,
}