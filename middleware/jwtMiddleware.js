const jwt = require('jsonwebtoken')

const auth = async (req,res,next)=>{
    if (!req.headers.authorization){
        // if no authorization, it's ok, permissions check if a user is logged in
        req.userId = null
        next()
    }else{
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
            req.userId = decoded?.id
            if(req.userId){
                next()
            }//else{
            //     console.log("auth failed");
            //     res.status(401).json("Login Required")
            // }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError){
                // if the token is expired it needs to get a new one via reffresh
                // why not do the cookie fetching here for refresh? 
                // laziness.
                res.status(401).json("Login Required")
            }else{
                res.status(400).json("bad authorization")
            }
        }
    }
    

}

module.exports= auth