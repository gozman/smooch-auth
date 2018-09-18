var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jsonwebtoken');
const smoochCore = require('smooch-core');
require('dotenv').config();

const appId = process.env.APP_ID;
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

if (!appId || !appKey || !appSecret) {
  console.log(appId);
  console.log(appKey);
  console.log(appSecret);
  const noSmoochConfig = "missing smooch configuration";
  console.log(noSmoochConfig);
  throw noSmoochConfig;
}

const smooch = new smoochCore({
  keyId: appKey,
  secret: appSecret,
  scope: 'app'
});

router.get('/', function(req, res, next) {
  res.redirect('/profile');
});

router.get('/login', function(req, res, next) {
  res.clearCookie('authCode');
  res.clearCookie('smoochJwt');
  res.clearCookie('userId');
  res.clearCookie('source');

  if(req.query.authcode) {
    req.session.authcode = req.query.authcode;
  }

  if(req.query.source) {
    req.session.source = req.query.source;
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

  var twilioNumber;
  var pageId;

  if(req.session.source == 'messenger') {
    res.render('profile', { user: req.user.local, appId: process.env.APP_ID, pageId: "320899295336596" });
  } else if(req.session.source == 'twilio') {
    res.render('profile', { user: req.user.local, appId: process.env.APP_ID, twilioNumber: "+18552506960" });
  } else if {
    res.render('profile', { user: req.user.local, appId: process.env.APP_ID, whatsAppId: "14384763261" });
  } else {
    res.render('profile', { user: req.user.local, appId: process.env.APP_ID });
  }

/*
  smooch.integrations.list(appId).then((response) => {
    var integrations = response;
    for(var i=0; i<integrations.length; i++) {
      if(integrations[i].type == req.session.source) {
        switch(integrations[i].type) {
          case "messenger":
            res.render('profile', { user: req.user.local, appId: process.env.APP_ID, pageId: integrations[i].pageId });
            break;
          case "twilio":
            res.render('profile', { user: req.user.local, appId: process.env.APP_ID, twilioNumber: integrations[i].phoneNumber });
            break;
          default:
            res.render('profile', { user: req.user.local, appId: process.env.APP_ID });
        }

        break;
      }
    }
  });
  */
});

router.get('/logout', function(req, res) {
  res.clearCookie('authCode');
  res.clearCookie('smoochJwt');
  res.clearCookie('userId');

  req.session.authcode = undefined;
  req.session.source = undefined;

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
