var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var opinionsRouter = require('./routes/opinions');

// MongoDB configuration
const mongoose = require('mongoose');

if (process.env.MONGODB_URI) {
  // Check for local usage later
  if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    mongoose.connect(`${process.env.MONGODB_URI}/test`);
  }
} else if (process.env.NODE_ENV === 'test') {
  mongoose.connect(`mongodb://mongo:27017/test`);
} else {
  mongoose.connect(`mongodb://mongo:27017`);
}

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/opinions', opinionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log error
  console.error('Internal error :: ', err);

  // render the error page
  res.status(err.status || 500);
  res.send('Resource not found');
});

const { PORT = '3000' } = process.env;

app.listen(PORT, () => {
  console.log(`Magic happening on port :: ${PORT}`)
});

module.exports = app;