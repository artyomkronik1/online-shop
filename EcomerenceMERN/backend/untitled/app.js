var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=  require('cors')
var app = express();


/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//import routes
var productsRoute = require('./routes/products');
var ordersRoute = require('./routes/orders');
var userRoute = require('./routes/user');
var loginRoute= require('./routes/login')
var dealsRoute= require('./routes/deals')
var categoriesRoute=require('./routes/categories')
//use routes
app.use('/api/products', productsRoute);
app.use('/api/productsByProperties', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/signup', userRoute);
app.use('/api/login', loginRoute);
app.use('/api/deals', dealsRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
    
module.exports = app;
