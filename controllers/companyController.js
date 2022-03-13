const Company = require('../Models/companyModel');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');
const { catchAsync } = require('catch-async-express');
const APIFeatures = require('../utils/APIFeatures');
const { findByIdAndDelete } = require('../Models/companyModel');
const Venue = require('../Models/venueModel');


exports.getAllCompanies = async function(req, res, next) {
    try {

        // console.log('asdasdsadsa')
        // let filter = {};

        // if (req.params.companyId) {
        //     filter: { company: req.params.companyId }
        // }
        const features = new APIFeatures(Company.find(), req.query).search().filter().sort().limitFields().paginate();

        const allCompanies = await features.query;
        // console.log(<i class="fas fa-battery-three-quarters    "></i>)

        return res.status(200).json({
            status: 'success',
            results: allCompanies.length,
            data: {
                allCompanies
            }
        })
    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    next();

};

exports.createCompany = async function(req, res, next) {
    try {
        const { title, userID, venues, slug, description, contactNo, imgCover, createdAt, photos } = req.body;

        const newCompany = await Company.create({
            title,
            userID,
            venues,
            slug,
            description,
            contactNo,
            imgCover,
            createdAt,
            photos
        })
        res.status(200).json({
            status: 'success',
            data: {
                company: newCompany
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'error',
            error: err.message
        })
    }
    next();
}

exports.getCompany = catchAsync(async function(req, res, next) {

    const company = await Company.findById(req.params.id)

    if (!company) {
        return next(new AppError('No Company exists with this ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            company
        }
    })
    next();
})
exports.updateCompany = factory.updateOne(Company)
    // exports.updateCompany = factory.updateAd(Company);
exports.deleteCompany = factory.deleteOne(Company);