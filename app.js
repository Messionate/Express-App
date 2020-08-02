var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // also can save using mongoose module Ex: in Story app Pc
const passport = require('passport');
const authenticate = require('./authenticate');

const config = require('./config');
const indexRouter = require('./routes/index');
const router = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let promoRouter = require('./routes/promoRouter');
let leaderRouter = require('./routes/leaderRouter');




const url = config.mongoUrl;
const connect = mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser: true});
connect.then(db =>{
  console.log('Connected Successfully');
})
.catch(err => console.log(err));

var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




// app.use(session({
//   name:'session-Id',
//   secret: '12345-67890-23459-98123',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
//app.use(passport.session());


// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//         next();
//   }
// }
// app.use(auth);


app.use('/', indexRouter);
app.use('/users', router);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

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
