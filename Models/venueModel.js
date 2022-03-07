const mongoose = require('mongoose');
const slugify = require('slugify');
// const Review = require('../Models/reviewModel')

const venueSchema = new mongoose.Schema({
    userID: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Signup'
    }],
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

    price: {
        type: Number
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

    ,
    imgCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    category: {
        type: String,
        required: [true, 'Please specify a category for this venue'],
        enum: {
            values: [
                'Farmhouses',
                'Banquet Halls',
                'Marquees'

            ]
        }
    },
    // location: {
    //     type: {
    //         type: String,
    //         default: 'Point',
    //         enum: ['Point']
    //     },
    //     coordinates: [Number],
    //     address: String

    // },
    comments: {
        type: String,
        trim: true,
        default: 'Nice Place worth every penny'
    },
    cateringPolicy: {
        type: String
    },
    DJPolicy: {
        type: String
    },
    decorPolicy: {
        type: String
    },
    refundPolicy: {
        type: String
    },
    kitchen: {
        type: String
    },
    parking: {
        type: String
    },
    website: {
        type: String
    }




}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
venueSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'venue',
    localField: '_id',
    // model: Review
})

venueSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {
        lower: true
    })
    next();
})
venueSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userID',
        select: '-__v'
    })
    next();
})


const Venue = mongoose.model('Venues', venueSchema)
module.exports = Venue;