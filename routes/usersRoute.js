const router = require('express').Router()
const userControl = require('../controllers/usersControl')
const permissions = require('../controllers/permissions/permissions')
const { validFriendId, validId} = require('../middleware/validateIds')
const uploadControl = require('../controllers/uploadControl')


/* general user routes*/
// get user by id
router.get('/:id', validId, (req,res)=>{
    return userControl.getUser(req,res)
})
// get some random users
router.get('/sample/:id',validId, (req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.getSampleUsers(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// update a user
router.put('/:id',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return uploadControl.updateUser(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// upload profile image signeture
router.get('/:id/avatar-upload-signature',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return uploadControl.generateSignature(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
router.patch('/:id/avatar',validId,(req,res)=>{
    // give the server the public_id to store in the database 
    if (permissions.isDocumentOwner(req)){
        return uploadControl.uploadImage(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
router.delete('/:id/avatar',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return uploadControl.removeImage(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
//delete a user
router.delete('/:id',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.deleteUser(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* friends control*/
// send friend request, if user is pending, friend them instead
router.post('/:id/friendrequest/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.addFriendRequest(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// remove friend request
router.delete('/:id/friendrequest/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFriendRequest(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})

// remove friend 
router.delete('/:id/removefriend/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFriendRequest(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* followers control*/
// follow user
router.post('/:id/follow/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.followUser(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// unfollow user
router.delete('/:id/follow/:friendId',validFriendId,validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.unfollowUser(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// remove follower
router.delete('/:id/removefollower/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFollower(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* watch list control*/
// add movie to watch list
router.post('/:id/watchlist/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.addToWatchList(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
    
})
// remove movie from watch list
router.delete('/:id/watchlist/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFromWatchList(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* recommandation control*/

// recommand movie to friend 
router.post('/:id/recommend/:movieId/:friendId',validId,validFriendId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.recommend(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// remove movie from recommanded
router.delete('/:id/recommend/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFromRecommended(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* watched movies control*/
// add movie to watched movies, if its in watchlist remove it.
router.post('/:id/watched/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.addToWatchedMovies(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
router.delete('/:id/watched/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFromWatchedMovies(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
/* favorite movies */

// add movie to favorites
router.post('/:id/favorite/:movieId',validId,(req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.addToFavorites(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})
// remove movie from favorites
router.delete('/:id/favorite/:movieId',validId, (req,res)=>{
    if (permissions.isDocumentOwner(req)){
        return userControl.removeFromFavorites(req,res)
    }else{
        return res.status(403).json("you dont have permission to to that.")
    }
})

module.exports = router