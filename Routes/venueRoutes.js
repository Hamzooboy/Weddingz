const express = require('express');
const venueController = require('../controllers/venueController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
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
router.get('/venues/banquetHalls', venueController.getBanquetHalls)
router.get('/venues/farmHouses', venueController.getfarmHouses);
router.get('/venues/marquees', venueController.getMarquees);
router.patch('/venues/:id', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), venueController.updateVenue);
router.delete('/venues/:id', authController.protect, authController.restrictTo('admin', 'vendor'), venueController.deleteVenue)

router.post('/venues/:venueId/reviews', authController.protect, authController.restrictTo('customer'), reviewController.createReview)
router.get('/venues/:venueId/reviews', reviewController.getAllReviews)





module.exports = router;