const validId = (req,res,next)=>{
    // those are the 3 types of id I use
    
    if(req.params.id && !req.params.id.match(/^[a-fA-F0-9]{24}$/)){
        return res.status(400).json("invalid Id")
    }
    
    
    next()
}
const validFriendId = (req,res,next)=>{
    if(req.params.friendId && !req.params.friendId.match(/^[a-fA-F0-9]{24}$/)){
        return res.status(400).json("invalid Id")
    }
    next()
}

const validAuthorId = (req,res,next)=>{
    if(req.body.author && !req.body.author.match(/^[a-fA-F0-9]{24}$/)){
        return res.status(400).json("invalid Id")
    }
    next()
}
const validUserId = (req,res,next)=>{
    if(req.params.userId && !req.params.userId.match(/^[a-fA-F0-9]{24}$/)){
        return res.status(400).json("invalid Id")
    }
}


module.exports ={ 
    validId,
    validAuthorId,
    validFriendId,
    validUserId,
}