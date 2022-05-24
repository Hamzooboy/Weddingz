const mongoose = require('mongoose');
const slugify = require('slugify');


const blogsSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    title: [{
        type: String,
        required: [true, 'A blog must have a title']
    }],
    photos: [{
        type: String
    }],
    description: [{
        type: String
    }],
    shortDescription: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false

    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
blogsSchema.index({ slug: 1 })

blogsSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {
        lower: true
    })
    next();
})

blogsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userID',
        select: 'name'
    })
    next();
})

const Blog = mongoose.model('Blogs', blogsSchema);
module.exports = Blog;