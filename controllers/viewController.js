const Venue = require('../Models/venueModel');
const User = require('../Models/userModel')
const Booking = require('../Models/bookingsModel');
const { catchAsync } = require('catch-async-express');



exports.getOverview = catchAsync(async function(req, res, next) {
    const venues = await Venue.find();

    res.status(200).json({
            status: 'success',
            title: 'All venues',
            data: {
                venues
            }
        })
        // next();
})