const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,       
        unique: true
    },
    subtitle: {
        type: String,
        require: true  
    },
    description: {
        type: String,
        required: true  
    },
    image: {
        type: String,
       
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;