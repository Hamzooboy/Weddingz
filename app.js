const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
dotenv.config({ path: "./config.env" })


// const catchAsync = require('utils/catchAsync');

const userRouter = require('./Routes/userRoutes');
const venueRouter = require('./Routes/venueRoutes');
const vendorRouter = require('./Routes/vendorRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const companyRouter = require('./Routes/companyRoutes');
const viewRouter = require('./Routes/viewRoutes');
const blogRouter = require('./Routes/blogRoutes')
const galleryRouter = require('./Routes/galleryRoutes')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { ratingsAverage, ratingsQuantity, price, category } = require('./Models/venueModel')
app.use(morgan("dev"));
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
const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use(compression());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
})






// app.get('/', function(req, res) {
//     res.status(200).json({
//         Status: 'OK',
//         message: 'Hello from the server side'
//     });
// })


app.use('/', viewRouter)
app.use('/api/users', userRouter)
app.use('/api/v1', venueRouter)
app.use('/api/v1', vendorRouter)
app.use('/api/v1', reviewRouter)
app.use('/api/v1', companyRouter)
app.use('/api/v1', bookingRouter)
app.use('/api/v1', blogRouter)
app.use('/api/v1', galleryRouter)






const port = 6000;
// console.log(process.env.PORT)

app.listen(port, function() {
    console.log(`App running on ${port}....`);
})



module.exports = app;