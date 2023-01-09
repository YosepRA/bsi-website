require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoConnect = require('./database/scripts/mongo-connect.js');
const indexRouter = require('./routes/index.js');
const bsiRouter = require('./routes/bsi.js');
const startSocket = require('./socket/index.js');

const app = express();
const server = http.createServer(app);
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/BSI-exchange-collector';

/* ======================= MongoDB Connection ======================= */

const dbConnection = mongoConnect(mongoUrl);

/* ======================= View Engine Setup ======================= */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ======================= Global Middlewares ======================= */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ======================= Socket ======================= */

startSocket(server);

/* ======================= Routes ======================= */

app.use('/api/v1', bsiRouter);
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
