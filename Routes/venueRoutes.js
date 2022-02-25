const express = require('express');
const venueController = require('../controllers/venueController');

const router = express.Router();


router.post('/venues', venueController.createVenue)
router.get('/venues', venueController.getAllVenues)


module.exports = router;