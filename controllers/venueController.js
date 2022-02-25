const Venue = require('../Models/venueModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('catch-async-express');


exports.createVenue = async function(req, res, next) {
    try {
        const newVenue = await Venue.create(req.body)
        res.status(200).json({
            status: 'success',
            data: {
                venue: newVenue
            }

        })
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })


    }
    return next();
}

exports.getAllVenues = async function(req, res, next) {
    try {
        const allVenues = await Venue.find();

        res.status(200).json({
            status: 'success',
            results: allVenues.length,
            data: {
                allVenues
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err
        })

    }
}