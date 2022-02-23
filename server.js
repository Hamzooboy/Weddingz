const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' })





// const db = process.env.DATABASE.replace('<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

// mongoose.connect(db).then(function(con) {
//     console.log('DB connection successfully established');
// })

// mongoose.connection.on('error', function(err) {
//     console.log(`Connection error ${err.message}`);
// })

mongoose.connect(`${process.env.DATABASE}`).then(function(con) {
    console.log("DB connection successfully established");
});