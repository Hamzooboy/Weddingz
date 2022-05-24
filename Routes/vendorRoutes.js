const express = require('express');
const vendorController = require('../controllers/vendorController');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();


router.post('/vendors', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), vendorController.createVendor);
router.get('/vendors', vendorController.getVendor);
router.get('/vendors/:id', vendorController.getSingleVendor)

router.get('/vendors/bridalWear', vendorController.getbridalWear)
router.get('/vendors/groomWear', vendorController.getgroomWear);
router.get('/vendors/photographers', vendorController.getPhotographers)
router.get('/vendors/parlors', vendorController.getParlors)
router.get('/vendors/decors', vendorController.getDecors)
router.get('/vendors/catering', vendorController.getCatering)
router.get('/vendors/honeymoon', vendorController.getHoneymoon)
router.get('/vendors/featuredVendors', vendorController.getFeaturedVendors)
router.get('/getMyVendors', authController.protect, vendorController.getMyVendors)

router.patch('/vendors/:id', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), vendorController.updateVendor);
router.patch('/approve/:id', authController.protect, authController.restrictTo('admin'), vendorController.updateStatus)
router.patch('/vendors/makeFeatured/:id', authController.protect, authController.restrictTo('admin'), vendorController.makeFeatured)
router.delete('/vendors/:id', authController.protect, authController.restrictTo('admin', 'vendor'), vendorController.deleteVendor);

router.post('/vendors/:vendorId/reviews', authController.protect, authController.restrictTo('customer'), reviewController.createReview)
router.get('/vendors/:vendorId/reviews', reviewController.getAllReviews)





module.exports = router;


//Bookings and Company(1:M) Model