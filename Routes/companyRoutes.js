const express = require('express');
const companyController = require('../controllers/companyController');
const authController = require('../controllers/authController');
const venueController = require('../controllers/venueController');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get('/getCompany/:id', companyController.getCompany)
router.get('/getCompanies', companyController.getAllCompanies);
router.patch('/updateCompany/:id', authController.protect, authController.restrictTo('admin'), companyController.updateCompany);

router.post('/createCompany', authController.protect, authController.restrictTo('admin', 'vendor'), companyController.createCompany)

router.post('/companies/:companyId/venues', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'vendor'), venueController.createVenue)
router.get('/companies/:companyId/venues', venueController.getAllVenues)








module.exports = router;