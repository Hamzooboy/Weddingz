const stripe = require('stripe')('sk_test_51KebqKLo3oIyoa1DRNIY3zKYVKHbcjPgWVkf4w5HCMDlFfduu2KYmmd3Sd9BytVcSk1j4nWKe7zRQm4fBciqSTm600cxBaLNdI')
const Venue = require('../Models/venueModel');
const Vendor = require('../Models/vendorModel')
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { catchAsync } = require('catch-async-express');




exports.getCheckoutSession = catchAsync(async function(req, res, next) {
    //Getting the currently Booked Vendor or Venue
    const venue = await Venue.findById(req.params.venueId);
    // const vendor = await Vendor.findById(req.params.vendorId);

    //Creating Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/venue/${venue.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.venueId,
        line_items: [{
            name: `${venue.name} Venue`,
            description: venue.description,
            // images:[`Can only be implemented once the website is live`]
            amount: venue.price * 100,
            currency: 'pkr',
            quantity: 1



        }]
    });
    //Sending Session as a Response
    res.status(200).json({
        status: 'success',
        session

    })


})