const User = require('../models/User')
const permission = require('./permissions/permissions')
// helper function
const presentableUser = (user)=>{
    // if there is no _doc then destracture the user...
    const {password, email,blockedUsers, ...doc} = user._doc || user
    return doc
}
const options = {new:true}
// query for users by usernames

// TODO: remove inclue() and quary for the user itself 
// TODO: return info about changed user
// get a user
const getUser = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(user){
            return res.status(200).json(presentableUser(user))
        }else{
            return res.status(404).json("User not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const getUserbyName = async (req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username})
        if(user){
            return res.status(200).json(presentableUser(user))
        }else{
            return res.status(404).json("User not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const getSampleUsers = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if (user){
            const sampleUsers = await User.aggregate([
                // extra pipline to make sure we don't get the requesting user
                { $match: { username: { $not: { $eq: user.username } } } },
                {$sample:{size:8}}])

            if (sampleUsers){
                return res.status(200).json(sampleUsers.map(user=>(presentableUser(user))))
                
            }else{
                return res.status(404).json("could not find users...")
            }
        }else{
            return res.status(404).json("User not found")
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const getFullPeopleList = async (req,res, list)=>{
    try {
        const user = await User.findById(req.params.id)
        if (user){
            const friends = await User.find({
                '_id':{
                    $in:user[list]
                }    
            })
            if (friends){
                return res.status(200).json(friends.map(user=>(presentableUser(user))))
                
            }else{
                return res.status(404).json("could not find users...")
            }
        }else{
            return res.status(404).json("User not found")
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

const updateUser = async (req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            description:req.body.description,
            city:req.body.city,
            country:req.body.country,
            profilePicture:req.body.profilePicture,
            coverPicture:req.body.coverPicture,
        }, options)
        return res.status(200).json({detail:"new info", info:presentableUser(user)})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

const deleteUser = async (req,res)=>{
    // may wanna send email to prosses the delete...
    try {
        const user = await User.findById(req.params.id)
        if (user){
            // delete user from friends,friend requests , followers, following, and blocked list of others
            // so.. deep clean the database from the user
            // looks heavy, but it's not ment to happend often...
            await User.updateMany({friends:user._id},{$pull:{friends:user._id}})
            await User.updateMany({blockedUsers:user._id},{$pull:{blockedUsers:user._id}})
            await User.updateMany({friendRequests:user._id},{$pull:{friendRequests:user._id}})
            await User.updateMany({followers:user._id}, {$pull:{followers:user._id}})
            await User.updateMany({following:user._id}, {$pull:{following:user._id}})
            // posts from deleted users and thier comments will not be deleted when a user is deleted,
            //(like in redit)
            await user.remove()
            return res.status(200).json({detail:"new info", info:presentableUser(user)})
        }
        else{
            return res.status(404).json("User not found")
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

const addFriendRequest = async (req,res)=>{
    // add friend request to another user, unless this user 
    //has the oher user pending
    try {
        // first make sure they both exist
        let sendingUser = await User.findById(req.params.id)
        let recivingUser = await User.findById(req.params.friendId)
        if (sendingUser && recivingUser){
            if (req.params.id === req.params.friendId){
                return res.status(400).json("You can't befriend yourself ")
            }
            if (recivingUser.friends.includes(req.params.id)){
                return res.status(400).json("you are already friends")
            }
            // see if the requesting user already sent a request
            if (recivingUser.friendRequests.includes(req.params.id)){
                return res.status(400).json("you already sent a friend request to that user")
            }
            else if(sendingUser.friendRequests.includes(req.params.friendId)){
                    // cheack if the other user sent a request, if so they are friends !
                    // clean their requests:
                    sendingUser = await User.findByIdAndUpdate(req.params.id,{$pull:{friendRequests:req.params.friendId},$addToSet:{friends:req.params.friendId}},options)
                    if (sendingUser){
                        recivingUser = await User.findByIdAndUpdate(req.params.friendId,{$addToSet:{friends:req.params.id},$pull:{friendRequests:req.params.id}},options)
                    }
                    // friend them:
                    // sendingUser = await User.findByIdAndUpdate(req.params.id, {$push:{friends:req.params.friendId}},)
                    // await recivingUser.updateOne({$push:{friends:req.params.id}})
                    return res.status(200).json({detail:"new info",info:{
                        friends:sendingUser.friends,
                        friendRequests:sendingUser.friendRequests
                    }})
            }else{
                // if this user is the first to request. add him to requests
                // this adds the id => id 
                recivingUser = await User.findByIdAndUpdate(req.params.friendId,{$addToSet:{friendRequests:req.params.id}},options)
                return res.status(200).json({detail:"resource updated",info:{friendRequests:recivingUser.friendRequests}})
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }

}
const removeFriendRequest = async (req,res)=>{
    // this is the way to both decline a friend or redo a request
    // both have permission
    try {
        // first make sure they both exist
        let sendingUser = await User.findById(req.params.id)
        let recivingUser = await User.findById(req.params.friendId)
        if (sendingUser && recivingUser){
            if (sendingUser.friendRequests.includes(req.params.friendId)){
                // if user has them in his own friends list, remove them (decline)
                sendingUser = await User.findByIdAndUpdate(req.params.id,{$pull:{friendRequests:req.params.friendId}},options)
                return res.status(200).json({detail:"new info",info:{friendRequests:sendingUser.friendRequests}})
            }else if (recivingUser.friendRequests.includes(req.params.id)){
                // if its the other way around, the user wants to (undo)
                recivingUser = await User.findByIdAndUpdate(req.params.friendId,{$pull:{friendRequests:req.params.id}},options)
                return res.status(200).json({detail:"resource updated",info:{friendRequests:recivingUser.friendRequests}})
            }
            else{
                // its a bad request
                return res.status(400).json("user not in friend requests")
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

const removeFriend = async (req,res)=>{
    try {
        let sendingUser = await User.findById(req.params.id)
        const recivingUser = await User.findById(req.params.friendId)
        if (permission.areFriends(sendingUser,recivingUser)){
            if (sendingUser && recivingUser){
                // remove the other user from both friend lists
                sendingUser = await User.findByIdAndUpdate(req.params.id,{$pull:{friends:req.params.friendId}}, options)
                await recivingUser.updateOne({$pull:{friends:req.params.id}})
                return res.status(200).json({detail:"new info",info:{friends:sendingUser.friends}})
            }else{
                return res.status(404).json("user not found")
            }
        }else{
            return res.status(403).json("you cannot unfriend someone who is not your friend")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const followUser = async (req,res)=>{
    try {
        let sendingUser = await User.findById(req.params.id)
        const recivingUser = await User.findById(req.params.friendId)
        if(sendingUser && recivingUser){
            if(sendingUser.following.includes(req.params.friendId)){
                return res.status(400).json("you already follow this user")
            }else{
                // they can follow this user...
                sendingUser = await User.findByIdAndUpdate(req.params.id,{$addToSet:{following:req.params.friendId}},options)
                await recivingUser.updateOne({$addToSet:{followers:req.params.id}},options)
                return res.status(200).json({detail:"new info",info:{following:sendingUser.following}})
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unfollowUser = async (req,res)=>{
    // remove from both user's lists
    try {
        let sendingUser = await User.findById(req.params.id)
        const recivingUser = await User.findById(req.params.friendId)
        if(sendingUser && recivingUser){
            if(!sendingUser.following.includes(req.params.friendId)){
                return res.status(400).json("you don't follow this user")
            }else{
                // they can unfollow this user...
                sendingUser = await User.findByIdAndUpdate(req.params.id,{$pull:{following:req.params.friendId}},options)
                await recivingUser.updateOne({$pull:{followers:req.params.id}}, options)
                return res.status(200).json({detail:"new info",info:{following:sendingUser.following}})
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeFollower = async (req,res)=>{
    // remove from both user's lists
    try {
        let sendingUser = await User.findById(req.params.id)
        const recivingUser = await User.findById(req.params.friendId)
        if(sendingUser && recivingUser){
            if(!recivingUser.followers.includes(req.params.id)){
                return res.status(400).json("this user does not follow you")
            }else{
                // they can remove this user...
                sendingUser = await sendingUser.updateOne(req.params.id, {$pull:{followers:req.params.friendId}},options)
                await recivingUser.updateOne({$pull:{following:req.params.id}},options)
                return res.status(200).json({detail:"new info",info:{following:sendingUser.followers}})
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }

}
const addToWatchList =async (req,res)=>{
    // the database dosent store movies and shows. it keeps their ids from external api,
    // all that stuff is handled by the client...
    try {
        // this will only add if the id not in array already
        const user = await User.findByIdAndUpdate({_id:req.params.id},{$addToSet:{watchList:req.params.movieId}}, options)
        if (user){
            return res.status(200).json({detail:"new info",info:{watchList:user.watchList}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeFromWatchList = async (req,res)=>{
    try {
        // this will only add if the id not in array already
        const user = await User.findByIdAndUpdate({_id:req.params.id},{$pull:{watchList:req.params.movieId}},options)
        if (user){
            return res.status(200).json({detail:"new info",info:{watchList:user.watchList}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const recommend = async (req,res)=>{
    try {
        // add movie to reccomended of another user, 
        const sendingUser = await User.findById(req.params.id)
        let recivingUser = await User.findById(req.params.friendId)
        if (sendingUser && recivingUser){
            if (permission.areFriends(sendingUser,recivingUser)){
                console.log(req.params.movieId)
                recivingUser = await User.findByIdAndUpdate(req.params.friendId,{$addToSet:{[`recommended.${req.params.movieId}`]:req.params.id}},options)
                return res.status(200).json({detail:"resource updated",info:presentableUser(recivingUser)})
            }else{
                return res.status(403).json("you cannot recoomand movie to a non-friend")
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const unrecommend = async (req,res)=>{
    try {
        const sendingUser = await User.findById(req.params.id)
        let recivingUser = await User.findById(req.params.friendId)
        if (sendingUser && recivingUser){
            if (permission.areFriends(sendingUser,recivingUser)){
                recivingUser = await User.findByIdAndUpdate(req.params.friendId,{$pull:{[`recommended.${req.params.movieId}`]:req.params.id}},options)
                const recoList = recivingUser.recommended.get(req.params.movieId)
                if (recoList && recoList.length===0){
                    await User.findByIdAndUpdate(req.params.friendId,{$unset:{[`recommended.${req.params.movieId}`]:""}},options)
                }
                return res.status(200).json({detail:"resource updated",info:presentableUser(recivingUser)})
            }else{
                return res.status(403).json("you cannot unrecoomand movie to a non-friend")
            }
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeFromRecommended = async (req,res)=>{
    try {
        // remove movie to reccomended, 
        const user = await User.findByIdAndUpdate({_id:req.params.id},
            {$unset:{[`recommended.${req.params.movieId}`]:""}}
        ,options)
        if (user){
            return res.status(200).json({detail:"new info",info:{recommended:user.recommended}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const addToWatchedMovies = async (req,res)=>{
    // add to watched and remove from towatch
    try {
        const user = await User.findByIdAndUpdate(req.params.id, 
            {$pull:{watchList:req.params.movieId},
            $addToSet:{watchedList:req.params.movieId}}, options)
        if (user){
            return res.status(200).json({detail:"new info",info:{watchedList:user.watchedList}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeFromWatchedMovies =  async (req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, 
            {$pull:{watchedList:req.params.movieId}},options)
        if (user){
            return res.status(200).json({detail:"new info",info:{watchedList:user.watchedList}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const addToFavorites = async (req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, 
            {$addToSet:{favorites:req.params.movieId}},options)
        if (user){
            return res.status(200).json({detail:"new info",info:{favorites:user.favorites}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}
const removeFromFavorites = async (req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, 
            {$pull:{favorites:req.params.movieId}},options)
        if (user){
            return res.status(200).json({detail:"new info",info:{favorites:user.favorites}})
        }else{
            return res.status(404).json("user not found")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
}

module.exports = {
    removeFromFavorites,
    addToFavorites,
    addToWatchedMovies,
    removeFromRecommended,
    recommend,
    unrecommend,
    removeFromWatchList,
    getUser,
    getUserbyName,
    updateUser,
    deleteUser,
    addFriendRequest,
    removeFriendRequest,
    removeFriend,
    followUser,
    unfollowUser,
    removeFollower,
    addToWatchList,
    removeFromWatchedMovies,
    getSampleUsers,
    getFullPeopleList,
}
