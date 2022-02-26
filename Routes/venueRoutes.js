const express = require('express');
const venueController = require('../controllers/venueController');


const upload = require('../utils/multer');
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const router = express.Router();


// router.post('/venues', venueController.createVenue, upload.array('photos'))
router.post('/venues', venueController.createVenue)
router.get('/venues', venueController.getAllVenues)
router.patch('/venues/:id', venueController.updateVenue);
router.delete('/venues/:id', venueController.deleteVenue

)


module.exports = router;