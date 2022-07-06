 const { promisify } = require('util');
 const User = require('../Models/userModel');
 const jwt = require('jsonwebtoken')
 const AppError = require('../utils/appError');
 //  const catchAsync = require('utils/catchAsync');
 //  const Email = require('../utils/email');
 const sendEmail = require('../utils/email')
 const crypto = require('crypto');
 const { catchAsync } = require('catch-async-express');
 const dotenv = require('dotenv');



 const createSendToken = function(user, statusCode, res) {

 }

 exports.signup = async(req, res, next) => {
     try {
         const newUser = await User.create({
             name: req.body.name,
             email: req.body.email,
             password: req.body.password,
             confirmPassword: req.body.confirmPassword,
             passwordChangedAt: req.body.passwordChangedAt,
             role: req.body.role
         });

         //  const url = `${req.protocol}://${req.get('host')}`
         //  console.log(url)
         //      //  const message = 'Welcome to Weddingz!!'
         //      //  const text = 'hello'
         //  await new Email(newUser, url).sendWelcome();

         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
             expiresIn: '3 days',
         })
         const cookieOptions = {
             expiresIn: '90 days',
             //  secure: true,(only when we're in production phase)
             httpOnly: true
         }
         if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

         res.cookie('jwt', token, cookieOptions)

         //  console.log(req.body)
         //  password = undefined;

         return res.status(200).json({
             status: 'success',
             token,
             data: {
                 user: newUser
             }
         });
     } catch (err) {

         return res.status(404).json({
             status: 'error',

             message: err.message
         })
     }
     next();
 }

 exports.login = catchAsync(async function(req, res, next) {
     const { email, password } = req.body;
     //Check if email and password exist
     if (!email || !password) {
         return res.status(403).json('Email or password is incorrect')
     }
     //Check if user exits and password is correct
     const user = await User.findOne({ email }).select('+password');

     if (!user || !await user.correctPassword(password, user.password)) {
         return res.status(403).json('Email or password is incorrect')
     }


     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '3 days',
     })
     const cookieOptions = {
         expiresIn: '90 days',
         //  secure: true,(only when we're in production phase)
         httpOnly: true
     }
     if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;


     res.cookie('jwt', token, cookieOptions)

     res.status(200).json({
         status: 'success',
         token
     })
 })
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
     //  const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
     const resetURL = `https://weddingzofficial.herokuapp.com/resetPassword/${resetToken}`;

     //  const resetURL = `http://localhost:6000/api/users/resetPassword/${resetToken}`
     //  console.log(resetToken);
     //  console.log(resetURL);
     const message = `Forgot your Password? Your Reset Password Link is as follows:\n\n${resetURL}\n\n.Click on the above link`
     console.log(resetURL)
     try {

         await sendEmail({
                 email: user.email,
                 subject: 'Your password reset token(valid for 10 min)',
                 message
             })
             //  console.log(email)

         res.status(200).json({
             status: 'success',
             message: 'Token sent to Email'
         })
     } catch (err) {
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         await user.save({ validateBeforeSave: false });

         //  return next(new AppError('There was an error sending the email. Please try again later!'), 500);
         res.status(500).json({
             status: 'error',
             message: err.message
         })
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
     const cookieOptions = {
         expiresIn: '90 days',
         //  secure: true,(only when we're in production phase)
         httpOnly: true
     }
     if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

     res.cookie('jwt', token, cookieOptions)

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
     //  else if (req.cookies.jwt) {
     //      token = req.cookies.jwt
     //  }
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
 exports.isLoggedIn = catchAsync(async function(req, res, next) {
     //  console.log(jwt)
     if (req.cookies.jwt) {
         //Verify Token
         const decoded = await promisify(jwt.verify)(
             req.cookies.jwt,
             `${process.env.JWT_SECRET}`
         )

         //Checking if the user still exists
         const currentUser = await User.findById(decoded.id);
         if (!currentUser) {
             return next();
         }

         //Checking if the user changed the password after the token was issued
         if (currentUser.changedPasswordAfter(decoded.iat)) {
             return next();
         }
         res.locals.user = currentUser;
         return next();
     }
     next();
 })

 exports.restrictTo = function(...roles) {
     return function(req, res, next) {
         if (!roles.includes(req.user.role)) {
             return next(new AppError('You do not have permission to perform this action', 403))
         }
         next();
     }
 }

 exports.updatePassword = catchAsync(async function(req, res, next) {
     //Get user from collection
     const user = await User.findById(req.user.id).select('+password');

     //Check if the posted current password is correct
     if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
         return next(new AppError('Your current password is incorrect', 401))
     }
     //if So update password
     user.password = req.body.password;
     user.confirmPassword = req.body.confirmPassword;
     await user.save();


     //Log in User and Send JWT
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '3 days',
     })

     const cookieOptions = {
         expiresIn: '90 days',
         //  secure: true,(only when we're in production phase)
         httpOnly: true
     }
     if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;


     res.cookie('jwt', token, cookieOptions)

     res.status(200).json({
         status: 'success',
         token
     })


 })