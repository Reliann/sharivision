const mongo = require('mongoose')

// comment has the post id, body, author and likes
const CommentSchema = new mongo.Schema({
    post:{
        type:String
    },
    postAuthor:{
        type:String
    },
    body:{
        type:String,
        maxlength: 300
    },
    reply:{ // comment Id that this commement is for
        type:String,
        default:''
    },
    tag:{
        //username this comment is for
        type:String,
        default:''
    },
    author:{
        type:String
    },
    spoiler:{
        type:Boolean,
        default:true
    },
    likes:{
        type:[String],
        default:[]
    },
    commentsCount:{
        type:Number,
        default:0
    }

},{ timestamps: true })


module.exports = mongo.model('comments',CommentSchema)