const mongoose = require('mongoose');
const slugify = require('slugify');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String
    },
    photos: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
})


const Gallery = mongoose.model('Gallery', gallerySchema)
module.exports = Gallery