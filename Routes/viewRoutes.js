const express = require('express');
const viewControllers = require('../controllers/viewController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')
const Booking = require('../Models/bookingsModel')

const router = express.Router();


// router.get('/', authController.protect, bookingController.createBookingCheckout, viewControllers.getOverview)
router.get('/', authController.protect, bookingController.createBookingCheckout, viewControllers.getOverview)





module.exports = router;