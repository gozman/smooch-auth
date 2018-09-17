var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.redirect('/profile');
});

router.get('/login', function(req, res, next) {
  res.clearCookie('authCode');
  res.clearCookie('smoochJwt');
  res.clearCookie('userId');

  if(req.query.authcode) {
    req.session.authcode = req.query.authcode;
  }

  res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {

  if(req.session.authcode) {
    res.cookie('authCode', req.session.authcode);
  }

  res.cookie('smoochJwt', signJwt(req.user.local.email));
  res.cookie('userId', req.user.local.email);
  res.render('profile', { user: req.user.local, appId: process.env.APP_ID });
});

router.get('/logout', function(req, res) {
  res.clearCookie('authCode');
  res.clearCookie('smoochJwt');
  res.clearCookie('userId');

  req.session.authcode = undefined;

  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

function signJwt(userId) {
    return jwt.sign({
        scope: 'appUser',
        userId: userId
    },
    process.env.APP_SECRET,
    {
        header: {
            alg: 'HS256',
            typ: 'JWT',
            kid: process.env.APP_KEY
        }
    });
}
