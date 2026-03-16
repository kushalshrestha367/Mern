require('dotenv').config()
const express = require('express');
const connectDB = require('./database');
const Blog = require('./model/blogModel');
const app = express()
app.use(express.json())
//multer configuration
const {multer,storage} =  require('./middleware/multerConfig')
const upload = multer({ storage: storage })
//giving access to the storage folder
// app.use('/storage', express.static('storage'));
app.use(express.static('./storage'))
const fs = require('fs')
const cors =  require('cors')
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-front-phi-steel.vercel.app"
  ],
  credentials: true
}));

app.disable('etag')
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
//create blog
app.post("/blog",upload.single('image'), async (req,res) => {
    // console.log(req.body);
    // console.log(req.file);  
   const {title,subtitle,description} = req.body
   let filename;
   if(req.file){
    filename = "https://blog-api-i6kb.onrender.com/" + req.file.filename
   } 
   else{
    filename = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq4h3BoPmq9yom5f23n6vaKCKG70zHcvAnsA&s"
   }
//    const {filename} = req.body
// const filename = req.file.filename
  
   if(!title || !subtitle || !description ){
    return res.status(400).json({
        "message":"All fields are required"
    })
   }
   await Blog.create({
    title: title,
    subtitle: subtitle,
    description: description,
    image : filename
   })
    res.status(200).json({
        "message":"Blog created successfully"
    })
})
//fetch all blogs
app.get("/blog", async (req,res) => {
    const blogs = await Blog.find()
    res.status(200).json({
        "message":"Blogs fetched successfully",
        data: blogs
    })
}
)
//single blog
app.get("/blog/:id", async(req,res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    if(!blog){
        return res.status(404).json({
            "message":"Blog not found"
        })
    }
    res.status(200).json({
        "message":"Blog fetched successfully",
        data: blog
    })
})
//delete blog
app.delete("/blog/:id", async(req,res) => {
    const id = req.params.id
    const blog = await Blog.findByIdAndDelete(id)
    if(!blog){
        return res.status(404).json({
            "message":"Blog not found"
        })
    }
    res.status(200).json({
        message:"Blog deleted successfully",
        data:blog
    })
}
)
//edit blog
app.patch("/blog/:id",upload.single('image'), async(req,res) => {
    const id = req.params.id
    // const {title,subtitle,description} = req.body
      const title = req.body.title || Blog.title
  const subtitle = req.body.subtitle || Blog.subtitle
  const description = req.body.description || Blog.description
    let imageName;
    if(req.file){
        imageName = "https://blog-api-i6kb.onrender.com" + req.file.filename
        const blog = await Blog.findById(id)
        const oldImagePath = blog.image
        fs.unlink(`storage/${oldImagePath}`, (err) => {
            if (err) {
                console.error('Error deleting old image:', err);
            } else {
                console.log('Image updated successfully');
            }
        });
    }

    await Blog.findByIdAndUpdate(id,{
        title: title,
        subtitle: subtitle,
        description: description,
        image: imageName
    })
    // const updatedBlog = await Blog.findById(id)
    res.status(200).json({
        "message":"Blog updated successfully",
        // data: updatedBlog
    })

})

app.listen(process.env.PORT || 3000,() => {
    console.log('Server is running on port 3000')
})