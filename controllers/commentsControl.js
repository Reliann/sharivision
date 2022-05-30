const Comment = require('../models/Comment')
const permissions = require('./permissions/permissions')
const Post = require('../models/Post')
const User = require('../models/User')

const options = {new:true}
// can only get comments by post id or author or liker or postOwner (it needs to come with some context..)
const getCommentByParams= async (req, res)=>{

}
const addComment= async (req, res)=>{
    // needs to make sure both the user and the post exists before posting comments..
    const {author, body, post, tag, reply, spoiler} = req.params.body
    try {
        const user = await User.findById(author)
        if (user){
            if (user._id.toString() === req.userId){
                const postCheck = await Post.findById(post)
                if (postCheck){
                    if (reply){
                        const replyCheck = await Comment.findById(reply)
                        if (replyCheck){
                            const newComment = await Comment.create({
                                author:author,
                                body:body,
                                post:post,
                                tag:tag,
                                reply:replyCheck._id,
                                postAuthor:postCheck.author
                            })
                            return res.status(201).json(newComment)
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
                        return res.status(201).json(newComment)
                    }
                    
                }else{
                    return res.status(404).json("post dosn't exit")
                }
                
            }else{
                return res.status(403).json("you can't comment for someone else.")
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
            return res.status(201).json(comment)
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
        await Comment.findByIdAndUpdate(req.params.id,{$addToSet:{likes:req.params.userId}})
        return res.status(200).json("post liked")

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unlikeComment = async (req,res)=>{
    try {
        // any logged user can like
        await Comment.findByIdAndUpdate(req.params.id,{$pull:{likes:req.params.userId}})
        return res.status(200).json("post liked")

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

module.exports = {
    getCommentByParams,
    addComment,
    removeComment,
    updateComment,
    likeComment,
    unlikeComment,
}