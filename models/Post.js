const mongo = require('mongoose')
//this shoud be required after comment ...
const Comment = require('./Comment')
// making a post schema
// post can have a title, a body and a movie it's about.
const PostSchema = new mongo.Schema({
    author:{
        type:String
    },
    spoiler:{
        type:Boolean,
        default:true
    },
    title:{
        type:String
    },
    body:{
        type:String,
        maxlength: 300
    },
    movie:{
        type:String
    },
    likes:{
        // list of people who liked this post.
        type:[String],
        default:[]
    },
    commentsCount:{
        type:Number,
        default:0
    }

},{ timestamps: true })

PostSchema.pre('remove', async ()=>{
    // when a post is removed, so are all it's comments (won't trigger on mass delete)
    await Comment.deleteMany({post:this._id})
})

module.exports = mongo.model('posts',PostSchema)