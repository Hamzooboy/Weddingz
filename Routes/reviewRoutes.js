const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController')
const router = express.Router();


router.get('/getAllReviews', reviewController.getAllReviews)
router.post('/createReview', authController.protect, authController.restrictTo('customer'), reviewController.createReview)










module.exports = router;