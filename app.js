const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();


// const catchAsync = require('utils/catchAsync');

const userRouter = require('./Routes/userRoutes');
const venueRouter = require('./Routes/venueRoutes');
const vendorRouter = require('./Routes/vendorRoutes');
const bodyParser = require('body-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
})






app.get('/', function(req, res) {
    res.status(200).json({
        Status: 'OK',
        message: 'Hello from the server side'
    });
})

app.use('/api/users', userRouter)
app.use('/api/v1', venueRouter)
app.use('/api/v1', vendorRouter)







const port = process.env.PORT || 6000;

app.listen(port, function() {
    console.log(`App running on ${port}....`);
})



module.exports = app;