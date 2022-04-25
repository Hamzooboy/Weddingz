const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');



// const catchAsync = require('utils/catchAsync');

const userRouter = require('./Routes/userRoutes');
const venueRouter = require('./Routes/venueRoutes');
const vendorRouter = require('./Routes/vendorRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const companyRouter = require('./Routes/companyRoutes');
const bodyParser = require('body-parser');
const { ratingsAverage, ratingsQuantity, price, category } = require('./Models/venueModel')

app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss({
    whitelist: [
        ratingsAverage, ratingsQuantity, price, category
    ]
}));
app.use(hpp());
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
app.use('/api/v1', reviewRouter)
app.use('/api/v1', companyRouter)
app.use('/api/v1', bookingRouter)






const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`App running on ${port}....`);
})



module.exports = app;