require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoConnect = require('./database/scripts/mongo-connect.js');
const indexRouter = require('./routes/index.router.js');
const apiRouter = require('./routes/api/api.router.js');
const downloadRouter = require('./routes/download.router.js');
const startSocket = require('./socket/index.js');
const { pricePoll } = require('./controllers/api/bsi.controller.js');

const app = express();
const server = http.createServer(app);
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/BSI-Website';
const pollDelay = process.env.POLL_DELAY || 180000;

/* ======================= MongoDB Connection ======================= */

mongoConnect(mongoUrl);

/* ======================= View Engine Setup ======================= */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ======================= Global Middlewares ======================= */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.locals.title = 'Bali Social Integrated';
  next();
});

/* ======================= Socket ======================= */

// const io = startSocket(server);
// This poll will constantly ask for the latest price on database.
// And it will send data to client whenever there is a new data.
// pricePoll(io, pollDelay);

/* ======================= Routes ======================= */

app.use('/api/v1', apiRouter);
app.use('/download', downloadRouter);
app.use('/:lang', indexRouter);
app.get('*', (req, res) => {
  res.redirect('/en/home');
});

/* ======================= Error Middleware ======================= */

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
