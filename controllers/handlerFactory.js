const { catchAsync } = require('catch-async-express');


exports.deleteOne = Model =>
    async function(req, res, next) {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: 'success',
                data: null

            })
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
        return next();

    }

exports.updateOne = Model => async function(req, res, next) {
    try {
        // console.log(req.body)
        const doc = await Model.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
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

exports.updateAd = Model => async function(req, res, next) {
    try {
        // console.log(req.body)
        const doc = await Model.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
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


exports.getOne = (Model, popOptions) =>
    catchAsync(async(req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });




// exports.updateVenue = async function(req, res, next) {
//     try {
//         // console.log(req.body)
//         const updatedVenue = await Venue.findByIdAndUpdate({ _id: req.params.id }, req.body, photos, {
//             new: true,
//             runValidators: true
//         })
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 updatedVenue
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









// exports.deleteVenue = async function(req, res, next) {
//     try {
//         const venue = await Venue.findByIdAndDelete(req.params.id);
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 venue: null
//             }
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: 'error',
//             message: err
//         })
//     }
//     return next();

// }