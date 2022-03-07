const express = require('express');
const venueController = require('../controllers/venueController');
const authController = require('../controllers/authController');


// const upload = require('../utils/multer');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();


router.post('/venues', upload.array('photos'), authController.protect, venueController.createVenue)
    // router.post('/venues', venueController.createVenue)
router.get('/getVenue/:id', venueController.getVenue)
router.get('/venues', authController.protect, venueController.getAllVenues)
router.get('/venues/banquetHalls', venueController.getBanquetHalls)
router.get('/venues/farmHouses', venueController.getfarmHouses);
router.get('/venues/marquees', venueController.getMarquees);
router.patch('/venues/:id', upload.array('photos'), venueController.updateVenue);
router.delete('/venues/:id', authController.protect, authController.restrictTo('admin'), venueController.deleteVenue)




module.exports = router;