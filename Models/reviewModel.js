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
            ref: 'Venues',

            // required: [true, 'Review Must belong to a venue']
        },
        vendor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Vendors',
            // required: [true, 'Review must belong to a Vendor']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Review must belong to User']
        }

    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);
reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'venue',
    //     select: 'title',
    //     // model: Venues


    // }).populate({
    //     path: 'vendor',
    //     select: 'title',
    //     // model: Vendors
    // }).populate({
    //     path: 'user',
    //     select: 'name',
    //     // model: Signup
    // })

    this.populate({
        path: 'user',
        select: 'name',
        // model: Venues

    })


    next()
})

const Review = mongoose.model('Reviews', reviewSchema)

module.exports = Review