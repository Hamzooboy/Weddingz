const express = require('express');
const vendorController = require('../controllers/vendorController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();


router.post('/vendors', upload.array('photos'), vendorController.createVendor);
router.get('/vendors', vendorController.getVendor);
router.patch('/vendors/:id', upload.array('photos'), vendorController.updateVendor);
router.delete('/vendors/:id', vendorController.deleteVendor);


module.exports = router;