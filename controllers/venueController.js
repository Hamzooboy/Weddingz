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
        // console.log('sadsad')
        console.log(req.body);
        const { title, ratingsAverage, ratingsQuantity, slug, description, price, coords, contactNo, createdAt, category, location, comments, imgCover } = req.body;
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
    try { //Building Query
        const queryObj = {...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(function(el) {
                delete queryObj[el];
            })
            // console.log(req.query, queryObj)

        // Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt\lte)\b/g, match => `$${match}`);


        console.log(JSON.parse(queryStr));


        let query = Venue.find(JSON.parse(queryStr));
        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }
        //LimitingFields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numVenues = await Venue.countDocuments();
            if (skip > numVenues) throw new Error('This page does not exist')
        }




        //ExecuteQuery
        const allVenues = await query;

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