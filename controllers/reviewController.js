const mongoose = require('mongoose');

const Review = require('../Models/reviewModel');
const { catchAsync } = require('catch-async-express');
const factory = require('./handlerFactory')

exports.getAllReviews = catchAsync(async function(req, res, next) {
    let filter = {};
    if (req.params.venueId) {
        filter = { venue: req.params.venueId }
    }
    if (req.params.vendorId) {
        filter = { vendor: req.params.vendorId }
    }

    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.createReview = catchAsync(async function(req, res, next) {
    //Allow Nested Routes
    if (!req.body.venue) {
        req.body.venue = req.params.venueId;
    }
    if (!req.body.vendor) {
        req.body.vendor = req.params.vendorId;
    }
    if (!req.body.user) {
        req.body.user = req.user.id;
    }

    const newReview = await Review.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})


exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)