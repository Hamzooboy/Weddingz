const Venue = require('../Models/venueModel');
const Vendor = require('../Models/vendorModel')
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { catchAsync } = require('catch-async-express');




exports.getCheckoutSession = async function(req, res, next) {

}