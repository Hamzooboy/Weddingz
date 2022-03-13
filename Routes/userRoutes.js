const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
// const catchAsync = require('utils/catchAsync');



const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.use(authController.protect)

router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.get('/me', authController.protect, userController.getMe);
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.use(authController.restrictTo('admin'))
router.delete('/deleteUser/:id', authController.protect, authController.restrictTo('admin'), userController.deleteUser);
router.patch('/updateUser/:id', authController.protect, authController.restrictTo('admin'), userController.updateUser);

router.get('/getAllUsers', authController.protect, authController.restrictTo('admin'), userController.getAllUsers);


//router.post('/:tourId/reviews', authController.protect, authController.restrictTo('customer'), reviewController.createReview)





module.exports = router;