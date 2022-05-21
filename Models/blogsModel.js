const mongoose = require('mongoose');
const slugify = require('slugify');


const blogsSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: [true, 'A blog must have a title']
    },
    authorPic: [{
        type: String
    }],
    description: {
        type: String
    },
    slug: {
        type: String
    }
})

blogsSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {
        lower: true
    })
    next();
})

const Blog = mongoose.model('Blogs', blogsSchema);
module.exports = Blog;