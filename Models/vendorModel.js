const mongoose = require('mongoose');
const slugify = require('slugify');

const vendorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A vendor must have its title'],
        unique: true,
        trim: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'A vendor must have a rating 1 or above than 1'],
        max: [5, 'Max Rating you can give is 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    slug: {
        type: String
    },
    photos: [{ type: String }],
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'A vendor must specify its price']
    },
    discountedPrice: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price
            },
            message: 'Discounted price ({VALUE}) must be lower than regular price'
        }
    },
    coords: {
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        }
    },
    contactNo: {
        type: Number
    },
    imgCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    category: {
        type: String,
        required: [true, 'Please specify the category for vendor'],
        enum: {
            values: [
                'Bridal Wear',
                'Groom Wear',
                'Photographers',
                'Parlors',
                'Decor',
                'Catering',
                'Honeymoon'

            ]
        }
    },
    location: {
        type: String
    },
    comments: {
        type: String,
        trim: true,
        default: 'Nice Vendor worth every Penny'
    },
    servicesOffered: {
        type: String,
        trim: true
    },
    industryExperience: {
        type: String
    },
    paymentTerms: {
        type: String
    },
    travelCost: {
        type: String
    }


})

const Vendor = mongoose.model('Vendors', vendorSchema);
module.exports = Vendor;