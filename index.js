const express = require('express')
const mongo = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const path = require("path");

// auth middleware
const jwtAuth = require('./middleware/jwtMiddleware')
// local env 
require('dotenv').config();
// cloudinary setup
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET ,
    secure:true
});


// mongo setup
mongo.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    console.log(err?err:'connected to mongoDB');
})

// creating express app
const app = express()

// cors config
// const corsConfig ={
//     origin: 'http://localhost:3000/',
// }

// middleware 

//app.use(cors(corsConfig))
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// Todo: validate all id's are those of existing posts
// routes 
const commentRouter = require('./routes/commentRoute')
app.use('/api/comments/',[jwtAuth,commentRouter])
const postRouter = require('./routes/postsRoute')
app.use('/api/posts/',[jwtAuth,postRouter])
const usersRouter = require('./routes/usersRoute')
// setting both router and auth middleware
app.use('/api/users/',[jwtAuth,usersRouter])
const authRouter = require('./routes/authRoute')
app.use('/api/auth/',authRouter)


app.use(express.static(path.resolve(__dirname, "./frontend/build")));
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./frontend/build", "index.html"));
});


app.listen(process.env.PORT , ()=>{
    console.log('server running')
})

// improvements:
// add email to provide a forgot password page
// chat so people can talk about their shows
// notifications
// add google and facebook authentication with jwt==> https://www.youtube.com/watch?v=npsi7ZkjvQo&ab_channel=DevA.TVietNam
