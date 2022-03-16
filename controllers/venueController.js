// const Review = require('../models/reviewModel')
const Venue = require('../Models/venueModel');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');
const Company = require('../Models/companyModel')


const { catchAsync } = require('catch-async-express');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const { restart } = require('nodemon');
const { findByIdAndDelete } = require('../Models/venueModel');
const APIFeatures = require('../utils/APIFeatures');

exports.createVenue = async function(req, res, next) {
    try {
        if (!req.body.company) {
            req.body.company = req.params.companyId;
        }
        if (!req.body.user) {
            req.body.user = req.user.id;
        }
        // console.log('sadsad')
        // console.log(req.body);
        const { title, userID, ratingsAverage, ratingsQuantity, slug, description, price, coords, contactNo, createdAt, category, location, comments, imgCover, cateringPolicy, decorPolicy, DJPolicy, refundPolicy, kitchen, website, parking } = req.body;
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');
        console.log(req.body.category)

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
            userID,
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
            refundPolicy,

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
        let filter = {};
        if (req.params.companyId) {
            filter = { company: req.params.companyId }
        }

        const features = new APIFeatures(Venue.find(filter), req.query).search().filter().sort().limitFields().paginate();
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
exports.getVenue = async function(req, res, next) {
    try {
        // const userID = req.body.userID
        const venue = await Venue.findById(req.params.id).populate({
            path: 'reviews',
            ref: 'Reviews'
        })


        if (!venue) {
            return next(new AppError('No Venue with that ID', 404))
        }
        res.status(200).json({
            status: 'success',
            data: {
                venue
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}


exports.updateVenue = factory.updateAd(Venue);
// exports.updateVenue = async function(req, res, next) {
//     try {
//         // console.log(req.body)
//         const updatedVenue = await Venue.findByIdAndUpdate({ _id: req.params.id }, req.body, photos, {
//             new: true,
//             runValidators: true
//         })
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 updatedVenue
//             }
//         })



//     } catch (err) {
//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         })
//     }
//     return next();


// }


exports.deleteVenue = factory.deleteOne(Venue)
    // exports.deleteVenue = async function(req, res, next) {
    //     try {
    //         const venue = await Venue.findByIdAndDelete(req.params.id);
    //         res.status(200).json({
    //             status: 'success',
    //             data: {
    //                 venue: null
    //             }
    //         })
    //     } catch (err) {
    //         res.status(400).json({
    //             status: 'error',
    //             message: err
    //         })
    //     }
    //     return next();

// }

exports.getBanquetHalls = async function(req, res, next) {
    try {
        const venue = await Venue.aggregate([{
            $match: { category: 'Banquet Halls' }
        }])
        res.status(200).json({
            status: 'success',
            data: {
                venue
            }

        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        })
    }
    return next();
}

exports.getfarmHouses = async function(req, res, next) {
    try {
        const venue = await Venue.aggregate([{
            $match: { category: 'Farmhouses' }
        }])

        res.status(200).json({
            status: 'success',
            data: {
                venue
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }
}

exports.getMarquees = async function(req, res, next) {
    try {
        const venue = await Venue.aggregate([{
            $match: { category: 'Marquees' }
        }])
        res.status(200).json({
            status: 'success',
            data: {
                venue
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}