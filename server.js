const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');
const Venue = require('./Models/venueModel')

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


// const testVenues = new Venue({
//     title: 'Al Nazir Palace',
//     info: {
//         price: '2500Rs'
//     }
// })

// testVenues.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.error(err)
// })

mongoose.connect(`${process.env.DATABASE}`).then(function(con) {
    console.log("DB connection successfully established");
});