const mongoose = require('mongoose');
const slugify = require('slugify');
const Venue = require('./venueModel')


const companySchema = new mongoose.Schema({
    userID: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }],



    title: {
        type: String,
        required: [true, 'A company must have a name']

    },
    venues: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Venues'
    }],
    slug: {
        type: String
    },
    description: {
        type: String
    },
    contactNo: {
        type: Number
    },
    imgCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    photos: [{ type: String }],

})

companySchema.pre('save', function(next) {
    this.slug = slugify(this.title, {
        lower: true
    })
    next();
})

companySchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userID',
        select: '-__v'
    })
    next()
})


const Company = mongoose.model('Company', companySchema);
module.exports = Company;