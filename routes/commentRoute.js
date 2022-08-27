const router = require('express').Router()
const permissions = require('../controllers/permissions/permissions')
const commentControl = require('../controllers/commentsControl')
const {validId, validUserId, validAuthorId} = require('../middleware/validateIds')

// incase I get a quary:
// GET /something?color1=red&color2=blue
// req.query.color1 === 'red'  // true
// req.query.color2 === 'blue' // true

router.get('/post/:id',validId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.getCommentsByPost(req,res)
    }else{
        return res.status(401).json("only authenticated users can view a comment")
    }
})
router.get('/user/:id',validId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.getCommentsByUser(req,res)
    }else{
        return res.status(401).json("only authenticated users can view a comment")
    }
})
router.get('/comment/:id',validId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.getCommentsByComment(req,res)
    }else{
        return res.status(401).json("only authenticated users can view a comment")
    }
})
router.post('',validAuthorId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.addComment(req,res)
    }else{
        return res.status(401).json("only authenticated users can post a comment")
    }
})
router.delete('/:id',validId,(req,res)=>{
    // only author can delete comment
    return commentControl.removeComment(req,res)
})
router.put('/:id',validId,(req,res)=>{
    // only author can update comment
    return commentControl.updateComment(req,res)
})
router.post('/:id/like',validId, (req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.likeComment(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
router.delete('/:id/like',validId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return commentControl.unlikeComment(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
module.exports = router
