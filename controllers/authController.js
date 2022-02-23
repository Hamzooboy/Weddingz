 const User = require('../Models/userModel');
 const jwt = require('jsonwebtoken')
 const AppError = require('../utils/appError');
 //  const catchAsync = require('utils/catchAsync');
 const sendEmail = require('../utils/email')

 exports.signup = async(req, res, next) => {
     try {
         const newUser = await User.create({
             name: req.body.name,
             email: req.body.email,
             password: req.body.password,
             confirmPassword: req.body.confirmPassword
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
     } catch {

         res.status(404).json({
             status: 'error',

             message: 'could not register user'
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
     const message = `Forgot your Password? Submit a patch request with your password and confirm password to ${resetURL}`

     try {

         await sendEmail({
             email: user.email,
             subject: 'Your password reset token(valid for 10 min)'
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

 exports.resetPassword = async function(req, res, next) {

 }