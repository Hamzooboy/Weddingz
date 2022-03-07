const mongoose = require('mongoose');
const Venue = require('../Models/venueModel');
const Vendor = require('../Models/vendorModel');
const Signup = require('../Models/userModel');


const reviewSchema = new mongoose.Schema({
        review: {
            type: String,
            required: [true, 'Review Field must not be left empty']
        },
        reviewRating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        venue: {
            type: mongoose.Schema.ObjectId,
            ref: 'Venue',

            // required: [true, 'Review Must belong to a venue']
        },
        vendor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Vendor',
            // required: [true, 'Review must belong to a Vendor']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Signup',
            required: [true, 'Review must belong to User']
        }

    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);
reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'venue',
        select: 'title',
        model: Venue


    }).populate({
        path: 'vendor',
        select: 'title',
        model: Vendor
    }).populate({
        path: 'user',
        select: 'name',
        model: Signup
    })

    next();
})

const Review = mongoose.model('Review', reviewSchema)

// module.exports = Review