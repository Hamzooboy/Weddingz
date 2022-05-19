const User = require('../Models/userModel');
const { catchAsync } = require('catch-async-express');
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj;
}


exports.getAllUsers = catchAsync(async function(req, res, next) {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})


exports.updateMe = catchAsync(async function(req, res, next) {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('You cant update your password on this route. Please visit /updatePassword Route for this action', 401))
    }
    //Update User Document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true

    })


    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async function(req, res, next) {
    deletedUser = await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null


    })
})

exports.getMe = catchAsync(async function(req, res, next) {
    req.params.id = req.user.id;
    const user = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.getUser = factory.getOne(User)

exports.deleteUser = factory.deleteOne(User)
    //Do not update password with this
exports.updateUser = factory.updateOne(User);