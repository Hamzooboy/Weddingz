const stripe = require("stripe")(
    "sk_test_51KebqKLo3oIyoa1DRNIY3zKYVKHbcjPgWVkf4w5HCMDlFfduu2KYmmd3Sd9BytVcSk1j4nWKe7zRQm4fBciqSTm600cxBaLNdI"
);
const Venue = require("../Models/venueModel");
const url = require("url");

const Vendor = require("../Models/vendorModel");
const Booking = require("../Models/bookingsModel");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const { catchAsync } = require("catch-async-express");
const { compareSync } = require("bcryptjs");
// const factory = require('./handlerFactory')

exports.getCheckoutSession = catchAsync(async function(req, res, next) {
    //Getting the currently Booked Vendor or Venue
    const baseURL = req.get('host') === 'localhost:6000' ? 'localhost:3000' : 'weddingzofficial.herokuapp.com'
    const { slot, date } = req.query
    const venue = await Venue.findById(req.params.venueId);
    // const vendor = await Vendor.findById(req.params.vendorId);
    const bookDetail = await Booking.findOne({ slot: slot, createdAt: date, venue: req.params.venueId })
        //Creating Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${baseURL}/paymentsuccessfull?venue=${
      req.params.venueId
    }&user=${req.user.id}&price=${bookDetail.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/venue/${venue.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.venueId,
        line_items: [{
            name: `${venue.title} Venue`,
            description: venue.description,
            // images:[`Can only be implemented once the website is live`]
            amount: bookDetail.price * 100,
            currency: "pkr",
            quantity: 1,
        }, ],
    });
    //Sending Session as a Response
    res.status(200).json({
        status: "success",
        session,
    });
    next();
});

exports.getBookingDetail = catchAsync(async(req, res, next) => {
    console.log("here");
    const { date, venue } = req.query;
    if (!date || !venue) {
        return res.status(401).json({
            status: "Please provide complete data",
        });
    }

    //   Find the booked slots of a venue

    const bookedSlots = await Booking.find({ createdAt: date, venue });

    return res.status(200).json({
        status: "Success",
        data: bookedSlots,
    });
});

exports.createBookingCheckout = catchAsync(async function(req, res, next) {
    // const url_parts = url.parse(req.url, true);
    // const query = url_parts.query;
    // console.log(query)
    // console.log(url_parts)

    // console.log(req.user.id)
    // console.log(req.query.venue)
    // console.log(req.url)
    try {
        // console.log(req.protocol)

        const { user, venue, price, slot, date } = req.body;

        // const price = venue.price
        // console.log('sadsadsadsa')
        // console.log(user, venue, price);

        // Checking if booking already exists with the selected slot:
        const bookingExist = await Booking.find({ venue, slot, createdAt: date });
        if (!bookingExist)
            return res.status(403).json({
                status: "Booking already exists",
                data: "",
            });
        if (!venue && !price) return next();
        console.log(date)
        const newBooking = await Booking.create({
            user,
            venue,
            price,
            slot,
            createdAt: date,
        });
        // console.log(newBooking)
        await newBooking.save();
        // res.redirect(req.originalUrl.split('?')[0])
        res.status(200).json({
            status: "success",
            data: {
                newBooking,
            },
        });
        // return next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

exports.getMyBookings = async function(req, res, next) {
    try {
        const bookings = await Booking.find({ user: req.user.id });

        const venueIDs = bookings.map((el) => el.venue);
        const venues = await Venue.find({ _id: { $in: venueIDs } });
        res.status(200).json({
            status: "success",
            results: venues.length,
            data: {
                venues,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
exports.getVendorBookings = async function(req, res, next) {
    try {
        const bookings = await Booking.find({ user: req.user.id })
        res.status(200).json({
            status: "success",
            results: bookings.length,
            data: {
                bookings
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getAllBookings = async function(req, res, next) {
    try {
        // let filter = {};
        // if (req.params.venueId) {
        //     filter = { venue: req.params.venueId };
        // }
        const bookings = await Booking.find();
        res.status(200).json({
            status: "success",
            results: bookings.length,
            data: {
                bookings,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
exports.getBooking = async function(req, res, next) {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                booking,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.deleteBooking = factory.deleteOne(Booking);
exports.updateBooking = factory.updateOne(Booking);