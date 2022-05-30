const User = require('../../models/User')

// helper functions to decide if a user has permission to do somethin
// admins can do whatever, while normal users can only edit thier own

// object level
const areFriends = (user1, user2)=>{

    if (user2.friends.includes(user1._id))
        return true
    else 
        return false
}

const isAuthor = (req, doc) =>{
    // comment and post both have author property
    if (doc.author === req.userId){
        return true
    }else{
        return false
    }
}
const isBlocked = async (user1,user2)=>{
    if (user2.blockedUsers.includes(user1._id))
        return false
    else 
        return true
}

// request level permission
const isDocumentOwner = (req)=>{
    console.log(req.userId, req.params.id);
    return req.userId === req.params.id
}
const isAdmin = async (req)=>{
    if (req.isAdmin)
        return true
    else 
        return false
}
const isAuthenticated = (req)=>{
    return req.userId?true:false
}



module.exports = {
    isAdmin,
    isDocumentOwner,
    isBlocked,
    areFriends,
    isAuthor,
    isAuthenticated
}