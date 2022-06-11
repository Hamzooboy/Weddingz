const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController')
const router = express.Router();


router.get('/getCheckoutSession/:venueId', authController.protect, bookingController.getCheckoutSession)
router.get('/getMyBookings', authController.protect, bookingController.getMyBookings)
router.get('/getAllBookings', authController.protect, authController.restrictTo('admin'), bookingController.getAllBookings)
router.get('/getBooking/:id', authController.protect, authController.restrictTo('admin', 'vendor'), bookingController.getBooking)
router.delete('/deleteBooking/:id', authController.protect, authController.restrictTo('admin', 'vendor'), bookingController.deleteBooking)
router.patch('/updateBooking/:id', authController.protect, authController.restrictTo('admin', 'vendor'), bookingController.updateBooking)











module.exports = router;