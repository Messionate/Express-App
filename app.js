var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session); // also can save using mongoose module Ex: in Story app Pc

var indexRouter = require('./routes/index');
var router = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let promoRouter = require('./routes/promoRouter');
let leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
//const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';
const connect = mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser: true});
connect.then(db =>{
  console.log('Connected Successfully');
})
.catch(err => console.log(err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-23459-98123'));

app.use(session({
  name:'session-Id',
  secret: '12345-67890-23459-98123',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', router);

function auth (req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
          var err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');                        
          err.status = 403;
          next(err);
          return;
      

  }
  else {
      if (req.session.user === 'authenticated') {
          console.log('req.session: ',req.session);
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 403;
          next(err);
      }
  }
}

// function auth(req,res,next){
//   //console.log(req.headers);
//   //console.log(req.signedCookies);

//   if(!req.session.user){

//   let authHeader = req.headers.authorization;
//   if(!authHeader){
//     let err = new Error('You are not authenticated');
//     res.setHeader('WWW-Authenticate','Basic');
//     err.status = 401;
//     return next(err)
//   }else{
//     let auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

//     let username = auth[0];
//     let password = auth[1];

//     if(username === 'admin' && password === 'password'){
//       res.session.username = 'admin';   //res.cookie('user','admin',{signed: true})
//       next();
//     }else{
//       let err = new Error('You are not authenticated');
//       res.setHeader('WWW-Authenticate','Basic');
//       err.status = 401;
//       next(err)
//     }

//   }
// }else{ //signedCookies
//     if(req.session.user === 'admin'){
//       console.log(req.session)
//       next();
//     }else{
//       let err = new Error('You are not authenticated')
//       err.status = 401;
//       return next(err)
//     }
// }
// }

app.use(auth);

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
