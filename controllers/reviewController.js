const mongoose = require('mongoose');

const Review = require('../Models/reviewModel');
const { catchAsync } = require('catch-async-express');

exports.getAllReviews = catchAsync(async function(req, res, next) {
    const reviews = await Review.find();
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