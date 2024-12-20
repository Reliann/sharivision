const router = require('express').Router()
const postControl = require('../controllers/postControl')
const permissions = require('../controllers/permissions/permissions')
const {validId, validUserId, validAuthorId} = require('../middleware/validateIds')
// incase I get a quary:
// GET /something?color1=red&color2=blue
// req.query.color1 === 'red'  // true
// req.query.color2 === 'blue' // true

// I want to be able to sort out posts by movie, by author, and by title
router.get('/relevent',(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return postControl.getRelevantPosts(req,res)
    }else{
        return res.status(401).json("only authenticated users can post a post")
    }
})
router.get('/user/:userId',(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return postControl.getPostsByUser(req,res)
    }else{
        return res.status(401).json("only authenticated users can post a post")
    }
})
router.post('/', validAuthorId,(req,res)=>{
    if (permissions.isAuthenticated(req)){
        return postControl.addPost(req,res)
    }else{
        return res.status(401).json("only authenticated users can post a post")
    }
})
router.delete('/:id', validId,(req,res)=>{
    // only author can delete post
    
    return postControl.removePost(req,res)

})
router.put('/:id',validId,(req,res)=>{
    // only author can update post
    return postControl.updatePost(req,res)
})
router.post('/:id/like', validId,(req,res)=>{
    // no one can make this request for someone else
        return postControl.likePost(req,res)
})
router.delete('/:id/like', validId,(req,res)=>{
    // no one can make this request for someone else
        return postControl.unlikePost(req,res)
})


module.exports = router
