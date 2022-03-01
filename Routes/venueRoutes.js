const express = require('express');
const venueController = require('../controllers/venueController');


// const upload = require('../utils/multer');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();


router.post('/venues', upload.array('photos'), venueController.createVenue)
    // router.post('/venues', venueController.createVenue)
router.get('/venues', venueController.getAllVenues)
router.patch('/venues/:id', upload.array('photos'), venueController.updateVenue);
router.delete('/venues/:id', venueController.deleteVenue)




module.exports = router;