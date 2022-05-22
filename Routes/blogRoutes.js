const express = require('express');
const blogController = require('../controllers/blogsController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const router = express.Router();


router.post('/createBlog', upload.array('photos'), authController.protect, authController.restrictTo('admin', 'customer'), blogController.createBlog)
router.get('/getBlogs', blogController.getBlogs)
router.get('/getSingleBlog/:id', blogController.getSingleBlog)
router.get('/getFeaturedBlogs', blogController.getFeaturedBlogs)
router.patch('/updateBlog/:id', authController.protect, authController.restrictTo('admin', 'customer'), blogController.updateBlog)
router.patch('/blogs/makeFeatured/:id', authController.protect, authController.restrictTo('admin'), blogController.makeFeatured)
router.delete('/deleteBlog/:id', authController.protect, authController.restrictTo('admin', 'customer'), blogController.deleteBlog)















module.exports = router;