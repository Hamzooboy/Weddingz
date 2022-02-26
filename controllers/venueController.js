const Venue = require('../Models/venueModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('catch-async-express');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const { restart } = require('nodemon');
const { findByIdAndDelete } = require('../Models/venueModel');


exports.createVenue = async function(req, res, next) {
    try {
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const urls = []
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath);
            fs.unlinkSync(path);
        }



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
    return next();
}

exports.updateVenue = async function(req, res, next) {
    try {
        const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                updatedVenue
            }
        })



    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        })
    }
    return next();


}
exports.deleteVenue = async function(req, res, next) {
    try {
        const venue = await Venue.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                venue: null
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }

}