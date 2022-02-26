const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: 'dqrsr3bgc',
    api_key: '948515295839541',
    api_secret: '0_vWGjSc6TTuAL20TW_sfKX_LII'
});

exports.uploads = function(file, folder) {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: 'auto',
            folder: folder
        })
    })
}