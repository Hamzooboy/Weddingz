const express = require('express');
const viewControllers = require('../controllers/viewController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')

const router = express.Router();


router.get('/payment', bookingController.createBookingCheckout, authController.protect, viewControllers.getOverview)




module.exports = router;