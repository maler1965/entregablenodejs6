const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const sanitizater = require('perfect-express-sanitizer');

const AppError = require('./utils/appError');
const globalErrorHander = require('./controllers/error.controller');

//routes
const userRoutes = require('./routes/user.route');
const restaurantRoutes = require('./routes/restaurant.route');
const orderRoutes = require('./routes/order.route');
const mealRoutes = require('./routes/meal.route');

const app = express();

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(
  sanitizater.clean({
    xss: true,
    noSql: true,
    sql: false, //obligatoriamente debe ir en false
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);
//routes

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/meals', mealRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHander);

module.exports = app;
