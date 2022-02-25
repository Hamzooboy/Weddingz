const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();


// const catchAsync = require('utils/catchAsync');

const userRouter = require('./Routes/userRoutes');
const venueRouter = require('./Routes/venueRoutes');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.get('/', function(req, res) {
    res.status(200).json({
        Status: 'OK',
        message: 'Hello from the server side'
    });
})

app.use('/api/users', userRouter)
app.use('/api/v1', venueRouter)







const port = process.env.PORT || 6000;

app.listen(port, function() {
    console.log(`App running on ${port}....`);
})



module.exports = app;