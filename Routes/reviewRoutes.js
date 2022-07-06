const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController')
const router = express.Router();



router.get('/getAllReviews', reviewController.getAllReviews)
    // router.use(authController.protect)
router.post('/createReview', authController.protect, authController.restrictTo('customer', 'admin', 'vendor'), reviewController.createReview)
router.delete('/deleteReview/:id', authController.protect, authController.restrictTo('customer', 'admin'), reviewController.deleteReview)
router.patch('/updateReview/:id', authController.protect, authController.restrictTo('customer', 'admin'), reviewController.updateReview)







module.exports = router;