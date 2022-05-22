const express = require('express');
const galleryController = require('../controllers/galleryController');
const authController = require('../controllers/authController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();












module.exports = router;