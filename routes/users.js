var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const authenticate = require("../authenticate");

/* GET users listing. */
router.get("/",authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  
  User.find()
  .then(users => {
    res.status = 200;
    res.setHeader('Content-Type','application/json')
    res.json(users)
  })
  .catch(err => next(err));
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstName = req.body.firstname;
      if (req.body.lastname)
        user.lastName = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!',user:user});
        });
      });
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  let token = authenticate.getToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!"
  });
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    let err = new Error("you are not logged in");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
