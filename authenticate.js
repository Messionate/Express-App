// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// var User = require('./models/user');

//passport.use(new LocalStrategy(User.authenticate()));

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());