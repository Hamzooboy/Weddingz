const mongoose = require('mongoose');
const slugify = require('slugify');

const venueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A Banquet Hall must have a name'],
        // unique: true,
        // trim: true,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "A Venue must have rating above 1"],
        max: [5, "A Venue must have rating less than 5"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    slug: {
        type: String
    },

    photos: [{ type: String }],
    description: {
        type: String
    },
    info: {
        price: {
            type: String,
            // required: [true, 'A venue must have a price']
        },
        coords: {
            longitude: {
                type: Number
            },
            latitude: {
                type: Number
            }
        },
        contactNo: {
            type: Number
        }

    },
    imgCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String
    },
    location: {
        type: String
    },
    comments: {
        type: String,
        trim: true,
        default: 'Nice Place worth every penny'
    }

})



const Venue = mongoose.model('Venues', venueSchema)
module.exports = Venue;