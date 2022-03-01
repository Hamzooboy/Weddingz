const express = require('express');
const vendorController = require('../controllers/vendorController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();


router.post('/vendors', upload.array('photos'), vendorController.createVendor);
router.get('/vendors', vendorController.getVendor);
router.get('/vendors/bridalWear', vendorController.getbridalWear)
router.get('/vendors/groomWear', vendorController.getgroomWear);
router.get('/vendors/photographers', vendorController.getPhotographers)
router.get('/vendors/parlors', vendorController.getParlors)
router.get('/vendors/decors', vendorController.getDecors)
router.get('/vendors/catering', vendorController.getCatering)
router.get('/vendors/honeymoon', vendorController.getHoneymoon)


router.patch('/vendors/:id', upload.array('photos'), vendorController.updateVendor);
router.delete('/vendors/:id', vendorController.deleteVendor);



module.exports = router;