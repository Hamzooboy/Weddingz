const mongoose = require('mongoose');
const Venue = require('../Models/venueModel');
const Vendor = require('../Models/vendorModel');
const Signup = require('../Models/userModel');



const reviewSchema = new mongoose.Schema({
        review: {
            type: String,
            required: [true, 'Review Field must not be left empty']
        },
        reviewRating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        venue: {
            type: mongoose.Schema.ObjectId,
            ref: 'Venues',

            // required: [true, 'Review Must belong to a venue']
        },
        vendor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Vendors',
            // required: [true, 'Review must belong to a Vendor']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Review must belong to User']
        }

    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);

reviewSchema.index({ venue: 1, user: 1 }, { unique: true })
reviewSchema.index({ vendor: 1, user: 1 }, { unique: true })


reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'venue',
    //     select: 'title',
    //     // model: Venues


    // }).populate({
    //     path: 'vendor',
    //     select: 'title',
    //     // model: Vendors
    // }).populate({
    //     path: 'user',
    //     select: 'name',
    //     // model: Signup
    // })

    this.populate({
        path: 'user',
        select: 'name',
        // model: Venues

    })


    next()
})

reviewSchema.statics.calcAverageRatings = async function(venueId) {
    // console.log('sadas')
    const stats = await this.aggregate([{
                $match: {
                    venue: venueId,

                },
            },
            {
                $group: {
                    _id: '$venue',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$reviewRating' }
                }
            },
            // { $match: { vendor: vendorId } },
            // {
            //     $group: {
            //         _id: '$vendor',
            //         nRating: { $sum: 1 },
            //         avgRating: { $avg: '$reviewRating' }
            //     }
            // }
        ])
        // console.log(stats)

    if (stats.length > 0) {
        await Venue.findByIdAndUpdate(venueId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating

        })
    } else {
        await Venue.findByIdAndUpdate(venueId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5

        })
    }

}

reviewSchema.statics.calcAverageRatingsTwo = async function(vendorId) {
    // console.log('sadas')
    const stats = await this.aggregate([{
                $match: {
                    vendor: vendorId,

                },
            },
            {
                $group: {
                    _id: '$vendor',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$reviewRating' }
                }
            },
            // { $match: { vendor: vendorId } },
            // {
            //     $group: {
            //         _id: '$vendor',
            //         nRating: { $sum: 1 },
            //         avgRating: { $avg: '$reviewRating' }
            //     }
            // }
        ])
        // console.log(stats)

    if (stats.length > 0) {
        await Vendor.findByIdAndUpdate(vendorId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating

        })
    } else {
        await Vendor.findByIdAndUpdate(vendorId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5

        })
    }



}

reviewSchema.post('save', function(doc) {


    doc.constructor.calcAverageRatings(this.venue)


})
reviewSchema.post('save', function(doc) {
    doc.constructor.calcAverageRatingsTwo(this.vendor)

})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.clone().findOne();
    console.log(this.r)
    next();
})
reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.venue)
})
reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatingsTwo(this.r.vendor)
})


const Review = mongoose.model('Reviews', reviewSchema)
    // reviewSchema.post('save', function(doc) {
    //     doc.constructor.calcAverageRatings(this.venue)

// })

module.exports = Review