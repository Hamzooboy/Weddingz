const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    venue: {
        type: mongoose.Schema.ObjectId,
        ref: 'Venues',
        // required: [true, 'Booking must belong to a Venue']
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendors',
        // required: [true, 'Booking must belong to a Vendor']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Booking must belong to a Customer']
    },
    price: {
        type: Number,
        required: [true, 'A Booking must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        required: true,
        default: 'Booked'
    }
})
bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'venue',
        select: 'title'
    }).populate({
        path: 'vendor',
        select: 'title'
    })
})


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;