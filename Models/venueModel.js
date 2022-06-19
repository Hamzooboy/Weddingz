const mongoose = require('mongoose');
const slugify = require('slugify');
const Review = require('../Models/reviewModel')
const Company = require('./companyModel')

const venueSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
    },
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
        max: [5, "A Venue must have rating less than 5"],
        set: val => Math.round(val * 10) / 10
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
    },
    isFeatured: {
        type: Boolean,
        default: false

    },
    area: {
        type: String
    },
    address: {
        type: String
    },
    facebookUrl: {
        type: String
    },
    instagramUrl: {
        type: String
    },
    menu: {
        title: {
            type: String
        },
        price: {
            type: String
        },
        foodItemOne: {
            type: String
        },
        foodItemTwo: {
            type: String
        },
        foodItemThree: {
            type: String
        },
        foodItemFour: {
            type: String
        },
        foodItemFive: {
            type: String
        },
        foodItemSix: {
            type: String
        }

    },
    startingYear: {
        type: String
    },
    advanceBooking: {
        type: String,
        min: [1, '1 should be a minimum value'],
        max: [100, 'It cant be more than 100']
    },
    spacesAvailable: {
        type: String
    },
    perHeadMorning: {
        type: String
    },
    perHeadEvening: {
        type: String
    },
    servicesOffered: {
        type: String
    },
    industryExperience: {
        type: Number
    },
    paymentTerms: {
        type: String
    },
    facilitiesOffered: {
        type: String
    },
    travelCost: {
        type: String
    },
    famousEvents: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }







}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

venueSchema.index({ price: 1, ratingsAverage: -1 })
venueSchema.index({ slug: 1 })

venueSchema.virtual('reviews', {
    ref: 'Reviews',
    foreignField: 'venue',
    localField: '_id',
    // model: Review
})

venueSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'venue',
    localField: '_id'
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
        select: 'name'
    })
    next();
})


const Venue = mongoose.model('Venues', venueSchema)
module.exports = Venue;