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

router.use(authController.protect)

router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'))
router.delete('/deleteUser/:id', userController.deleteUser);
router.patch('/updateUser/:id', userController.updateUser);

router.get('/getAllUsers', userController.getAllUsers);


//router.post('/:tourId/reviews', authController.protect, authController.restrictTo('customer'), reviewController.createReview)





module.exports = router;