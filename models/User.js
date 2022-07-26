const mongo = require('mongoose')
const Comment = require('./Comment')
const Post = require('./Post')
const cloudinary = require("cloudinary").v2;


// making a user schema
const UserSchema = new mongo.Schema({
    // requirements for creating a user:
    username:{
        type:String,
        lowercase:true,
        required:[true,'username is required'],
        trim:true,
        min:[3,'must be atleast 3 charecters, got {value}'],
        max:[20,'maximum 45 charecters allowed'],
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        max:[45,'maximum 45 charecters allowed'],
        min:[3,'must be atleast 3 charecters, got {value}'],
        unique:true,
        // email needs to match email reg expression.
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,'password is required'],
        min:[6,'minimum 6 charecters are required'],
        max:[50,'maximum 50 charecters for a password'],
        default:''
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    // avatar 
    avatar:{
        type:String,
        default:""
    },
    // followers and followings [id,id,id]
    friendRequests:{
        type:[String],
        default:[],
    },
    friends:{
        type:[String],
        default:[],
    },
    followers:{ 
        type:[String],
        default:[],
    },
    following:{
        type:[String],
        default:[],
    },
    // movies ids are those of external api
    // movies and shows added to watch list [id,id,id]
    watchList:{
        type:[String],
        default:[],
    },
    recommended:{
        type: Map,
        of:[String],
        default:{}
    },

    // movies and shows already watched [id,id,id]
    watchedList:{
        type:[String],
        default:[],
    },
    // favorite movies [id,id,id]
    favorites:{
        type:[String],
        default:[],
    },
    // // shows and movies user is waiting for to come out
    // waitList:{
    //     type:[String],
    //     default:[],
    // },
    // is admin? its prett sellf explantory
    isAdmin:{
        type: Boolean,
        default:false,
    },
    // profile info
    description:{
        type:String,
        max:[300,'maximum of 300 charecters are allowed'],
    },
    city: {
        type: String,
        max: [50,'50 charecters are allowed'],
    },
    country: {
        type: String,
        max: [50,'50 charecters are allowed'],
    },
    blockedUsers:{
        type:[String],
        default:[]
    }
    
},{ timestamps: true })

UserSchema.pre('remove', async ()=>{
    // when a user is removed, remove all his posts and thier comments.
    await Post.deleteMany({author:this._id})
    await Comment.deleteMany({postAuthor:this._id})
    // all his comments are marked as deleted user, and related tags.
    await Comment.updateMany({author:this._id}, {author:""})    
    await Comment.updateMany({tag:this.username},{tag:"Deleted User"})
    // also his image on cloud if there is any:
    if (this.avatar){
        try {
            await cloudinary.uploader.destroy(`avatars/${this._id}`);
            
        } catch (error) {
            console.log(error);
        }
    }
    

})

module.exports = mongo.model('user',UserSchema)