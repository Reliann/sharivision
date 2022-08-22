const Comment = require('../models/Comment')
const permissions = require('./permissions/permissions')
const Post = require('../models/Post')
const User = require('../models/User')
const { simpleUser } = require('./usersControl')

const options = {new:true}
// can only get comments by post id or author or liker or postOwner (it needs to come with some context..)

const getFullComment= async (comment)=>{
    try {
        comment = comment.toObject()
        const author = await User.findById(comment.author,)
        if (author){
            comment.author = simpleUser(author)
        }
        return comment
    } catch (error) {
        console.log(error);
    }
}

const getCommentsByPost= async (req, res)=>{
    try {
        const comments = await Comment.find({post:req.params.id})
        res.status(200).json({detail:'ok', resource: await Promise.all(comments.map(comment=>(getFullComment(comment))))})
    } catch (error) {
        console.log(error);
    }
}
const addComment= async (req, res)=>{
    // needs to make sure both the user and the post exists before posting comments..
    
    const {author, body, post, tag, reply, spoiler} = req.body
    try {
        const user = await User.findById(author)
        if (user){
                const postCheck = await Post.findByIdAndUpdate(post, {$inc:{commentsCount:1}})
                if (postCheck){
                    if (reply){
                        const replyCheck = await Comment.findByIdAndUpdate(reply,{$inc:{commentsCount:1}})
                        if (replyCheck){
                            const newComment = await Comment.create({
                                author:author,
                                body:body,
                                post:post,
                                tag:tag,
                                reply:replyCheck._id,
                                postAuthor:postCheck.author
                            })
                            return res.status(201).json({detail:'ok', resource:await getFullComment(newComment)})
                        }else{
                            return res.status(404).json("comment dosn't exit")
                        }
                    }else{
                        const newComment = await Comment.create({
                            author:author,
                            body:body,
                            post:post,
                            spoiler:spoiler,
                            postAuthor:postCheck.author
                        })
                        
                        return res.status(201).json({detail:'ok', resource:await getFullComment(newComment)})
                    }
                    
                }else{
                    return res.status(404).json("post dosn't exit")
                }
           
        }else{
            return res.status(404).json("author not found")
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeComment = async (req,res)=>{
    try {
        const comment = await Comment.findById({id})
        if (comment){
            if (permissions.isAuthor(req, comment)){
                // this will also remove all the comments
                await comment.remove()
            }else{
                return res.status(403).json("you are not the author of this comment")
            }
            return res.status(200).json(comment)
        }
        else{
            return res.status(404).json("Comment not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
} 
const updateComment = async (req,res)=>{
    const {body, spoiler} = req.body
    try {
        const comment = await Comment.findById(req.params.id)
        if (permissions.isAuthor(req,comment)){
            await Comment.findByIdAndUpdate(req.params.id,{
                body:body,
                spoiler:spoiler,
            },options)
            return res.status(201).json({detail:'ok', resource:await getFullComment(comment)})
        }else{
            return res.status(403).json("you can't update someone else's comment.")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const likeComment = async (req,res)=>{
    try {
        // any logged user can like
        const comment= await Comment.findByIdAndUpdate(req.params.id,{$addToSet:{likes:req.params.userId}},options)
        return res.status(200).json({detail:'ok',resource:await getFullComment(comment)})

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unlikeComment = async (req,res)=>{
    try {
        // any logged user can like
        const comment= await Comment.findByIdAndUpdate(req.params.id,{$pull:{likes:req.params.userId}},options)
        return res.status(200).json({detail:'ok',resource:await getFullComment(comment)})

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

module.exports = {
    getCommentsByPost,
    addComment,
    removeComment,
    updateComment,
    likeComment,
    unlikeComment,
}