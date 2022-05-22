const Gallery = require('../Models/galleryModel');
const factory = require('./handlerFactory');
const { catchAsync } = require('catch-async-express')
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary')
const APIFeatures = require('../utils/APIFeatures')
const fs = require('fs')


exports.uploadImage = async function(req, res, next) {
    try {
        const { title, createdAt } = req.body;
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath.url);
            fs.unlinkSync(path)
        }

        const newImage = await Gallery.create({
            title,
            createdAt,
            photos: urls
        })
        res.status(200).json({
            status: 'success',
            data: {
                newImage
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}