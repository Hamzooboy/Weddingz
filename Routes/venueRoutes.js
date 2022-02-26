const express = require('express');
const venueController = require('../controllers/venueController');
const upload = require('../utils/multer');

const router = express.Router();


router.post('/venues', venueController.createVenue, upload.array('photos'))
router.get('/venues', venueController.getAllVenues)


module.exports = router;