const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString + '-' + file.originalname)
    }
})


const fileFilter = function(req, res, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb({ message: 'Unsupported File Format' }, false)
    }

}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter
})


module.exports = upload;