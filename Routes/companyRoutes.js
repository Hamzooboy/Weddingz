const express = require('express');
const companyController = require('../controllers/companyController');
const authController = require('../controllers/authController');
const venueController = require('../controllers/venueController');

const router = express.Router();

router.get('/getCompany/:id', companyController.getCompany)
router.get('/getCompanies', companyController.getAllCompanies);
router.patch('/updateCompany/:id', authController.protect, authController.restrictTo('admin'), companyController.updateCompany);

router.post('/createCompany', authController.protect, authController.restrictTo('admin', 'vendor'), companyController.createCompany)










module.exports = router;