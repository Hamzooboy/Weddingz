const Blog = require('../Models/blogsModel')
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { catchAsync } = require('catch-async-express');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const APIFeatures = require('../utils/APIFeatures');
const fs = require('fs')


exports.createBlog = async function(req, res, next) {
        try {
            const { userID, title, description, createdAt, slug, isFeatured, shortDescription } = req.body;
            const uploader = async(path) => await cloudinary.uploads(path, 'Images');
            const urls = [];
            const files = req.files;

            for (const file of files) {
                const { path } = file;
                const newPath = await uploader(path)
                urls.push(newPath.url);
                fs.unlinkSync(path)
            }


            const newBlog = await Blog.create({
                    userID: req.user.id,
                    title,
                    description,
                    shortDescription,
                    createdAt,
                    slug,
                    isFeatured,
                    photos: urls



                })
                // console.log(userID)
            res.status(200).json({
                status: 'success',
                data: {
                    blog: newBlog
                }
            })

        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
        next();
    }
    // exports.createGallery = async function(req, res, next) {
    //     try {
    //         const { userID } = req.body
    //     } catch (err) {

//     }
// }

exports.getBlogs = async function(req, res, next) {
    try {
        // console.log('asdsadsa');
        const features = new APIFeatures(Blog.find(), req.query).search().filter().sort().limitFields().paginate();
        // console.log('rehan')
        // console.log(features.query)

        const allBlogs = await features.query;
        // console.log('Hamza')
        // console.log(allBlogs)
        // console.log(Blog)
        // const allBlogs = await Blog.find();
        // console.log(allBlogs)

        res.status(200).json({
            status: 'success',
            results: allBlogs.length,
            data: {
                allBlogs
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message
        })
    }
    next();
}
exports.getSingleBlog = async function(req, res, next) {
    try {
        const blog = await Blog.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                blog
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    next();
}

exports.makeFeatured = async function(req, res, next) {
    try {
        const featuredBlog = await Blog.findByIdAndUpdate(req.params.id, { isFeatured: true })
            // console.log(isFeatured)
        res.status(200).json({
            status: 'success',
            data: {
                featuredBlog
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    next();
}
exports.getFeaturedBlogs = async function(req, res, next) {
    try {
        const featuredBlogs = await Blog.aggregate([{
            $match: { isFeatured: true }
        }])
        res.status(200).json({
            status: 'success',
            results: featuredBlogs.length,
            datat: {
                featuredBlogs
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    next();
}



exports.deleteBlog = factory.deleteOne(Blog);
exports.updateBlog = factory.updateOne(Blog);