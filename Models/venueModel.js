const mongoose = require('mongoose');
const slugify = require('slugify');

const venueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A Banquet Hall must have a name'],
        unique: true,
        trim: true,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "A Venue must have rating above 1"],
        max: [5, "A Venue must have rating less than 5"]
    },
    slug: {
        type: String
    },

    photos: {
        type: [{ String }]
    },
    description: {
        type: String
    },
    info: {
        price: {
            type: String,
            required: [true, 'A venue must have a price']
        },
        coords: {
            longitude: {
                type: Number
            },
            latitude: {
                type: Number
            }
        }
    },
    imgCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})



const Venue = mongoose.model('Venues', venueSchema)
module.exports = Venue;