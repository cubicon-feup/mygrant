const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const appInfoRouter = require('./routes/appInfo');
const servicesRouter = require('./routes/services');
const newsfeedRouter = require('./routes/newsfeed');
const usersRouter = require('./routes/users');
const crowdfundingsRouter = require('./routes/crowdfundings');

const app = express();

// All requests enabled - TODO only allow requests originating from our server
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/api/app_info', appInfoRouter);
app.use('/api/services', servicesRouter);
app.use('/api/newsfeed', newsfeedRouter);
app.use('/api/users', usersRouter);
app.use('/api/crowdfundings', crowdfundingsRouter);

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
