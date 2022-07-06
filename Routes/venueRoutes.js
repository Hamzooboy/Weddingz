const express = require('express');
const venueController = require('../controllers/venueController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const bookingController = require('../controllers/bookingController')
    // const reviewRouter = require('../Routes/reviewRoutes');


// const upload = require('../utils/multer');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

// router.use('/venues/:venueId/reviews', reviewRouter);


router.post('/venues', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), venueController.createVenue)
    // router.post('/venues', venueController.createVenue)
router.get('/getVenue/:id', venueController.getVenue)
router.get('/venues', venueController.getAllVenues)
router.get('/venues/featuredVenues', venueController.getFeaturedVenues)
router.get('/venues/banquetHalls', venueController.getBanquetHalls)
router.get('/venues/farmHouses', venueController.getfarmHouses);
router.get('/venues/marquees', venueController.getMarquees);
router.get('/myVenues', authController.protect, venueController.getMyVenues)
router.patch('/venues/:id', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), venueController.updateVenue);
router.patch('/venues/makeFeatured/:id', authController.protect, authController.restrictTo('admin'), venueController.makeFeatured)
router.patch('/venues/updateStatus/:id', authController.protect, authController.restrictTo('admin'), venueController.updateStatus)
router.delete('/venues/:id', authController.protect, authController.restrictTo('admin', 'vendor'), venueController.deleteVenue)
router.delete('/deleteMyVenue/:id', authController.protect, authController.restrictTo('admin', 'vendor'), venueController.deleteMyVenue)

router.post('/venues/:venueId/reviews', authController.protect, authController.restrictTo('customer', 'admin', 'vendor'), reviewController.createReview)
router.get('/venues/:venueId/reviews', reviewController.getAllReviews)
router.get('/venues/:venueId/bookings', bookingController.getAllBookings)





module.exports = router;