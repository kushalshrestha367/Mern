require('dotenv').config()
const express = require('express');
const connectDB = require('./database');
const Blog = require('./model/blogModel');
const app = express()
app.use(express.json())
//multer configuration
const {multer,storage} =  require('./middleware/multerConfig')
const upload = multer({ storage: storage })

connectDB()

app.get("/",( req,res) => {
    res.send("Hello world");
    
})
app.get("/about",(req,res) => {
   res.status(200).json({
    "message":"This is the about page"
   })
})

app.get("/contact",(req,res) => {
    res.status(200).json({
        "message":"This is the contact page"
    })
})

app.post("/blog",upload.single('image'), async (req,res) => {
    console.log(req.body);
   const {title,subtitle,description,image} = req.body
   await Blog.create({
    title,
    subtitle,
    description,
    image
   })
    res.status(200).json({
        "message":"This is the blog page"
    })
})


app.listen(process.env.PORT || 3000,() => {
    console.log('Server is running on port 3000')
})