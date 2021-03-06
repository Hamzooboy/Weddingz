const Vendor = require('../Models/vendorModel')
const AppError = require('../utils/appError');
const { catchAsync } = require('catch-async-express');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const APIFeatures = require('../utils/APIFeatures');
const factory = require('./handlerFactory')
const { findByIdAndDelete } = require('../Models/venueModel');
exports.createVendor = async function(req, res, next) {
    try {
        const { title, userID, ratingsAverage, ratingsQuantity, slug, description, price, coords, contactNo, createdAt, category, location, comments, imgCover, servicesOffered, industryExperience, paymentTerms, travelCost, isFeatured, isApproved, area, address, facebookUrl, instagramUrl } = req.body;
        const uploader = async(path) => await cloudinary.uploads(path, 'Images');

        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath.url);
            fs.unlinkSync(path);

            // console.log(req.files)
        }

        const newVendor = await Vendor.create({
            title,
            userID: req.user.id,
            ratingsAverage,
            ratingsQuantity,
            slug,
            description,
            price,
            coords,
            contactNo,
            createdAt,
            category,
            location,
            comments,
            imgCover,
            servicesOffered,
            industryExperience,
            paymentTerms,
            travelCost,
            isFeatured,
            isApproved,
            area,
            address,
            instagramUrl,
            facebookUrl,
            photos: urls
        })
        res.status(200).json({
            status: 'success',
            data: {
                Vendor: newVendor
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }
    next();
}
exports.getVendor = async function(req, res, next) {
    try {
        const features = new APIFeatures(Vendor.find(), req.query).search().filter().sort().limitFields().paginate();
        // console.log(features.query)
        const allVendors = await features.query;
        // let filteredVendorsCount = allVendors.length;

        res.status(200).json({
            status: 'success',
            results: allVendors.length,
            data: {

                allVendors,
                // filteredVendorsCount
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    return next();

}

exports.getSingleVendor = catchAsync(async function(req, res, next) {
    const vendor = await Vendor.findById(req.params.id).populate({
        path: 'reviews',
        ref: 'Reviews'
    })

    if (!vendor) {
        return next(new AppError('No vendor with that ID exists'));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vendor
        }
    })
})




exports.updateVendor = factory.updateAd(Vendor)
    // exports.updateVendor = async function(req, res, next) {
    //     try {
    //         const updatedVendor = await Vendor.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    //             new: true,
    //             runValidators: true
    //         })
    //         res.status(200).json({
    //             status: 'success',
    //             data: {
    //                 updatedVendor
    //             }
    //         })
    //     } catch (err) {
    //         res.status(500).json({
    //             status: 'error',
    //             message: err.message
    //         })
    //     }
    //     return next();
    // }

exports.updateStatus = async function(req, res, next) {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate({ _id: req.params.id }, { isApproved: true })
        res.status(200).json({
            status: 'success',
            data: {
                updatedVendor
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}
exports.makeFeatured = async function(req, res, next) {
    try {
        const featuredVendor = await Vendor.findByIdAndUpdate({ _id: req.params.id }, { isFeatured: true })
        res.status(200).json({
            status: 'success',
            data: {
                featuredVendor
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}
exports.makeUnfeatured = async function(req, res, next) {
    try {
        const vendor = await Vendor.findByIdAndUpdate({ _id: req.params.id }, { isFeatured: false })
        res.status(200).json({
            status: 'success',
            data: {
                vendor
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}




exports.deleteVendor = factory.deleteOne(Vendor)

// exports.deleteVendor = async function(req, res, next) {
//     try {
//         const vendor = await Vendor.findByIdAndDelete(req.params.id);
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 vendor: null
//             }
//         })
//     } catch (err) {
//         res.status(500).json({
//             status: 'error',
//             message: err.message
//         })
//     }
//     return next();
// }
exports.getbridalWear = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Bridal Wear' }
        }])
        return res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
            }
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    // next();
}

exports.getFeaturedVendors = async function(req, res, next) {
        try {
            const vendor = await Vendor.aggregate([{
                $match: { isFeatured: true }
            }])
            res.status(200).json({
                status: 'success',
                results: vendor.length,
                data: {
                    vendor
                }
            })
        } catch (err) {
            res.status(404).json({
                status: 'error',
                message: err.message
            })
        }
    }
    // exports.getgroomWear = async function(req, res, next) {
    //         try {
    //             const features = new APIFeatures(Vendor.aggregate([{ $match: { category: 'Groom Wear' } }]), req.query).search().filter().sort().limitFields().paginate()
    //             const groomWears = await features.query;
    //             res.status(200).json({
    //                 status: 'success',
    //                 results: groomWears.length,
    //                 data: {
    //                     groomWears
    //                 }
    //             })
    //         } catch (err) {
    //             res.status(500).json({
    //                 status: 'error',
    //                 message: err.message
    //             })

//         }
//         next();
//     }
exports.getgroomWear = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Groom Wear' }
        }])
        res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
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
exports.getPhotographers = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Photographers' }
        }])
        res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
    // next();
}

exports.getParlors = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
                $match: { category: 'Parlors' }
            }])
            // console.log(vendor)


        return res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
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
exports.getDecors = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Decor' }
        }])
        res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
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
exports.getCatering = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Catering' }
        }])
        return res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
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
exports.getHoneymoon = async function(req, res, next) {
    try {
        const vendor = await Vendor.aggregate([{
            $match: { category: 'Honeymoon' }
        }])
        res.status(200).json({
            status: 'success',
            results: vendor.length,
            data: {
                vendor
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

exports.getMyVendors = async function(req, res, next) {
    try {
        const userID = req.user.id;
        const vendors = await Vendor.find({ userID })
        res.status(200).json({
            status: 'success',
            results: vendors.length,
            data: {
                vendors
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