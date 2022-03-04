 const { promisify } = require('util');
 const User = require('../Models/userModel');
 const jwt = require('jsonwebtoken')
 const AppError = require('../utils/appError');
 //  const catchAsync = require('utils/catchAsync');
 const sendEmail = require('../utils/email')
 const crypto = require('crypto');
 const { catchAsync } = require('catch-async-express');
 const dotenv = require('dotenv');

 exports.signup = async(req, res, next) => {
     try {
         const newUser = await User.create({
             name: req.body.name,
             email: req.body.email,
             password: req.body.password,
             confirmPassword: req.body.confirmPassword,
             passwordChangedAt: req.body.passwordChangedAt
         });
         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
             expiresIn: '3 days',
         })

         //  console.log(req.body)

         res.status(200).json({
             status: 'success',
             token,
             data: {
                 user: newUser
             }
         });
     } catch (err) {

         res.status(404).json({
             status: 'error',

             message: err.message
         })
     }
     next();
 }

 exports.login = async function(req, res, next) {
     const { email, password } = req.body;
     //Check if email and password exist
     if (!email || !password) {
         return next(new AppError('Please provide a valid email address and password.', 400));
     }
     //Check if user exits and password is correct
     const user = await User.findOne({ email }).select('+password');

     if (!user || !await user.correctPassword(password, user.password)) {
         return next(new AppError('User Email or Password is incorrect', 401))
     }


     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '3 days',
     })

     res.status(200).json({
         status: 'success',
         token
     })
 }

 exports.forgotPassword = async function(req, res, next) {

     //Check if user exists
     const user = await User.findOne({ email: req.body.email })
     if (!user) {
         return next(new AppError('There is no user with this email address', 404))
     }

     //Generate the random reset token 
     const resetToken = user.createPasswordResetToken()
     await user.save({ validateBeforeSave: false });

     //send it to user's mail
     const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
     //  console.log(resetToken);
     //  console.log(resetURL);
     const message = `Forgot your Password? Submit a patch request with your password and confirm password to ${resetURL}.`

     try {

         await sendEmail({
             email: user.email,
             subject: 'Your password reset token(valid for 10 min)',
             message
         })

         res.status(200).json({
             status: 'success',
             message: 'Token sent to Email'
         })
     } catch (err) {
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         await user.save({ validateBeforeSave: false });

         return next(new AppError('There was an error sending the email. Please try again later!'), 500);

     }
 }

 exports.resetPassword = catchAsync(async function(req, res, next) {

     //Get the user based on token
     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


     const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

     //If the user don't exist
     if (!user) {
         return next(new AppError('Token is invalid or has expired', 400))
     }
     //if user exist
     user.password = req.body.password;
     user.confirmPassword = req.body.confirmPassword;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save();


     //Login user by sending JWT

     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '3 days',
     })

     res.status(200).json({
         status: 'success',
         token
     })


 })


 exports.protect = catchAsync(async function(req, res, next) {

     //Getting Token and check if its true or correct
     let token;
     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         //  console.log(req.headers.authorization);
         //  console.log(req.headers.authorization.startsWith('Bearer'));

         token = req.headers.authorization.split(' ')[1];
     }
     //  console.log(token)
     if (!token) {
         return next(new AppError('You are not logged in. Please log in to get access!', 401));

     }
     //    else {
     //      //  console.log("HRLRRLKLSRKLS");
     //     //  next();
     //  }

     //  verifying the token

     const decoded = await promisify(jwt.verify)(token, `${process.env.JWT_SECRET}`);
     //  console.log(token)
     //  console.log(decoded);

     //Checking if the user still exists
     const freshUser = await User.findById(decoded.id);
     if (!freshUser) {
         return next(new AppError('The User belonging to this token does not exist.', 401));
     }
     //Check if user changed password after the token was issued
     if (freshUser.changedPasswordAfter(decoded.iat)) {
         return next(new AppError('Password got changed recently! Please Log In Again.', 401))
     }
     //Grant Access to Protected Route
     req.user = freshUser
     next();


 })