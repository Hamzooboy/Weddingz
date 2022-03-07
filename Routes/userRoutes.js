const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
// const catchAsync = require('utils/catchAsync');



const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe)
router.get('/getAllUsers', userController.getAllUsers);
router.delete('/deleteMe', authController.protect, userController.deleteMe);






module.exports = router;