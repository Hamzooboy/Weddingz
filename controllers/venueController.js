const Venue = require('../Models/venueModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('catch-async-express');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const { restart } = require('nodemon');
const { findByIdAndDelete } = require('../Models/venueModel');
const APIFeatures = require('../utils/APIFeatures');


exports.createVenue = async function(req, res, next) {
    try {
        // console.log('sadsad')
        console.log(req.body);
        const { title, ratingsAverage, ratingsQuantity, slug, description, price, coords, contactNo, createdAt, category, location, comments, imgCover, cateringPolicy, decorPolicy, DJPolicy, refundPolicy, kitchen, website, parking } = req.body;
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath.url);
            fs.unlinkSync(path);

            // console.log(req.files)
        }



        const newVenue = await Venue.create({
            title,
            ratingsAverage,
            ratingsQuantity,
            slug,
            description,
            price,
            coords,
            contactNo,
            createdAt,
            category,
            location,
            comments,
            imgCover,
            cateringPolicy,
            DJPolicy,
            decorPolicy,
            kitchen,
            parking,
            website,
            refundPolicy

            photos: urls
        })
        res.status(200).json({
            status: 'success',
            data: {

                venue: newVenue
            }

        })
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err.message

        })
        console.log(err)


    }
    return next();
}







exports.getAllVenues = async function(req, res, next) {
    try {
        //ExecuteQuery

        const features = new APIFeatures(Venue.find(), req.query).filter().sort().limitFields().paginate();
        const allVenues = await features.query;

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
        console.log(req.body)
        const updatedVenue = await Venue.findByIdAndUpdate({ _id: req.params.id }, req.body, {
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